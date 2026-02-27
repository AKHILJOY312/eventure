export type OtpPurpose = "email-verification" | "password-reset" | "2fa-login";

export interface OtpProps {
  id?: string;
  userId: string; // Reference to User.id
  code: string; // Hashed OTP code
  purpose: OtpPurpose;
  expiresAt: Date;
  isConsumed: boolean;
  createdAt?: Date;
  attempts: number; // Track failed attempts
  maxAttempts?: number; // Default: 3
}

export class Otp {
  private _props: OtpProps;
  private static readonly DEFAULT_TTL_MS = 10 * 60 * 1000; // 10 minutes
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

  /**
   * Validate OTP code and mark as consumed if valid
   */
  validateAndConsume(inputCode: string): boolean {
    if (this._props.isConsumed) return false;
    if (this.isExpired()) return false;
    if (this._props.attempts >= this._props.maxAttempts!) return false;

    // Compare hashed codes (use bcrypt/argon2 in real app)
    const isValid = inputCode === this._props.code; //  Hash in production!

    if (!isValid) {
      this._props.attempts += 1;
      return false;
    }

    this._props.isConsumed = true;
    this._props.attempts = 0; // Reset for potential reuse
    return true;
  }

  /**
   * Check if OTP has expired
   */
  isExpired(): boolean {
    return new Date() > this._props.expiresAt;
  }

  /**
   * Extend expiration time (e.g., user requested resend)
   */
  extend(ttlMs: number = Otp.DEFAULT_TTL_MS): void {
    this._props.expiresAt = new Date(Date.now() + ttlMs);
    this._props.attempts = 0; // Reset attempts on resend
  }

  /**
   * Invalidate OTP manually (e.g., after successful login)
   */
  invalidate(): void {
    this._props.isConsumed = true;
  }

  /**
   * Domain factory: Create new OTP with defaults
   */
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
