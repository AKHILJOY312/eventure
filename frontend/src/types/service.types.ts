export type AdminBookingStatus = "pending" | "confirmed" | "cancelled";
export type ServiceCategory =
  | "Venue"
  | "Hotel"
  | "Caterer"
  | "Cameraman"
  | "DJ";

export interface AdminService {
  id: string;
  title: string;
  category: string;
  pricePerDay: number;
  description?: string;
  location: string;
  contactDetails?: string;
  imageUrl?: string;
  availableDates?: string[]; // ISO strings
  createdAt: string;
  updatedAt: string;
}

export interface ServiceInput {
  title: string;
  category: ServiceCategory;
  pricePerDay: number;
  description?: string;
  location: string;
  contactDetails?: string;
  imageUrl?: string;
  availableDates?: string[];
}

export interface AdminServiceBooking {
  bookingId: string;
  serviceId: string;
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: AdminBookingStatus;
  createdAt: string;
}
