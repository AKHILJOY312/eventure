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
    @inject(TYPES.UserRepository) private _userRepo: IUserRepository,
    @inject(TYPES.AuthService) private _authSvc: IAuthService,
  ) {}

  async execute(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // 1. Verify the refresh token structure
    const decoded = this._authSvc.verifyRefreshToken(refreshToken);
    if (!decoded) throw new UnauthorizedError("INVALID_REFRESH_TOKEN");

    // 2. Fetch user to verify current state
    const user = await this._userRepo.findById(decoded.id);
    if (!user || !user.isVerified) {
      throw new UnauthorizedError("SESSION_EXPIRED_OR_INVALID");
    }

    if (decoded.stamp !== user.securityStamp) {
      throw new UnauthorizedError("SESSION_EXPIRED_OR_INVALID");
    }

    // 3. Rotate stamp so the just-used refresh token cannot be replayed
    const rotatedStamp = this._authSvc.generateToken();
    user.updateSecurityStamp(rotatedStamp);
    await this._userRepo.update(user);

    // 4. Issue new token pair bound to the rotated stamp
    const accessToken = this._authSvc.generateAccessToken(
      user.id!,
      user.email,
      user.role,
      rotatedStamp,
    );
    const newRefreshToken = this._authSvc.generateRefreshToken(
      user.id!,
      rotatedStamp,
    );

    return { accessToken, refreshToken: newRefreshToken };
  }
}
