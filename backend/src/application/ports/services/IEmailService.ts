// src/domain/interfaces/IEmailService.ts
export interface IEmailService {
  sendEmailOtp(email: string, otp: string): Promise<void>;
}
