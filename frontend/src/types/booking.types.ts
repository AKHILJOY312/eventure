export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

export interface Booking {
  id: string;
  serviceId: string;
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingInput {
  serviceId: string;
  dates: string[];
}

export interface BookingQueryParams {
  page?: number;
  limit?: number;
  status?: BookingStatus;
}
