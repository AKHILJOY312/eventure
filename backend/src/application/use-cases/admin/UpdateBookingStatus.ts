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
import { BookingStatus } from "@/entities/Booking";
import { IUserRepository } from "@/application/ports/repositories/IUserRepository";
import { IEmailService } from "@/application/ports/services/IEmailService";

@injectable()
export class UpdateBookingStatus implements IUpdateBookingStatus {
  constructor(
    @inject(TYPES.ServiceRepository) private _serviceRepo: IServiceRepository,
    @inject(TYPES.BookingRepository) private _bookingRepo: IBookingRepository,
    @inject(TYPES.UserRepository) private _userRepo: IUserRepository,
    @inject(TYPES.EmailService) private _emailSvc: IEmailService,
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

    const booking = await this._bookingRepo.findById(dto.bookingId);
    if (!booking || booking.serviceId !== dto.serviceId) {
      throw new NotFoundError("BOOKING_NOT_FOUND");
    }

    const wasAlreadyConfirmed = booking.status === BookingStatus.Confirmed;

    const updated = await this._bookingRepo.updateStatusForService({
      bookingId: dto.bookingId,
      serviceId: dto.serviceId,
      status: dto.status,
    });

    if (!updated) {
      throw new NotFoundError("BOOKING_NOT_FOUND");
    }

    if (dto.status === BookingStatus.Confirmed && !wasAlreadyConfirmed) {
      const user = await this._userRepo.findById(booking.userId);

      if (user) {
        try {
          await this._emailSvc.sendBookingConfirmation({
            email: user.email,
            name: user.name,
            bookingId: dto.bookingId,
            serviceTitle: ownedService.title,
            location: ownedService.location,
            startDate: booking.startDate,
            endDate: booking.endDate,
            totalPrice: booking.totalPrice,
          });
        } catch (error) {
          console.error("BOOKING_CONFIRMATION_EMAIL_FAILED", {
            bookingId: dto.bookingId,
            userId: user.id,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }
    }

    return {
      bookingId: dto.bookingId,
      serviceId: dto.serviceId,
      status: dto.status,
      message: "Booking status updated successfully",
    };
  }
}
