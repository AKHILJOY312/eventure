// src/infrastructure/auth/JwtAuthService.ts
import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { injectable, inject } from "inversify";
import { TYPES } from "@/config/di/types";
import { IAuthService } from "@/application/ports/services/IAuthService";
import { ENV } from "@/config/env.config";
import { IUserRepository } from "@/application/ports/repositories/IUserRepository";

@injectable()
export class JwtAuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository) private userRepo: IUserRepository,
  ) {}

  /** Encryption */
  async hashPassword(plain: string): Promise<string> {
    return bcrypt.hash(plain, 10);
  }

  async comparePassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }

  /** Token Management */
  generateAccessToken(userId: string, email: string, stamp: string): string {
    const options: SignOptions = {
      expiresIn: ENV.JWT.ACCESS_EXPIRY as SignOptions["expiresIn"],
    };

    // We embed the securityStamp (stamp) into the payload
    return jwt.sign(
      { id: userId, email, stamp },
      ENV.JWT.ACCESS_SECRET!,
      options,
    );
  }

  generateRefreshToken(userId: string): string {
    const options: SignOptions = {
      expiresIn: ENV.JWT.REFRESH_EXPIRY as SignOptions["expiresIn"],
    };

    return jwt.sign({ id: userId }, ENV.JWT.REFRESH_SECRET!, options);
  }

  verifyRefreshToken(token: string): { id: string } | null {
    try {
      const decoded = jwt.verify(token, ENV.JWT.REFRESH_SECRET!) as {
        id: string;
      };
      return { id: decoded.id };
    } catch {
      return null;
    }
  }

  /** Session Control */

  /**
   * PRO WAY: Invalidation by rotation.
   * By changing the user's securityStamp in the DB, all existing access tokens
   * (which contain the OLD stamp) will fail validation in your Auth Middleware.
   */
  async invalidateUserSessions(userId: string): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) return; // Silent return if user doesn't exist

    const newStamp = this.generateToken();
    user.updateSecurityStamp(newStamp);

    await this.userRepo.update(user);
  }

  /**
   * Generates a high-entropy random string for security stamps or secrets
   */
  generateToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  /** Verification */

  /**
   * PRO WAY: Generates a 6-digit OTP as a string to preserve leading zeros.
   * Example: 001234
   */
  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
