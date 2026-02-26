// src/application/use-cases/auth/VerifyEmail.ts
import { injectable, inject } from "inversify";
import { TYPES } from "@/config/di/types";
import { VerifyEmailDto } from "@/application/dto/authDtos";
import { BadRequestError } from "@/application/error/AppError";
import { IUserRepository } from "@/application/ports/repositories/IUserRepository";
import { IVerifyEmail } from "@/application/ports/use-cases/auth/interfaces";

@injectable()
export class VerifyEmail implements IVerifyEmail {
  constructor(
    @inject(TYPES.UserRepository) private userRepo: IUserRepository,
  ) {}

  async execute(dto: VerifyEmailDto): Promise<{ message: string }> {
    const user = await this.userRepo.findByEmail(dto.email);

    if (!user || user.otpCode !== dto.otp) {
      throw new BadRequestError("INVALID_VERIFICATION_CODE");
    }

    user.verify(); // Flips isVerified to true and clears otpCode
    await this.userRepo.update(user);

    return { message: "ACCOUNT_ACTIVATED_SUCCESSFULLY" };
  }
}
