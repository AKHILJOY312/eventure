import { inject, injectable } from "inversify";
import { TYPES } from "@/config/di/types";
import { IBookingRepository } from "@/application/ports/repositories/IBookingRepository";
import {
  GetUserBookingHistoryDto,
  PaginatedBookingsDTO,
} from "@/application/dto/booking.dtos";
import { IGetUserBookingHistory } from "@/application/ports/use-cases/booking/IBookingUseCase";

@injectable()
export class GetUserBookingHistory implements IGetUserBookingHistory {
  constructor(
    @inject(TYPES.BookingRepository)
    private _bookingRepo: IBookingRepository,
  ) {}

  async execute(dto: GetUserBookingHistoryDto): Promise<PaginatedBookingsDTO> {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;
    const skip = (page - 1) * limit;

    const { bookings, total } = await this._bookingRepo.findByUserIdPaginated({
      userId: dto.userId,
      status: dto.status,
      skip,
      limit,
      sortBy: "createdAt",
      sortOrder: "desc",
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: bookings.map((b) => ({
        id: b.id!,
        userId: b.userId,
        serviceId: b.serviceId,
        dates: b.dates.map((date) => date.toISOString().split("T")[0]),
        totalPrice: b.totalPrice,
        status: b.status,
        createdAt: b.createdAt,
        updatedAt: b.updatedAt,
      })),
      total,
      page,
      limit,
      totalPages,
    };
  }
}
