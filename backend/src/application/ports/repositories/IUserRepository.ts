import { User } from "@/entities/User";

// IUserQueryRepository.ts
export interface IUserQueryRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  findByRole(role: User["role"]): Promise<User[]>;
  findVerifiedOnly(): Promise<User[]>;
  existsByEmail(email: string): Promise<boolean>;
  // findSummaries(): Promise<UserSummary[]>;
}

// IUserCommandRepository.ts
export interface IUserCommandRepository {
  create(user: User): Promise<User>;
  update(user: User): Promise<void>;
  delete(userId: string): Promise<void>;
  updatePassword(userId: string, hashedPassword: string): Promise<void>;
  markVerified(userId: string): Promise<void>;
}

// IUserRepository.ts (combined)
export interface IUserRepository
  extends IUserQueryRepository, IUserCommandRepository {}
