export interface UserProps {
  id?: string;
  name: string;
  email: string;
  password: string;
  otpCode?: string; // 6-digit verification code
  isVerified: boolean;
  securityStamp: string; // Session tracking
  createdAt?: Date;
}

export class User {
  private _props: UserProps;

  constructor(props: UserProps) {
    this._props = { ...props, isVerified: props.isVerified || false };
  }

  get id() {
    return this._props.id;
  }
  get name() {
    return this._props.name;
  }
  get email() {
    return this._props.email;
  }
  get password() {
    return this._props.password;
  }
  get isVerified() {
    return this._props.isVerified;
  }
  get otpCode() {
    return this._props.otpCode;
  }
  get securityStamp(): string {
    return this._props.securityStamp;
  }
  get createdAt(): Date {
    return this._props.createdAt || new Date();
  }
  setId(id: string) {
    this._props.id = id;
  }

  verify(): void {
    this._props.isVerified = true;
    this._props.otpCode = undefined; // Clear OTP once used
  }

  updateSecurityStamp(stamp: string): void {
    this._props.securityStamp = stamp;
  }
}
