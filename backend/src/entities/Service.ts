export type ServiceCategory =
  | "Venue"
  | "Hotel"
  | "Caterer"
  | "Cameraman"
  | "DJ";

export interface ServiceProps {
  id?: string;
  title: string;
  category: ServiceCategory;
  pricePerDay: number;
  description?: string;
  location: string;
  contactDetails?: string;
  imageUrl?: string;
  adminId: string; // User ID (string, not ObjectId)
  availableDates?: Date[];
  bookedDates?: Date[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class Service {
  private _props: ServiceProps;

  constructor(props: ServiceProps) {
    this._props = {
      ...props,
      availableDates: props.availableDates ?? [],
      bookedDates: props.bookedDates ?? [],
    };
  }

  // ===== GETTERS (Read-only access) =====
  get id(): string | undefined {
    return this._props.id;
  }
  get title(): string {
    return this._props.title;
  }
  get category(): ServiceCategory {
    return this._props.category;
  }
  get pricePerDay(): number {
    return this._props.pricePerDay;
  }
  get description(): string | undefined {
    return this._props.description;
  }
  get location(): string {
    return this._props.location;
  }
  get contactDetails(): string | undefined {
    return this._props.contactDetails;
  }
  get imageUrl(): string | undefined {
    return this._props.imageUrl;
  }
  get adminId(): string {
    return this._props.adminId;
  }
  get availableDates(): Date[] {
    return [...this._props.availableDates!];
  } // Return copy
  get bookedDates(): Date[] {
    return [...this._props.bookedDates!];
  } // Return copy
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

  // ===== BUSINESS METHODS =====

  /**
   * Check if service is available on a given date
   */
  isAvailableOn(date: Date): boolean {
    const checkDate = new Date(date).toDateString();

    // If explicitly booked, not available
    const isBooked = this._props.bookedDates?.some(
      (d) => new Date(d).toDateString() === checkDate,
    );
    if (isBooked) return false;

    // If availableDates is set, must be in that list
    if (this._props.availableDates?.length) {
      return this._props.availableDates.some(
        (d) => new Date(d).toDateString() === checkDate,
      );
    }

    // If no restrictions, assume available
    return true;
  }

  /**
   * Book the service for a specific date (domain validation only)
   * Returns true if booking succeeded, false if date unavailable
   */
  bookDate(date: Date): boolean {
    if (!this.isAvailableOn(date)) return false;

    const checkDate = new Date(date);
    if (!this._props.bookedDates) this._props.bookedDates = [];

    this._props.bookedDates.push(checkDate);
    this._props.updatedAt = new Date();
    return true;
  }

  /**
   * Cancel a booking for a specific date
   */
  cancelBooking(date: Date): boolean {
    const checkDate = new Date(date).toDateString();
    const initialLength = this._props.bookedDates?.length || 0;

    this._props.bookedDates =
      this._props.bookedDates?.filter(
        (d) => new Date(d).toDateString() !== checkDate,
      ) || [];

    const wasRemoved = this._props.bookedDates.length < initialLength;
    if (wasRemoved) this._props.updatedAt = new Date();
    return wasRemoved;
  }

  /**
   * Add an available date (for services with limited availability)
   */
  addAvailableDate(date: Date): void {
    if (!this._props.availableDates) this._props.availableDates = [];

    const exists = this._props.availableDates.some(
      (d) => new Date(d).getTime() === new Date(date).getTime(),
    );
    if (!exists) {
      this._props.availableDates.push(new Date(date));
      this._props.updatedAt = new Date();
    }
  }

  /**
   * Update service details (admin-only operation)
   */
  updateDetails(
    updates: Partial<
      Pick<
        ServiceProps,
        | "title"
        | "category"
        | "pricePerDay"
        | "description"
        | "location"
        | "contactDetails"
        | "imageUrl"
      >
    >,
  ): void {
    // Validate price
    if (updates.pricePerDay !== undefined && updates.pricePerDay < 0) {
      throw new Error("INVALID_PRICE: Price cannot be negative");
    }

    // Validate title
    if (updates.title !== undefined && updates.title.trim().length < 3) {
      throw new Error("INVALID_TITLE: Title must be at least 3 characters");
    }

    Object.assign(this._props, {
      ...updates,
      title: updates.title?.trim(),
      updatedAt: new Date(),
    });
  }

  isOwnedBy(userId: string): boolean {
    return this._props.adminId === userId;
  }

  getBookingSummary(): {
    totalBookedDays: number;
    nextAvailableDate?: Date;
    estimatedRevenue: number;
  } {
    const bookedCount = this._props.bookedDates?.length || 0;
    const estimatedRevenue = bookedCount * this._props.pricePerDay;

    let nextAvailableDate: Date | undefined;
    const today = new Date();
    for (let i = 0; i < 90; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + i);
      if (this.isAvailableOn(checkDate)) {
        nextAvailableDate = checkDate;
        break;
      }
    }

    return {
      totalBookedDays: bookedCount,
      nextAvailableDate,
      estimatedRevenue,
    };
  }
}
