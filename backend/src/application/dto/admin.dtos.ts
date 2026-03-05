// ===================== CREATE =====================

import { ServiceCategory } from "@/entities/Service";
import { BookingStatus } from "@/entities/Booking";

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
  adminId: string;
  page?: number;
  limit?: number;
}

// ===================== GET SERVICE BOOKINGS =====================

export interface GetServiceBookingsDto extends PaginationDto {
  serviceId: string;
  adminId: string; // ownership validation
  status?: BookingStatus;
}

export interface ServiceBookingResponseDTO {
  bookingId: string;
  serviceId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: BookingStatus;
  createdAt?: Date;
}

export interface PaginatedServiceBookingsDTO {
  data: ServiceBookingResponseDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UpdateBookingStatusDto {
  serviceId: string;
  bookingId: string;
  adminId: string;
  status: BookingStatus;
}

export interface BookingStatusUpdateResponseDTO {
  bookingId: string;
  serviceId: string;
  status: BookingStatus;
  message: string;
}

// ===================== PAGINATED SERVICES =====================

export interface PaginatedServicesDTO {
  data: ServiceResponseDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
