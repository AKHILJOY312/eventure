export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export interface UserProps {
  id?: string;
  name: string;
  email: string;
  password: string; // hashed
  role: UserRole;
  isVerified: boolean;
  securityStamp: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private _props: UserProps;

  constructor(props: UserProps) {
    this._props = { ...props };
  }

  // ===== GETTERS =====
  get id(): string | undefined {
    return this._props.id;
  }
  get name(): string {
    return this._props.name;
  }
  get email(): string {
    return this._props.email;
  }
  get role(): UserRole {
    return this._props.role;
  }
  get isVerified(): boolean {
    return this._props.isVerified;
  }
  get securityStamp(): string {
    return this._props.securityStamp;
  }
  get createdAt(): Date {
    return this._props.createdAt || new Date();
  }
  get updatedAt(): Date | undefined {
    return this._props.updatedAt;
  }
  get password(): string {
    return this._props.password;
  }
  // ===== INFRASTRUCTURE =====
  setId(id: string): void {
    this._props.id = id;
  }
  updateSecurityStamp(stamp: string): void {
    this._props.securityStamp = stamp;
  }
  // ===== BUSINESS METHODS =====

  verify(): void {
    if (this._props.isVerified) return;
    this._props.isVerified = true;
    this._props.updatedAt = new Date();
  }

  updateProfile(name: string, email: string): void {
    if (name.trim().length < 2) {
      throw new Error("INVALID_NAME: Name must be at least 2 characters");
    }
    this._props.name = name.trim();
    this._props.email = email.toLowerCase().trim();
    this._props.updatedAt = new Date();
  }

  updatePassword(newHashedPassword: string): void {
    this._props.password = newHashedPassword;
    this._props.securityStamp = crypto.randomUUID(); // invalidate sessions
    this._props.updatedAt = new Date();
  }

  rotateSecurityStamp(): void {
    this._props.securityStamp = crypto.randomUUID();
    this._props.updatedAt = new Date();
  }

  isAdmin(): boolean {
    return this._props.role === UserRole.ADMIN;
  }
}
