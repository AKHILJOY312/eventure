import { Booking, BookingStatus } from "@/entities/Booking";

export type SortOrder = "asc" | "desc";

export type BookingSortableFields =
  | "createdAt"
  | "startDate"
  | "endDate"
  | "totalPrice"
  | "status";

export interface PaginatedBookingResult {
  bookings: Booking[];
  total: number;
}

export interface IBookingRepository {
  create(booking: Booking): Promise<Booking>;
  update(booking: Booking): Promise<void>;
  softDelete(bookingId: string): Promise<void>;

  findById(id: string): Promise<Booking | null>;
  findByServiceId(serviceId: string): Promise<Booking[]>;
  findByServiceIdPaginated(params: {
    serviceId: string;
    status?: BookingStatus;
    skip?: number;
    limit?: number;
    sortBy?: string; // e.g. "createdAt"
    sortOrder?: "asc" | "desc";
  }): Promise<{ bookings: Booking[]; total: number }>;

  findOverlappingBookings(params: {
    serviceId: string;
    dates: Date[];
  }): Promise<Booking[]>;

  findByUserIdPaginated(params: {
    userId: string;
    status?: BookingStatus;
    skip?: number;
    limit?: number;
    sortBy?: BookingSortableFields;
    sortOrder?: SortOrder;
  }): Promise<PaginatedBookingResult>;
}
