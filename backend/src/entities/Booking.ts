export enum BookingStatus {
  Pending = "pending",
  Confirmed = "confirmed",
  Cancelled = "cancelled",
}
export interface BookingProps {
  id?: string;
  userId: string; // Reference to User.id (string, not ObjectId)
  serviceId: string; // Reference to Service.id (string, not ObjectId)
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

  /**
   * Calculate booking duration in days (inclusive)
   */
  get durationInDays(): number {
    const start = new Date(this._props.startDate);
    const end = new Date(this._props.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 for inclusive end date
  }

  /**
   * Check if booking is currently active (today falls within range)
   */
  get isActive(): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(this._props.startDate);
    const end = new Date(this._props.endDate);

    return today >= start && today <= end;
  }

  /**
   * Check if booking is upcoming (starts in the future)
   */
  get isUpcoming(): boolean {
    return new Date(this._props.startDate) > new Date();
  }

  // ===== BUSINESS METHODS =====

  /**
   * Confirm a pending booking
   */
  confirm(): void {
    if (this._props.status !== "pending") {
      throw new Error(
        `INVALID_TRANSITION: Cannot confirm booking with status "${this._props.status}"`,
      );
    }
    this._props.status = BookingStatus.Confirmed;
    this._props.updatedAt = new Date();
  }

  /**
   * Cancel a booking (only pending or confirmed can be cancelled)
   */
  // cancel(reason?: string): void {
  //   if (this._props.status === "cancelled") {
  //     throw new Error("INVALID_TRANSITION: Booking is already cancelled");
  //   }
  //   if (this._props.status === "confirmed" && this.isActive) {
  //     // Optional: Add business rule - cannot cancel active confirmed bookings
  //     // throw new Error("CANNOT_CANCEL_ACTIVE_BOOKING");
  //   }
  //   this._props.status = "cancelled";
  //   this._props.updatedAt = new Date();
  // }

  /**
   * Update booking dates (only allowed for pending bookings)
   */
  updateDates(newStartDate: Date, newEndDate: Date): void {
    if (this._props.status !== "pending") {
      throw new Error(
        "INVALID_OPERATION: Can only update dates for pending bookings",
      );
    }
    this._validateDateRange(newStartDate, newEndDate);

    this._props.startDate = newStartDate;
    this._props.endDate = newEndDate;
    this._props.updatedAt = new Date();
    // Note: totalPrice should be recalculated by application service
  }

  /**
   * Update total price (should only be called after recalculation)
   */
  updateTotalPrice(newPrice: number): void {
    this._validatePrice(newPrice);
    this._props.totalPrice = newPrice;
    this._props.updatedAt = new Date();
  }

  /**
   * Check if user owns this booking
   */
  isOwnedBy(userId: string): boolean {
    return this._props.userId === userId;
  }

  /**
   * Check if booking overlaps with a given date range
   */
  overlapsWith(start: Date, end: Date): boolean {
    const existingStart = new Date(this._props.startDate);
    const existingEnd = new Date(this._props.endDate);
    const newStart = new Date(start);
    const newEnd = new Date(end);

    // Overlap formula: startA <= endB && endA >= startB
    return existingStart <= newEnd && existingEnd >= newStart;
  }

  /**
   * Get booking summary for UI/display
   */
  getSummary(): {
    duration: number;
    status: BookingStatus;
    isEditable: boolean;
    canCancel: boolean;
  } {
    return {
      duration: this.durationInDays,
      status: this._props.status,
      isEditable: this._props.status === "pending",
      canCancel: this._props.status !== "cancelled" && !this.isActive,
    };
  }

  /**
   * Static factory: Create new booking with calculated price
   */
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
