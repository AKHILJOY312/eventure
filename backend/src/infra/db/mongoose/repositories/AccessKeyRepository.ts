import { IAccessKeyRepository } from "@/application/ports/repositories/IAccessKeyRepository";
import { AccessKeyModel } from "../models/AccessKeyModel";
import { AccessKey } from "@/entities/AccessKey";

export class AccessKeyRepository implements IAccessKeyRepository {
  async findByKey(key: string): Promise<AccessKey | null> {
    const doc = await AccessKeyModel.findOne({ key, isUsed: false });

    if (!doc) return null;

    return new AccessKey({
      id: doc._id.toString(),
      key: doc.key,
      isUsed: doc.isUsed,
      usedBy: doc.usedBy ?? undefined,
    });
  }

  async validateAndUse(key: string, userEmail: string): Promise<boolean> {
    const result = await AccessKeyModel.findOneAndUpdate(
      {
        key: key,
        // isUsed: false,
      },
      {
        $set: {
          // isUsed: true,
          usedBy: userEmail.toLowerCase(),
          updatedAt: new Date(),
        },
      },
      { new: true },
    );
    return !!result;
  }

  async generateNewKey(key: string): Promise<AccessKey> {
    const doc = await AccessKeyModel.create({
      key,
      // isUsed: false,
    });

    return new AccessKey({
      id: doc._id.toString(),
      key: doc.key,
      isUsed: doc.isUsed,
    });
  }
}
