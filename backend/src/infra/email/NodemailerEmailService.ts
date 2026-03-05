// src/infrastructure/email/NodemailerEmailService.ts
import nodemailer, { Transporter, SendMailOptions } from "nodemailer";
import { IEmailService } from "@/application/ports/services/IEmailService";
import { injectable } from "inversify";
import { ENV } from "@/config/env.config";

@injectable()
export class NodemailerEmailService implements IEmailService {
  private transporter: Transporter;
  private fromEmail: string;

  constructor() {
    const email = ENV.MAIL.USER;
    const pass = ENV.MAIL.PASS;

    if (!email || !pass) {
      throw new Error(
        "NODEMAILER_EMAIL and NODEMAILER_PASS must be defined in .env",
      );
    }

    this.fromEmail = email;

    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: email,
        pass,
      },
    });

    // Verification check for SMTP availability
    this.transporter.verify((error) => {
      if (error) {
        console.error("SMTP connection failed:", error);
      } else {
        console.log("SMTP ready – Email service is active.");
      }
    });
  }

  /**
   * Generates the HTML for the 6-digit OTP email
   */
  private getOtpTemplate(otp: string, name?: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background: #f9f9f9;">
        <h2 style="color: #1a73e8; text-align: center;">Verify Your Account</h2>
        <p style="text-align: center; font-size: 16px; color: #555;">
          Thank you for joining Pixel_Tasks, ${name || "there"}! Please use the following 6-digit code to complete your registration:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; font-size: 36px; font-weight: bold; letter-spacing: 10px; background: #ffffff; padding: 15px 30px; border-radius: 8px; color: #1a73e8; border: 2px solid #1a73e8;">
            ${otp}
          </span>
        </div>
        <p style="text-align: center; font-size: 14px; color: #888;">
          This code will expire in 10 minutes. If you did not request this code, please ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="text-align: center; font-size: 12px; color: #aaa;">
          &copy; ${new Date().getFullYear()} Pixel_Tasks Task Management. All rights reserved.
        </p>
      </div>
    `;
  }

  private getBookingConfirmationTemplate(params: {
    name?: string;
    bookingId: string;
    serviceTitle: string;
    location: string;
    startDate: Date;
    endDate: Date;
    totalPrice: number;
  }): string {
    const dateFormatter = new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const formattedStart = dateFormatter.format(params.startDate);
    const formattedEnd = dateFormatter.format(params.endDate);

    return `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background: #ffffff;">
        <h2 style="margin: 0 0 12px; color: #111827;">Booking Confirmed</h2>
        <p style="margin: 0 0 16px; color: #4b5563;">
          Hi ${params.name || "there"}, your booking has been confirmed by the admin.
        </p>

        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px;">
          <p style="margin: 0 0 8px; color: #111827;"><strong>Booking ID:</strong> ${params.bookingId}</p>
          <p style="margin: 0 0 8px; color: #111827;"><strong>Service:</strong> ${params.serviceTitle}</p>
          <p style="margin: 0 0 8px; color: #111827;"><strong>Location:</strong> ${params.location}</p>
          <p style="margin: 0 0 8px; color: #111827;"><strong>Dates:</strong> ${formattedStart} - ${formattedEnd}</p>
          <p style="margin: 0; color: #111827;"><strong>Total Price:</strong> INR ${params.totalPrice.toLocaleString("en-IN")}</p>
        </div>

        <p style="margin: 16px 0 0; color: #6b7280; font-size: 12px;">
          Please keep this email for your reference.
        </p>
      </div>
    `;
  }

  /**
   * Implementation of the IEmailService interface
   */
  async sendEmailOtp(email: string, otp: string, name?: string): Promise<void> {
    const mailOptions: SendMailOptions = {
      from: `"Pixel_Tasks Team" <${this.fromEmail}>`,
      to: email,
      subject: `Your Verification Code: ${otp}`,
      html: this.getOtpTemplate(otp, name),
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("OTP Email sent:", info.messageId, "to:", email);
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Failed to send OTP email:", {
        to: email,
        message: err.message,
      });
      throw new Error("EMAIL_DELIVERY_FAILED");
    }
  }

  async sendBookingConfirmation(params: {
    email: string;
    name?: string;
    bookingId: string;
    serviceTitle: string;
    location: string;
    startDate: Date;
    endDate: Date;
    totalPrice: number;
  }): Promise<void> {
    const mailOptions: SendMailOptions = {
      from: `"Event Booking Team" <${this.fromEmail}>`,
      to: params.email,
      subject: `Booking Confirmed - ${params.serviceTitle}`,
      html: this.getBookingConfirmationTemplate(params),
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Booking confirmation email sent:", info.messageId, "to:", params.email);
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Failed to send booking confirmation email:", {
        to: params.email,
        message: err.message,
      });
      throw new Error("BOOKING_CONFIRMATION_EMAIL_FAILED");
    }
  }
}
