import { Otp, OtpPurpose } from "@/entities/Otp";

export interface IOtpRepository {
  findById(id: string): Promise<Otp | null>;
  findActive(userId: string, purpose: OtpPurpose): Promise<Otp | null>;

  create(otp: Otp): Promise<Otp>;
  update(otp: Otp): Promise<void>;
}
