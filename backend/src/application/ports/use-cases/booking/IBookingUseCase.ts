// ===================== INTERFACES =====================

import {
  BookingResponseDTO,
  CalculateBookingPriceDto,
  CalculateBookingPriceResponseDTO,
  CreateBookingDto,
  GetUserBookingHistoryDto,
  PaginatedBookingsDTO,
} from "@/application/dto/booking.dtos";

export interface ICalculateBookingPrice {
  execute(
    dto: CalculateBookingPriceDto,
  ): Promise<CalculateBookingPriceResponseDTO>;
}

export interface ICreateBooking {
  execute(dto: CreateBookingDto): Promise<BookingResponseDTO>;
}

export interface IGetUserBookingHistory {
  execute(dto: GetUserBookingHistoryDto): Promise<PaginatedBookingsDTO>;
}
