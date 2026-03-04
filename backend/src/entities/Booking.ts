export enum BookingStatus {
  Pending = "pending",
  Confirmed = "confirmed",
  Cancelled = "cancelled",
}
export interface BookingProps {
  id?: string;
  userId: string;
  serviceId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: BookingStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Booking {
  private _props: BookingProps;

  constructor(props: BookingProps) {
    this._validateDateRange(props.startDate, props.endDate);
    this._validatePrice(props.totalPrice);

    this._props = {
      ...props,
      status: props.status || "pending",
    };
  }

  // ===== PRIVATE VALIDATION HELPERS =====
  private _validateDateRange(start: Date, end: Date): void {
    if (start >= end) {
      throw new Error("INVALID_DATE_RANGE: End date must be after start date");
    }
    if (start < new Date()) {
      throw new Error("INVALID_DATE: Cannot book dates in the past");
    }
  }

  private _validatePrice(price: number): void {
    if (price < 0) {
      throw new Error("INVALID_PRICE: Total price cannot be negative");
    }
  }

  // ===== GETTERS (Read-only access) =====
  get id(): string | undefined {
    return this._props.id;
  }
  get userId(): string {
    return this._props.userId;
  }
  get serviceId(): string {
    return this._props.serviceId;
  }
  get startDate(): Date {
    return new Date(this._props.startDate);
  }
  get endDate(): Date {
    return new Date(this._props.endDate);
  }
  get totalPrice(): number {
    return this._props.totalPrice;
  }
  get status(): BookingStatus {
    return this._props.status;
  }
  get createdAt(): Date {
    return this._props.createdAt || new Date();
  }
  get updatedAt(): Date | undefined {
    return this._props.updatedAt;
  }

  // ===== INFRASTRUCTURE SETTERS =====
  setId(id: string): void {
    this._props.id = id;
  }

  // ===== COMPUTED PROPERTIES =====

  get isUpcoming(): boolean {
    return new Date(this._props.startDate) > new Date();
  }

  // ===== BUSINESS METHODS =====

  static createNew(
    userId: string,
    serviceId: string,
    startDate: Date,
    endDate: Date,
    pricePerDay: number,
  ): Booking {
    const duration =
      Math.ceil(
        (new Date(endDate).getTime() - new Date(startDate).getTime()) /
          (1000 * 60 * 60 * 24),
      ) + 1;
    const totalPrice = duration * pricePerDay;

    return new Booking({
      userId,
      serviceId,
      startDate,
      endDate,
      totalPrice,
      status: BookingStatus.Pending,
    });
  }
}
