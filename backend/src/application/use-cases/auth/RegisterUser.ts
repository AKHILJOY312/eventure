// src/application/use-cases/auth/RegisterUser.ts
import { injectable, inject } from "inversify";
import { TYPES } from "@/config/di/types";
import { User } from "@/entities/User";

import { RegisterUserDto } from "@/application/dto/authDtos";

import { IAuthService } from "@/application/ports/services/IAuthService";
import { IEmailService } from "@/application/ports/services/IEmailService";

import {
  BadRequestError,
  UnauthorizedError,
} from "@/application/error/AppError";
import { IRegisterUser } from "@/application/ports/use-cases/auth/interfaces";
import { IUserRepository } from "@/application/ports/repositories/IUserRepository";
import { IAccessKeyRepository } from "@/application/ports/repositories/IAccessKeyRepository";

@injectable()
export class RegisterUser implements IRegisterUser {
  constructor(
    @inject(TYPES.UserRepository) private userRepo: IUserRepository,
    @inject(TYPES.AuthService) private auth: IAuthService,
    @inject(TYPES.EmailService) private email: IEmailService,
    @inject(TYPES.AccessKeyRepository)
    private accessKeyRepo: IAccessKeyRepository,
  ) {}

  async execute(
    dto: RegisterUserDto,
  ): Promise<{ message: string; email: string }> {
    // 1. Validate Access Key (Gatekeeper)
    const isValidKey = await this.accessKeyRepo.validateAndUse(
      dto.accessKey,
      dto.email,
    );
    if (!isValidKey)
      throw new UnauthorizedError("INVALID_OR_EXPIRED_ACCESS_KEY");

    // 2. Check existing user
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) throw new BadRequestError("USER_ALREADY_EXISTS");

    // 3. Prepare User Data
    const hashed = await this.auth.hashPassword(dto.password);
    const otp = this.auth.generateOtp(); // 6-digit string
    const stamp = this.auth.generateToken(); // Random string for securityStamp

    const user = new User({
      name: dto.name,
      email: dto.email,
      password: hashed,
      otpCode: otp,
      isVerified: false,
      securityStamp: stamp,
    });

    // 4. Persist and Notify
    await this.userRepo.create(user);
    await this.email.sendEmailOtp(user.email, otp);

    return {
      message: "REGISTRATION_SUCCESS_CHECK_EMAIL_FOR_OTP",
      email: user.email,
    };
  }
}
