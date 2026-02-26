// src/application/use-cases/auth/LoginUser.ts
import { injectable, inject } from "inversify";
import { TYPES } from "@/config/di/types";

import { IAuthService } from "@/application/ports/services/IAuthService";
import { UnauthorizedError } from "@/application/error/AppError";
import { LoginUserResponseDTO } from "@/application/dto/authDtos";
import { ILoginUser } from "@/application/ports/use-cases/auth/interfaces";
import { IUserRepository } from "@/application/ports/repositories/IUserRepository";

@injectable()
export class LoginUser implements ILoginUser {
  constructor(
    @inject(TYPES.UserRepository) private userRepo: IUserRepository,
    @inject(TYPES.AuthService) private auth: IAuthService,
  ) {}

  async execute(
    email: string,
    password: string,
  ): Promise<LoginUserResponseDTO> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new UnauthorizedError("INVALID_CREDENTIALS");

    // 1. Verify Password
    const isMatch = await this.auth.comparePassword(password, user.password);
    if (!isMatch) throw new UnauthorizedError("INVALID_CREDENTIALS");

    // 2. Check Verification Status
    if (!user.isVerified) {
      throw new UnauthorizedError("ACCOUNT_NOT_VERIFIED_CHECK_EMAIL");
    }

    // 3. Generate Tokens
    const accessToken = this.auth.generateAccessToken(
      user.id!,
      user.email,
      user.securityStamp!,
    );
    const refreshToken = this.auth.generateRefreshToken(user.id!);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id!,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    };
  }
}
