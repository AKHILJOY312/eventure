// ===================== CREATE =====================

import { ServiceCategory } from "@/entities/Service";

export interface CreateServiceDto {
  title: string;
  category: ServiceCategory;
  pricePerDay: number;
  description?: string;
  location: string;
  contactDetails?: string;
  imageUrl?: string;
  adminId: string;
  availableDates?: Date[];
}

export interface ServiceResponseDTO {
  id: string;
  title: string;
  category: ServiceCategory;
  pricePerDay: number;
  description?: string;
  location: string;
  contactDetails?: string;
  imageUrl?: string;
  adminId: string;
  availableDates?: Date[];
  bookedDates?: Date[];
  createdAt?: Date;
  updatedAt?: Date;
}
// ===================== UPDATE =====================

export interface UpdateServiceDto {
  serviceId: string;
  adminId: string; // ownership validation
  title?: string;
  category?: ServiceCategory;
  pricePerDay?: number;
  description?: string;
  location?: string;
  contactDetails?: string;
  imageUrl?: string;
  availableDates?: Date[];
}
// ===================== DELETE =====================

export interface DeleteServiceDto {
  serviceId: string;
  adminId: string;
}

// ===================== PAGINATION =====================

export interface PaginationDto {
  page?: number;
  limit?: number;
}

// ===================== GET SERVICE BOOKINGS =====================

export interface GetServiceBookingsDto extends PaginationDto {
  serviceId: string;
  adminId: string; // ownership validation
  status?: "pending" | "confirmed" | "cancelled";
}

export interface ServiceBookingResponseDTO {
  bookingId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt?: Date;
}

export interface PaginatedServiceBookingsDTO {
  data: ServiceBookingResponseDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
