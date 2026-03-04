// ===================== COMMON =====================

import { BookingStatus } from "@/entities/Booking";

export interface PaginationDto {
  page?: number; // default 1
  limit?: number; // default 10
}

// ===================== CALCULATE PRICE =====================

export interface CalculateBookingPriceDto {
  serviceId: string;
  startDate: Date;
  endDate: Date;
}

export interface CalculateBookingPriceResponseDTO {
  serviceId: string;
  pricePerDay: number;
  durationInDays: number;
  totalPrice: number;
}

// ===================== CREATE BOOKING =====================

export interface CreateBookingDto {
  userId: string;
  serviceId: string;
  dates: string[];
}

export interface BookingResponseDTO {
  id: string;
  userId: string;
  serviceId: string;
  dates: string[];
  totalPrice: number;
  status: BookingStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

// ===================== USER BOOKING HISTORY =====================

export interface GetUserBookingHistoryDto extends PaginationDto {
  userId: string;
  status?: BookingStatus;
}

export interface PaginatedBookingsDTO {
  data: BookingResponseDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
