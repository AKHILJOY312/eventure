// src/application/use-cases/auth/RegisterUser.ts
import { injectable, inject } from "inversify";
import { TYPES } from "@/config/di/types";
import { User } from "@/entities/User";
import { Otp } from "@/entities/Otp";

import { RegisterUserDto } from "@/application/dto/auth.dtos";

import { IAuthService } from "@/application/ports/services/IAuthService";
import { IEmailService } from "@/application/ports/services/IEmailService";
import { IUserRepository } from "@/application/ports/repositories/IUserRepository";
import { IOtpRepository } from "@/application/ports/repositories/IOtpRepository";

import { BadRequestError } from "@/application/error/AppError";
import { IRegisterUser } from "@/application/ports/use-cases/auth/interfaces";

@injectable()
export class RegisterUser implements IRegisterUser {
  constructor(
    @inject(TYPES.UserRepository) private _userRepo: IUserRepository,
    @inject(TYPES.OtpRepository) private _otpRepo: IOtpRepository,
    @inject(TYPES.AuthService) private _authSvc: IAuthService,
    @inject(TYPES.EmailService) private _emailSvc: IEmailService,
  ) {}

  async execute(
    dto: RegisterUserDto,
  ): Promise<{ message: string; email: string }> {
    // 1. Validate business rules (you can extract to validator / domain service later)
    if (!dto.email || !dto.name?.trim() || !dto.password) {
      throw new BadRequestError("MISSING_REQUIRED_FIELDS");
    }

    // 2. Check for existing user
    const existing = await this._userRepo.findByEmail(dto.email);
    if (existing) {
      // Optional: if not verified → could allow re-registration or just say already exists
      throw new BadRequestError("USER_ALREADY_EXISTS");
    }

    // 3. Create domain entities
    const hashedPassword = await this._authSvc.hashContent(dto.password);
    const securityStamp = this._authSvc.generateToken(); // e.g. crypto.randomUUID()

    const user = new User({
      name: dto.name.trim(),
      email: dto.email.toLowerCase().trim(),
      password: hashedPassword,
      role: "user",
      isVerified: false,
      securityStamp,
      // Note: no otp field anymore — OTP lives in separate table
    });

    // 4. Generate OTP (plain text for email, but we'll hash it for storage)
    const plainOtp = this._authSvc.generateOtp(); // e.g. "483921" (6 digits)
    const hashedOtp = await this._authSvc.hashContent(plainOtp); // ← important!

    const otpEntity = Otp.createNew(
      user.id!, // will be set after create if using auto-id
      hashedOtp,
      "email-verification",
      // optional: 15 * 60 * 1000 → 15 min TTL
    );

    // 5. Persist (ideally in a transaction — see note below)
    const createdUser = await this._userRepo.create(user);

    // Now that user has real ID (if DB generated it)

    otpEntity.setUserId(createdUser.id!); // important if ID was generated

    await this._otpRepo.create(otpEntity);

    // 6. Send email with **plain** OTP (never send hashed value)
    await this._emailSvc.sendEmailOtp(
      createdUser.email,
      plainOtp, // plain code
      createdUser.name, // optional: personalize email
    );

    return {
      message: "REGISTRATION_SUCCESS_CHECK_EMAIL_FOR_OTP",
      email: createdUser.email,
    };
  }
}
