import { UserRole } from "@/entities/User";

export interface IAuthService {
  /** Encryption */
  hashContent(plain: string): Promise<string>;
  compareContent(plain: string, hash: string): Promise<boolean>;

  /** Token Management */

  generateAccessToken(
    userId: string,
    email: string,
    role: UserRole,
    stamp: string,
  ): string;
  generateRefreshToken(userId: string, stamp: string): string;
  verifyRefreshToken(token: string): { id: string; stamp: string } | null;

  /** Session Control */

  invalidateUserSessions(userId: string): Promise<void>;
  generateToken(): string;

  /** Verification */

  generateOtp(): string;
}
