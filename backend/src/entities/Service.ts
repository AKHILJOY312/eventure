export enum ServiceCategory {
  Venue = "Venue",
  Hotel = "Hotel",
  Caterer = "Caterer",
  Cameraman = "Cameraman",
  DJ = "DJ",
}

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
  updateAvailableDates(dates: Date[]): void {
    const normalized = dates.map((d) => {
      const date = new Date(d);
      date.setHours(0, 0, 0, 0);
      return date;
    });

    // Prevent duplicates
    const uniqueDates = Array.from(
      new Map(normalized.map((d) => [d.getTime(), d])).values(),
    );

    this._props.availableDates = uniqueDates;
    this._props.updatedAt = new Date();
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
}
