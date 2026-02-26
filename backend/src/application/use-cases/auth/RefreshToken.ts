// src/application/use-cases/auth/RefreshToken.ts
import { injectable, inject } from "inversify";
import { TYPES } from "@/config/di/types";

import { IAuthService } from "@/application/ports/services/IAuthService";
import { UnauthorizedError } from "@/application/error/AppError";
import { IRefreshToken } from "@/application/ports/use-cases/auth/interfaces";
import { IUserRepository } from "@/application/ports/repositories/IUserRepository";

@injectable()
export class RefreshToken implements IRefreshToken {
  constructor(
    @inject(TYPES.UserRepository) private userRepo: IUserRepository,
    @inject(TYPES.AuthService) private auth: IAuthService,
  ) {}

  async execute(refreshToken: string): Promise<{ accessToken: string }> {
    // 1. Verify the refresh token structure
    const decoded = this.auth.verifyRefreshToken(refreshToken);
    if (!decoded) throw new UnauthorizedError("INVALID_REFRESH_TOKEN");

    // 2. Fetch user to verify current state
    const user = await this.userRepo.findById(decoded.id);
    if (!user || !user.isVerified) {
      throw new UnauthorizedError("SESSION_EXPIRED_OR_INVALID");
    }

    // 3. Generate new Access Token using the current Security Stamp
    const accessToken = this.auth.generateAccessToken(
      user.id!,
      user.email,
      user.securityStamp || "",
    );

    return { accessToken };
  }
}
