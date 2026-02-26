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
  private getOtpTemplate(otp: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background: #f9f9f9;">
        <h2 style="color: #1a73e8; text-align: center;">Verify Your Account</h2>
        <p style="text-align: center; font-size: 16px; color: #555;">
          Thank you for joining Pixel_Tasks. Please use the following 6-digit code to complete your registration:
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

  /**
   * Implementation of the IEmailService interface
   */
  async sendEmailOtp(email: string, otp: string): Promise<void> {
    const mailOptions: SendMailOptions = {
      from: `"Pixel_Tasks Team" <${this.fromEmail}>`,
      to: email,
      subject: `Your Verification Code: ${otp}`,
      html: this.getOtpTemplate(otp),
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
}
