// ===================== COMMON PAGINATION =====================

import { ServiceCategory } from "@/entities/Service";

export interface PaginationDto {
  page?: number; // default: 1
  limit?: number; // default: 10
}

// ===================== SEARCH =====================

export interface SearchServicesDto extends PaginationDto {
  keyword?: string;
  category?: ServiceCategory;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  date?: Date;
}

// ===================== FILTER AVAILABILITY =====================

export interface FilterByAvailabilityDto extends PaginationDto {
  date: Date;
  category?: ServiceCategory;
  location?: string;
}

// ===================== GET DETAILS =====================

export interface GetServiceDetailsDto {
  serviceId: string;
}

// ===================== RESPONSE =====================

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

// ===================== PAGINATED RESULT =====================

export interface PaginatedServicesDTO {
  data: ServiceResponseDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
