import { inject, injectable } from "inversify";
import { TYPES } from "@/config/di/types";
import {
  BookingStatusUpdateResponseDTO,
  UpdateBookingStatusDto,
} from "@/application/dto/admin.dtos";
import { IServiceRepository } from "@/application/ports/repositories/IServiceRepository";
import { IBookingRepository } from "@/application/ports/repositories/IBookingRepository";
import { NotFoundError } from "@/application/error/AppError";
import { IUpdateBookingStatus } from "@/application/ports/use-cases/admin/IAdminUseCase";

@injectable()
export class UpdateBookingStatus implements IUpdateBookingStatus {
  constructor(
    @inject(TYPES.ServiceRepository) private _serviceRepo: IServiceRepository,
    @inject(TYPES.BookingRepository) private _bookingRepo: IBookingRepository,
  ) {}

  async execute(
    dto: UpdateBookingStatusDto,
  ): Promise<BookingStatusUpdateResponseDTO> {
    const ownedService = await this._serviceRepo.findByIdAndAdmin(
      dto.serviceId,
      dto.adminId,
    );

    if (!ownedService) {
      throw new NotFoundError("SERVICE_NOT_FOUND_OR_NOT_OWNED");
    }

    const updated = await this._bookingRepo.updateStatusForService({
      bookingId: dto.bookingId,
      serviceId: dto.serviceId,
      status: dto.status,
    });

    if (!updated) {
      throw new NotFoundError("BOOKING_NOT_FOUND");
    }

    return {
      bookingId: dto.bookingId,
      serviceId: dto.serviceId,
      status: dto.status,
      message: "Booking status updated successfully",
    };
  }
}
