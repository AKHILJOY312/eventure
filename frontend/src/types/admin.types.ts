export type AdminBookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED";

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

export interface CreateServiceInput {
  title: string;
  category: string;
  pricePerDay: number;
  description?: string;
  location: string;
  contactDetails?: string;
  imageUrl?: string;
  availableDates?: string[];
}

export interface UpdateServiceInput extends Partial<CreateServiceInput> {}

export interface AdminServiceBooking {
  id: string;
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: AdminBookingStatus;
  createdAt: string;
}
