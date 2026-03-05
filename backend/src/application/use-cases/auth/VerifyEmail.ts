import { injectable, inject } from "inversify";
import { TYPES } from "@/config/di/types";
import { VerifyEmailDto } from "@/application/dto/auth.dtos";
import { BadRequestError } from "@/application/error/AppError";
import { IUserRepository } from "@/application/ports/repositories/IUserRepository";
import { IOtpRepository } from "@/application/ports/repositories/IOtpRepository";
import { IVerifyEmail } from "@/application/ports/use-cases/auth/interfaces";
import { IAuthService } from "@/application/ports/services/IAuthService";

@injectable()
export class VerifyEmail implements IVerifyEmail {
  constructor(
    @inject(TYPES.UserRepository) private _userRepo: IUserRepository,
    @inject(TYPES.OtpRepository) private _otpRepo: IOtpRepository,
    @inject(TYPES.AuthService) private _authSvc: IAuthService,
  ) {}

  async execute(dto: VerifyEmailDto): Promise<{ message: string }> {
    const user = await this._userRepo.findByEmail(dto.email);
    if (!user) {
      throw new BadRequestError("INVALID_EMAIL_OR_CODE");
    }

    if (user.isVerified) {
      return { message: "ACCOUNT_ALREADY_VERIFIED" };
    }

    const otpRecord = await this._otpRepo.findActive(
      user.id!,
      "email-verification",
    );

    if (!otpRecord) {
      throw new BadRequestError("NO_ACTIVE_VERIFICATION_CODE");
    }

    const isMatch = await this._authSvc.compareContent(dto.otp, otpRecord.code);

    const isValid = otpRecord.validateAndConsume(isMatch);

    await this._otpRepo.update(otpRecord);

    if (!isValid) {
      if (otpRecord.isExpired()) {
        throw new BadRequestError("VERIFICATION_CODE_EXPIRED");
      }

      if (otpRecord.attempts >= otpRecord.maxAttempts) {
        throw new BadRequestError("TOO_MANY_ATTEMPTS_PLEASE_REQUEST_NEW_CODE");
      }

      throw new BadRequestError("INVALID_VERIFICATION_CODE");
    }

    user.verify();

    await Promise.all([
      this._userRepo.update(user),
      this._otpRepo.update(otpRecord),
    ]);

    return { message: "ACCOUNT_ACTIVATED_SUCCESSFULLY" };
  }
}
