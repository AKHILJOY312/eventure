// ===================== COMMON =====================

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
  startDate: Date;
  endDate: Date;
}

export interface BookingResponseDTO {
  id: string;
  userId: string;
  serviceId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt?: Date;
  updatedAt?: Date;
}

// ===================== USER BOOKING HISTORY =====================

export interface GetUserBookingHistoryDto extends PaginationDto {
  userId: string;
  status?: "pending" | "confirmed" | "cancelled";
}

export interface PaginatedBookingsDTO {
  data: BookingResponseDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
