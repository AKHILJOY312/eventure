import { inject, injectable } from "inversify";
import { TYPES } from "@/config/di/types";
import { IBookingRepository } from "@/application/ports/repositories/IBookingRepository";
import { IServiceRepository } from "@/application/ports/repositories/IServiceRepository";
import {
  CreateBookingDto,
  BookingResponseDTO,
} from "@/application/dto/booking.dtos";
import { Booking } from "@/entities/Booking";
import { NotFoundError, BadRequestError } from "@/application/error/AppError";
import { ICreateBooking } from "@/application/ports/use-cases/booking/IBookingUseCase";

@injectable()
export class CreateBooking implements ICreateBooking {
  constructor(
    @inject(TYPES.BookingRepository)
    private _bookingRepo: IBookingRepository,

    @inject(TYPES.ServiceRepository)
    private _serviceRepo: IServiceRepository,
  ) {}

  async execute(dto: CreateBookingDto): Promise<BookingResponseDTO> {
    const service = await this._serviceRepo.findById(dto.serviceId);

    if (!service) {
      throw new NotFoundError("SERVICE_NOT_FOUND");
    }

    // Check overlap
    const overlapping = await this._bookingRepo.findOverlappingBookings({
      serviceId: dto.serviceId,
      startDate: dto.startDate,
      endDate: dto.endDate,
    });

    if (overlapping.length > 0) {
      throw new BadRequestError("SERVICE_ALREADY_BOOKED_FOR_SELECTED_DATES");
    }

    const booking = Booking.createNew(
      dto.userId,
      dto.serviceId,
      dto.startDate,
      dto.endDate,
      service.pricePerDay,
    );

    const saved = await this._bookingRepo.create(booking);

    return {
      id: saved.id!,
      userId: saved.userId,
      serviceId: saved.serviceId,
      startDate: saved.startDate,
      endDate: saved.endDate,
      totalPrice: saved.totalPrice,
      status: saved.status,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    };
  }
}
