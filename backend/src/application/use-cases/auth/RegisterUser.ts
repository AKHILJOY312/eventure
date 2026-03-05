import { injectable, inject } from "inversify";
import { TYPES } from "@/config/di/types";
import { User, UserRole } from "@/entities/User";
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
    if (!dto.email || !dto.name?.trim() || !dto.password) {
      throw new BadRequestError("MISSING_REQUIRED_FIELDS");
    }

    const existing = await this._userRepo.findByEmail(dto.email);
    if (existing) {
      throw new BadRequestError("USER_ALREADY_EXISTS");
    }

    const hashedPassword = await this._authSvc.hashContent(dto.password);
    const securityStamp = this._authSvc.generateToken();

    const user = new User({
      name: dto.name.trim(),
      email: dto.email.toLowerCase().trim(),
      password: hashedPassword,
      role: UserRole.USER,
      isVerified: false,
      securityStamp,
    });

    const plainOtp = this._authSvc.generateOtp();
    const hashedOtp = await this._authSvc.hashContent(plainOtp);

    const otpEntity = Otp.createNew(user.id!, hashedOtp, "email-verification");

    const createdUser = await this._userRepo.create(user);

    otpEntity.setUserId(createdUser.id!);

    await this._otpRepo.create(otpEntity);

    await this._emailSvc.sendEmailOtp(
      createdUser.email,
      plainOtp,
      createdUser.name,
    );

    return {
      message: "REGISTRATION_SUCCESS_CHECK_EMAIL_FOR_OTP",
      email: createdUser.email,
    };
  }
}
