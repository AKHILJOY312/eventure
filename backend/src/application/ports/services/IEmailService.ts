// src/domain/interfaces/IEmailService.ts
export interface IEmailService {
  sendEmailOtp(email: string, otp: string, name?: string): Promise<void>;
  sendBookingConfirmation(params: {
    email: string;
    name?: string;
    bookingId: string;
    serviceTitle: string;
    location: string;
    startDate: Date;
    endDate: Date;
    totalPrice: number;
  }): Promise<void>;

  //cancel
  sendCancelMessage(email: string, name: string): Promise<void>;
}
