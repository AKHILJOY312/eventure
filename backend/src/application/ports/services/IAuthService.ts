export interface IAuthService {
  /** Encryption */
  hashPassword(plain: string): Promise<string>;
  comparePassword(plain: string, hash: string): Promise<boolean>;

  /** Token Management */

  generateAccessToken(userId: string, email: string, stamp: string): string;
  generateRefreshToken(userId: string): string;
  verifyRefreshToken(token: string): { id: string } | null;

  /** Session Control */

  invalidateUserSessions(userId: string): Promise<void>;
  generateToken(): string;

  /** Verification */

  generateOtp(): string;
}
