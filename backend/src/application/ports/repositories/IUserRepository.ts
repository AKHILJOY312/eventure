import { User } from "@/entities/User";

export interface IUserRepository {
  create(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(user: User): Promise<void>;
  delete(userId: string): Promise<void>;

  // Security & Verification specific
  findByOtpCode(otpCode: string): Promise<User | null>;
  updateVerificationStatus(userId: string, isVerified: boolean): Promise<void>;
  updateSecurityStamp(userId: string, stamp: string): Promise<void>;
}
