// src/infrastructure/models/OtpModel.ts
import mongoose, { Document, Schema, Types } from "mongoose";
import { Otp, OtpProps } from "@/entities/Otp";

export interface OtpDoc extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  code: string; // Hashed
  purpose: "email-verification" | "password-reset" | "2fa-login";
  expiresAt: Date;
  isConsumed: boolean;
  attempts: number;
  maxAttempts?: number;
  createdAt: Date;
}

const otpSchema = new Schema<OtpDoc>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    code: { type: String, required: true },
    purpose: {
      type: String,
      enum: ["email-verification", "password-reset", "2fa-login"],
      required: true,
    },
    expiresAt: { type: Date, required: true, index: { expires: 0 } }, // TTL index
    isConsumed: { type: Boolean, default: false },
    attempts: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 3 },
  },
  { timestamps: true },
);

export const OtpModel = mongoose.model<OtpDoc>("Otp", otpSchema);

// Mapper: Mongo → Domain
export const toOtpEntity = (doc: OtpDoc): Otp => {
  const props: OtpProps = {
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    code: doc.code,
    purpose: doc.purpose,
    expiresAt: doc.expiresAt,
    isConsumed: doc.isConsumed,
    attempts: doc.attempts,
    maxAttempts: doc.maxAttempts,
    createdAt: doc.createdAt,
  };
  return new Otp(props);
};
