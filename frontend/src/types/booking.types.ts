export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface BookingServiceSummary {
  id: string;
  title: string;
  category: string;
  location: string;
  pricePerDay: number;
  imageUrl?: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: BookingStatus;
  service?: BookingServiceSummary;
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
