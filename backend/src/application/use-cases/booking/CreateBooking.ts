import { inject, injectable } from "inversify";
import { TYPES } from "@/config/di/types";
import { IBookingRepository } from "@/application/ports/repositories/IBookingRepository";
import { IServiceRepository } from "@/application/ports/repositories/IServiceRepository";
import {
  CreateBookingDto,
  BookingResponseDTO,
} from "@/application/dto/booking.dtos";
import { Booking, BookingStatus } from "@/entities/Booking";
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

    // Convert incoming ISO strings → Date objects
    const proposedDates = dto.dates.map((iso) => {
      const d = new Date(iso);
      if (isNaN(d.getTime())) {
        throw new BadRequestError(`Invalid date format: ${iso}`);
      }
      return d;
    });

    // Basic validation: at least one date, sorted & consecutive
    if (proposedDates.length === 0) {
      throw new BadRequestError("At least one date is required");
    }

    // Optional: enforce sorted & consecutive (you can also rely on entity constructor)
    const sortedDates = [...proposedDates].sort(
      (a, b) => a.getTime() - b.getTime(),
    );
    for (let i = 1; i < sortedDates.length; i++) {
      const diffDays =
        (sortedDates[i].getTime() - sortedDates[i - 1].getTime()) /
        (1000 * 60 * 60 * 24);
      if (Math.round(diffDays) !== 1) {
        throw new BadRequestError("Dates must be consecutive without gaps");
      }
    }

    // Availability check
    const overlapping = await this._bookingRepo.findOverlappingBookings({
      serviceId: dto.serviceId,
      dates: sortedDates, // already sorted & valid Dates
    });

    if (overlapping.length > 0) {
      throw new BadRequestError("SERVICE_ALREADY_BOOKED_FOR_SELECTED_DATES");
    }

    // Create domain entity
    // Since entity constructor validates & normalizes dates[], we can pass directly
    const booking = new Booking({
      userId: dto.userId,
      serviceId: dto.serviceId,
      dates: sortedDates, // pass normalized Dates[]
      totalPrice: sortedDates.length * service.pricePerDay,
      status: BookingStatus.Pending,
    });

    // Alternative: if you want to keep createNew(start, end) factory → compute start/end
    // const start = sortedDates[0];
    // const end = sortedDates[sortedDates.length - 1];
    // const booking = Booking.createNew(dto.userId, dto.serviceId, start, end, service.pricePerDay);

    const saved = await this._bookingRepo.create(booking);

    // Prepare response with ISO strings
    const responseDates = saved.dates.map(
      (d) => d.toISOString().split("T")[0], // "2025-04-10"
    );

    return {
      id: saved.id!,
      userId: saved.userId,
      serviceId: saved.serviceId,
      dates: responseDates,
      totalPrice: saved.totalPrice,
      status: saved.status,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    };
  }
}
