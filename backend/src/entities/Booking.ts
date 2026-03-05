export enum BookingStatus {
  Pending = "pending",
  Confirmed = "confirmed",
  Cancelled = "cancelled",
}

export interface BookingProps {
  id?: string;
  userId: string;
  serviceId: string;
  dates: Date[]; // normalized consecutive dates (start → end)
  totalPrice: number;
  status: BookingStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Booking {
  private _props: BookingProps;

  constructor(props: BookingProps) {
    this._normalizeAndValidateDates(props.dates);
    this._validatePrice(props.totalPrice);

    // We assign after validation (sorted & normalized dates are already set)
    this._props = {
      ...props,
      status: props.status || BookingStatus.Pending,
    };
  }

  // ===== PRIVATE VALIDATION HELPERS =====

  private _normalizeAndValidateDates(dates: Date[]): Date[] {
    if (!dates || dates.length === 0) {
      throw new Error("Dates array cannot be empty");
    }

    const normalized = dates.map((d) => {
      const nd = new Date(d);
      nd.setHours(0, 0, 0, 0);
      return nd;
    });

    normalized.sort((a, b) => a.getTime() - b.getTime());

    for (let i = normalized.length - 1; i > 0; i--) {
      if (normalized[i].getTime() === normalized[i - 1].getTime()) {
        normalized.splice(i, 1);
      }
    }

    for (let i = 1; i < normalized.length; i++) {
      const diffDays =
        (normalized[i].getTime() - normalized[i - 1].getTime()) / 86400000;
      if (diffDays !== 1) {
        throw new Error("Dates must be consecutive without gaps");
      }
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    if (normalized[0] < todayStart) {
      throw new Error("Cannot book dates in the past");
    }

    return normalized;
  }

  private _validatePrice(price: number): void {
    if (price < 0) {
      throw new Error("Total price cannot be negative");
    }
  }

  // ===== GETTERS =====
  get id(): string | undefined {
    return this._props.id;
  }

  get userId(): string {
    return this._props.userId;
  }

  get serviceId(): string {
    return this._props.serviceId;
  }

  get dates(): Date[] {
    return this._props.dates.map((d) => new Date(d)); // defensive copy
  }

  get startDate(): Date {
    return new Date(this._props.dates[0]);
  }

  get endDate(): Date {
    return new Date(this._props.dates[this._props.dates.length - 1]);
  }

  get nights(): number {
    return this._props.dates.length;
  }

  get totalPrice(): number {
    return this._props.totalPrice;
  }

  get status(): BookingStatus {
    return this._props.status;
  }

  get createdAt(): Date {
    return this._props.createdAt ?? new Date();
  }

  get updatedAt(): Date | undefined {
    return this._props.updatedAt;
  }

  // ===== INFRASTRUCTURE =====
  setId(id: string): void {
    this._props.id = id;
  }

  // ===== FACTORY METHOD =====
  static createNew(
    userId: string,
    serviceId: string,
    startDate: Date,
    endDate: Date,
    pricePerDay: number,
  ): Booking {
    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (start >= end) {
      throw new Error("End date must be after start date");
    }

    // Build consecutive dates array
    const dates: Date[] = [];
    const current = new Date(start);

    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    const nights = dates.length;
    const totalPrice = nights * pricePerDay;

    return new Booking({
      userId,
      serviceId,
      dates,
      totalPrice,
      status: BookingStatus.Pending,
    });
  }
}
