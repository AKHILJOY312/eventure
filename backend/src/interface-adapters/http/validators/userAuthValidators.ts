// src/interface-adapters/http/validators/userAuthValidators.ts
import { z } from "zod";

const accessKeySchema = z
  .string()
  .length(6, "Access key must be exactly 6 characters")
  .transform((val) => val.trim());

const otpSchema = z
  .string()
  .length(6, "OTP code must be 6 digits")
  .regex(/^\d+$/, "OTP must contain only numbers");

export const registerSchema = z
  .object({
    name: z.string().min(2).max(50),
    email: z.string().email().toLowerCase(),
    password: z.string().min(8),
    confirmPassword: z.string(),
    accessKey: accessKeySchema, // The 6-digit restricted key
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const verifyEmailSchema = z.object({
  email: z.string().email(),
  otp: otpSchema,
});
