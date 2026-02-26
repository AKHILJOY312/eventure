// src/domain/entities/AccessKey.ts
export interface AccessKeyProps {
  id?: string;
  key: string; // The 6-digit unique string
  isUsed: boolean;
  usedBy?: string; // Email of user who consumed it
}

export class AccessKey {
  private _props: AccessKeyProps;

  constructor(props: AccessKeyProps) {
    this._props = { ...props };
  }

  get key() {
    return this._props.key;
  }
  get isUsed() {
    return this._props.isUsed;
  }

  // BUSINESS METHOD: Mark key as consumed
  consume(userEmail: string): void {
    if (this._props.isUsed) {
      throw new Error("ACCESS_KEY_ALREADY_CONSUMED");
    }
    this._props.isUsed = true;
    this._props.usedBy = userEmail;
  }
}
