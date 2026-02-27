import { Booking, BookingStatus } from "@/entities/Booking";

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
}
