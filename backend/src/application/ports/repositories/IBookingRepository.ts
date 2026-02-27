import { Booking } from "@/entities/Booking";

export interface IBookingRepository {
  create(booking: Booking): Promise<Booking>;
  update(booking: Booking): Promise<void>;
  softDelete(bookingId: string): Promise<void>;

  findById(id: string): Promise<Booking | null>;
  findByServiceId(serviceId: string): Promise<Booking[]>;
}
