import { inject, injectable } from "inversify";
import { TYPES } from "@/config/di/types";
import { IBookingRepository } from "@/application/ports/repositories/IBookingRepository";
import { IServiceRepository } from "@/application/ports/repositories/IServiceRepository";
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
    @inject(TYPES.ServiceRepository)
    private _serviceRepo: IServiceRepository,
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

    const services = await Promise.all(
      bookings.map((booking) => this._serviceRepo.findById(booking.serviceId)),
    );

    return {
      data: bookings.map((b, index) => ({
        id: b.id!,
        userId: b.userId,
        serviceId: b.serviceId,
        startDate: b.startDate.toISOString().split("T")[0],
        endDate: b.endDate.toISOString().split("T")[0],
        totalPrice: b.totalPrice,
        status: b.status,
        service: services[index]
          ? {
              id: services[index]!.id!,
              title: services[index]!.title,
              category: services[index]!.category,
              location: services[index]!.location,
              pricePerDay: services[index]!.pricePerDay,
              imageUrl: services[index]!.imageUrl,
            }
          : undefined,
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
