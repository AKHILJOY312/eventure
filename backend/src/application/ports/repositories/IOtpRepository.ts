import { Otp, OtpPurpose } from "@/entities/Otp";

// IOtpQueryRepository.ts
export interface IOtpQueryRepository {
  findById(id: string): Promise<Otp | null>;
  findActive(userId: string, purpose: OtpPurpose): Promise<Otp | null>;
  findAllByUser(userId: string): Promise<Otp[]>;
  countRecentAttempts(
    userId: string,
    purpose: OtpPurpose,
    windowMs: number,
  ): Promise<number>;
}

// IOtpCommandRepository.ts
export interface IOtpCommandRepository {
  create(otp: Otp): Promise<Otp>;
  update(otp: Otp): Promise<void>;
  delete(otpId: string): Promise<void>;
  deleteExpired(): Promise<number>;
  deleteByUser(userId: string): Promise<void>;
  invalidateConsumed(): Promise<number>;
}

// IOtpRepository.ts (combined)
export interface IOtpRepository
  extends IOtpQueryRepository, IOtpCommandRepository {}
