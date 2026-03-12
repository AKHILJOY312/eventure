import { inject, injectable } from "inversify";
import { TYPES } from "@/config/di/types";
import {
  UserCancelDto,
  UserCancelResponse,
} from "@/application/dto/booking.dtos";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from "@/application/error/AppError";
import { ICancelBooking } from "@/application/ports/use-cases/booking/IBookingUseCase";
import { IBookingRepository } from "@/application/ports/repositories/IBookingRepository";
import { BookingStatus } from "@/entities/Booking";
import { IEmailService } from "@/application/ports/services/IEmailService";
import { IUserRepository } from "@/application/ports/repositories/IUserRepository";

@injectable()
export class CancelBooking implements ICancelBooking {
  constructor(
    @inject(TYPES.BookingRepository)
    private _bookingRepo: IBookingRepository,
    @inject(TYPES.EmailService) private _emailSvc: IEmailService,
    @inject(TYPES.UserRepository) private _userRepo: IUserRepository,
  ) {}
  async execute(dto: UserCancelDto): Promise<UserCancelResponse> {
    const booking = await this._bookingRepo.findById(dto.bookingId);
    if (!booking) {
      throw new NotFoundError("BOOKING_NOT_FOUND");
    }

    if (booking.userId !== dto.userId) {
      throw new ForbiddenError("FORBIDDEN");
    }

    if (booking.status === BookingStatus.Cancelled) {
      throw new BadRequestError("BOOKING_ALREADY_CANCELLED");
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const hasPastDates = booking.dates.some((d) => d < todayStart);
    if (hasPastDates) {
      throw new BadRequestError("CANNOT_CANCEL_PAST_BOOKING");
    }

    await this._bookingRepo.updateStatusForService({
      bookingId: booking.id!,
      serviceId: booking.serviceId,
      status: BookingStatus.Cancelled,
    });

    const user = await this._userRepo.findById(booking.userId);
    if (user) {
      try {
        await this._emailSvc.sendCancelMessage(user.email, user.name);
      } catch (error) {
        console.error("BOOKING_CANCEL_EMAIL_FAILED", {
          bookingId: dto.bookingId,
          userId: user.id,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return {
      id: booking.id!,
      userId: booking.userId,
      serviceId: booking.serviceId,
      dates: booking.dates,
      totalPrice: booking.totalPrice,
      status: BookingStatus.Cancelled,
      createdAt: booking.createdAt,
      updatedAt: new Date(),
    };
  }
}
