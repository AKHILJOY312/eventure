export type OtpPurpose = "email-verification" | "password-reset" | "2fa-login";

export interface OtpProps {
  id?: string;
  userId: string;
  code: string;
  purpose: OtpPurpose;
  expiresAt: Date;
  isConsumed: boolean;
  createdAt?: Date;
  attempts: number;
  maxAttempts?: number;
}

export class Otp {
  private _props: OtpProps;
  private static readonly DEFAULT_TTL_MS = 10 * 60 * 1000;
  private static readonly DEFAULT_MAX_ATTEMPTS = 3;

  constructor(props: OtpProps) {
    this._props = {
      ...props,
      maxAttempts: props.maxAttempts ?? Otp.DEFAULT_MAX_ATTEMPTS,
    };
  }

  // ===== GETTERS =====
  get id(): string | undefined {
    return this._props.id;
  }
  get userId(): string {
    return this._props.userId;
  }
  get code(): string {
    return this._props.code;
  }
  get purpose(): OtpPurpose {
    return this._props.purpose;
  }
  get expiresAt(): Date {
    return this._props.expiresAt;
  }
  get isConsumed(): boolean {
    return this._props.isConsumed;
  }
  get attempts(): number {
    return this._props.attempts;
  }
  get maxAttempts(): number {
    return this._props.maxAttempts!;
  }
  get createdAt(): Date {
    return this._props.createdAt || new Date();
  }

  // ===== INFRASTRUCTURE =====
  setId(id: string): void {
    this._props.id = id;
  }
  setUserId(userId: string): void {
    this._props.userId = userId;
  }
  // ===== BUSINESS METHODS =====

  validateAndConsume(isValid: boolean): boolean {
    if (this._props.isConsumed) return false;
    if (this.isExpired()) return false;
    if (this._props.attempts >= this._props.maxAttempts!) return false;

    if (!isValid) {
      this._props.attempts += 1;
      return false;
    }

    this._props.isConsumed = true;
    this._props.attempts = 0;
    return true;
  }

  isExpired(): boolean {
    return new Date() > this._props.expiresAt;
  }

  extend(ttlMs: number = Otp.DEFAULT_TTL_MS): void {
    this._props.expiresAt = new Date(Date.now() + ttlMs);
    this._props.attempts = 0;
  }

  invalidate(): void {
    this._props.isConsumed = true;
  }

  static createNew(
    userId: string,
    code: string,
    purpose: OtpPurpose,
    ttlMs?: number,
  ): Otp {
    return new Otp({
      userId,
      code, //  Hash this before persisting!
      purpose,
      expiresAt: new Date(Date.now() + (ttlMs ?? Otp.DEFAULT_TTL_MS)),
      isConsumed: false,
      attempts: 0,
    });
  }
}
