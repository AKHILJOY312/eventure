// src/domain/interfaces/IAccessKeyRepository.ts
import { AccessKey } from "@/entities/AccessKey";

export interface IAccessKeyRepository {
  findByKey(key: string): Promise<AccessKey | null>;
  validateAndUse(key: string, userEmail: string): Promise<boolean>;
  generateNewKey(key: string): Promise<AccessKey>;
}
