// src/application/use-cases/admin/GetServiceBookings.ts
import { injectable, inject } from "inversify";
import { TYPES } from "@/config/di/types";
import {
  GetServiceBookingsDto,
  PaginatedServiceBookingsDTO,
} from "@/application/dto/admin.dtos";
import { IServiceRepository } from "@/application/ports/repositories/IServiceRepository";
import { IBookingRepository } from "@/application/ports/repositories/IBookingRepository";
import { IUserRepository } from "@/application/ports/repositories/IUserRepository";
import { NotFoundError } from "@/application/error/AppError";
import { IGetServiceBookings } from "@/application/ports/use-cases/admin/IAdminUseCase";

@injectable()
export class GetServiceBookings implements IGetServiceBookings {
  constructor(
    @inject(TYPES.ServiceRepository) private _serviceRepo: IServiceRepository,
    @inject(TYPES.BookingRepository) private _bookingRepo: IBookingRepository,
    @inject(TYPES.UserRepository) private _userRepo: IUserRepository,
  ) {}

  async execute(
    dto: GetServiceBookingsDto,
  ): Promise<PaginatedServiceBookingsDTO> {
    const page = Math.max(1, dto.page ?? 1);
    const limit = Math.min(50, Math.max(1, dto.limit ?? 10));
    const skip = (page - 1) * limit;

    // Atomic ownership check
    const service = await this._serviceRepo.findByIdAndAdmin(
      dto.serviceId,
      dto.adminId,
    );
    if (!service) {
      throw new NotFoundError("SERVICE_NOT_FOUND_OR_NOT_OWNED");
    }

    const { bookings, total } =
      await this._bookingRepo.findByServiceIdPaginated({
        serviceId: dto.serviceId,
        status: dto.status,
        skip,
        limit,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

    const users = await Promise.all(
      bookings.map((booking) => this._userRepo.findById(booking.userId)),
    );

    const data = bookings.map((b, index) => ({
      bookingId: b.id!,
      serviceId: b.serviceId,
      userId: b.userId,
      userName: users[index]?.name ?? b.userId,
      startDate: b.startDate,
      endDate: b.endDate,
      totalPrice: b.totalPrice,
      status: b.status,
      createdAt: b.createdAt,
    }));

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }
}
