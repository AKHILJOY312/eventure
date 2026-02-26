// src/infrastructure/models/AccessKeyModel.ts
import mongoose, { Document, Schema, Types } from "mongoose";

export interface AccessKeyDoc extends Document {
  _id: Types.ObjectId;
  key: string; // The 6-digit unique string
  isUsed: boolean;
  usedBy?: string; // Email of the user who used it
  createdAt: Date;
  updatedAt: Date;
}

const accessKeySchema = new Schema<AccessKeyDoc>(
  {
    key: { type: String, required: true, unique: true, length: 6 },
    isUsed: { type: Boolean, default: false },
    usedBy: { type: String, default: null },
  },
  { timestamps: true },
);

export const AccessKeyModel = mongoose.model<AccessKeyDoc>(
  "AccessKey",
  accessKeySchema,
);
