// src/domain/interfaces/IEmailService.ts
export interface IEmailService {
  sendEmailOtp(email: string, otp: string, name?: string): Promise<void>;
  // sendBookingConfirmation(email: string, bookingDetails: any): Promise<void>;
  // sendBookingCancellation(email: string, bookingDetails: any): Promise<void>;
}
