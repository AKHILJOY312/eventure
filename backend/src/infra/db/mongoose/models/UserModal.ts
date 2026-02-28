// src/infrastructure/models/UserModel.ts
import { User, UserProps, UserRole } from "@/entities/User";
import mongoose, { Document, Schema, Types } from "mongoose";

export interface UserDoc extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isVerified: boolean;
  securityStamp: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDoc>(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true, // hashed using bcrypt before save
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    securityStamp: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const UserModel = mongoose.model<UserDoc>("User", userSchema);

// Mapper: Mongo → Domain
export const toUserEntity = (doc: UserDoc): User => {
  const props: UserProps = {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    password: doc.password,
    role: doc.role as UserRole,
    isVerified: doc.isVerified,
    securityStamp: doc.securityStamp,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
  return new User(props);
};
