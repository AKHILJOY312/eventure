// src/application/use-cases/auth/VerifyEmail.ts
import { injectable, inject } from "inversify";
import { TYPES } from "@/config/di/types";
import { VerifyEmailDto } from "@/application/dto/auth.dtos";
import { BadRequestError } from "@/application/error/AppError";
import { IUserRepository } from "@/application/ports/repositories/IUserRepository";
import { IOtpRepository } from "@/application/ports/repositories/IOtpRepository";
import { IVerifyEmail } from "@/application/ports/use-cases/auth/interfaces";
// import { OtpPurpose } from "@/entities/Otp";

@injectable()
export class VerifyEmail implements IVerifyEmail {
  constructor(
    @inject(TYPES.UserRepository) private userRepo: IUserRepository,
    @inject(TYPES.OtpRepository) private otpRepo: IOtpRepository,
  ) {}

  async execute(dto: VerifyEmailDto): Promise<{ message: string }> {
    // 1. Find user
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) {
      throw new BadRequestError("INVALID_EMAIL_OR_CODE");
    }

    if (user.isVerified) {
      return { message: "ACCOUNT_ALREADY_VERIFIED" };
    }

    // 2. Find active OTP for email verification
    const otpRecord = await this.otpRepo.findActive(
      user.id!,
      "email-verification",
    );

    if (!otpRecord) {
      throw new BadRequestError("NO_ACTIVE_VERIFICATION_CODE");
    }

    // 3. Validate OTP (handles expiration, attempts, consumed status)
    const isValid = otpRecord.validateAndConsume(dto.otp);

    if (!isValid) {
      // You may want to save the updated attempts count
      await this.otpRepo.update(otpRecord);

      if (otpRecord.isExpired()) {
        throw new BadRequestError("VERIFICATION_CODE_EXPIRED");
      }
      if (otpRecord.attempts >= otpRecord.attempts!) {
        throw new BadRequestError("TOO_MANY_ATTEMPTS_PLEASE_REQUEST_NEW_CODE");
      }
      throw new BadRequestError("INVALID_VERIFICATION_CODE");
    }

    // 4. OTP is valid → verify user
    user.verify(); // sets isVerified = true, updates timestamp

    // 5. Persist changes
    await Promise.all([
      this.userRepo.update(user),
      this.otpRepo.update(otpRecord), // marks as consumed
    ]);

    return { message: "ACCOUNT_ACTIVATED_SUCCESSFULLY" };
  }
}
