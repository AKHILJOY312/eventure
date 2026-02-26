// src/infrastructure/repositories/UserRepository.ts
import { IUserRepository } from "@/application/ports/repositories/IUserRepository";
import { User } from "@/entities/User";
import { HydratedDocument } from "mongoose";
import { toUserEntity, UserDoc, UserModel } from "../models/UserModal";

export class UserRepository implements IUserRepository {
  private toDomain(doc: HydratedDocument<UserDoc>): User {
    return toUserEntity(doc);
  }

  private toPersistence(user: User): Partial<UserDoc> {
    return {
      name: user.name,
      email: user.email,
      password: user.password,
      otpCode: user.otpCode || null,
      isVerified: user.isVerified,
      securityStamp: user.securityStamp,
    };
  }

  async create(user: User): Promise<User> {
    const doc = await UserModel.create(this.toPersistence(user));
    return this.toDomain(doc);
  }

  async update(user: User): Promise<void> {
    await UserModel.updateOne(
      { _id: user.id },
      { $set: this.toPersistence(user) },
    );
  }

  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id);
    return doc ? this.toDomain(doc) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email: email.toLowerCase() });
    return doc ? this.toDomain(doc) : null;
  }

  async findByOtpCode(otpCode: string): Promise<User | null> {
    const doc = await UserModel.findOne({ otpCode });
    return doc ? this.toDomain(doc) : null;
  }

  async delete(userId: string): Promise<void> {
    await UserModel.deleteOne({ _id: userId });
  }

  // Specific updates for security
  async updateVerificationStatus(
    userId: string,
    isVerified: boolean,
  ): Promise<void> {
    await UserModel.updateOne(
      { _id: userId },
      { $set: { isVerified, otpCode: null } },
    );
  }

  async updateSecurityStamp(userId: string, stamp: string): Promise<void> {
    await UserModel.updateOne(
      { _id: userId },
      { $set: { securityStamp: stamp } },
    );
  }
}
