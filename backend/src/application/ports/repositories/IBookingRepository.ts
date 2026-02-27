import { Booking, BookingStatus } from "@/entities/Booking";

export interface IBookingRepository {
  create(booking: Booking): Promise<Booking>;
  update(booking: Booking): Promise<void>;
  softDelete(bookingId: string): Promise<void>;

  findById(id: string): Promise<Booking | null>;
  // findAll(): Promise<Booking[]>;
  // findByUserId(userId: string): Promise<Booking[]>;
  findByServiceId(serviceId: string): Promise<Booking[]>;
  // findByStatus(userId: string, status: BookingStatus): Promise<Booking[]>;
  // findOverlapping(
  //   serviceId: string,
  //   startDate: Date,
  //   endDate: Date,
  //   excludeBookingId?: string,
  // ): Promise<Booking[]>;
  // findUpcoming(userId: string, from?: Date): Promise<Booking[]>;
  // findActive(userId: string): Promise<Booking[]>;
  // findPast(userId: string): Promise<Booking[]>;
  // findRecent(limit?: number): Promise<Booking[]>;
  // //   getStats(adminId?: string): Promise<BookingStats>;
  // //   findSummariesByUser(userId: string): Promise<BookingSummary[]>;
}
