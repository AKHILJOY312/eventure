// src/infrastructure/repositories/OtpRepository.ts
import { HydratedDocument, Types } from "mongoose";
import { OtpModel, OtpDoc, toOtpEntity } from "../models/OtpModel";

import { IOtpRepository } from "@/application/ports/repositories/IOtpRepository";
import { Otp, OtpPurpose } from "@/entities/Otp";

export class OtpRepository implements IOtpRepository {
  // ────────────────────────────────────────────────
  //  Helpers: Domain ↔ Persistence mapping
  // ────────────────────────────────────────────────
  private toDomain(doc: HydratedDocument<OtpDoc>): Otp {
    return toOtpEntity(doc);
  }

  private toPersistence(otp: Otp): Partial<OtpDoc> {
    return {
      userId: otp.userId ? new Types.ObjectId(otp.userId) : undefined,
      code: otp.code,
      purpose: otp.purpose,
      expiresAt: otp.expiresAt,
      isConsumed: otp.isConsumed,
      attempts: otp.attempts,
      maxAttempts: otp.maxAttempts,
      // createdAt / updatedAt → handled by mongoose timestamps
    };
  }

  // ────────────────────────────────────────────────
  //  Core CRUD + domain-specific methods
  // ────────────────────────────────────────────────

  async findById(id: string): Promise<Otp | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    const doc = await OtpModel.findById(id);
    return doc ? this.toDomain(doc) : null;
  }

  async findActive(userId: string, purpose: OtpPurpose): Promise<Otp | null> {
    if (!Types.ObjectId.isValid(userId)) return null;

    const doc = await OtpModel.findOne({
      userId: new Types.ObjectId(userId),
      purpose,
      isConsumed: false,
      expiresAt: { $gt: new Date() }, // not expired
    }).sort({ createdAt: -1 }); // most recent first

    return doc ? this.toDomain(doc) : null;
  }

  async create(otp: Otp): Promise<Otp> {
    const doc = await OtpModel.create(this.toPersistence(otp));
    return this.toDomain(doc);
  }

  async update(otp: Otp): Promise<void> {
    if (!otp.id) {
      throw new Error("Cannot update OTP without id");
    }

    await OtpModel.updateOne(
      { _id: new Types.ObjectId(otp.id) },
      { $set: this.toPersistence(otp) },
    );
  }

  async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;

    const result = await OtpModel.deleteOne({ _id: new Types.ObjectId(id) });
    return result.deletedCount === 1;
  }
}
