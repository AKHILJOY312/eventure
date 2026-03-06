import {
  GetServiceDetailsDto,
  ServiceResponseDTO,
} from "@/application/dto/discover.dtos";
import { BadRequestError, NotFoundError } from "@/application/error/AppError";
import { IBookingRepository } from "@/application/ports/repositories/IBookingRepository";
import { IServiceRepository } from "@/application/ports/repositories/IServiceRepository";
import { IGetServiceDetails } from "@/application/ports/use-cases/discover/IDiscoverUseCase";
import { TYPES } from "@/config/di/types";
import { BookingStatus } from "@/entities/Booking";
import { inject, injectable } from "inversify";

@injectable()
export class GetServiceDetails implements IGetServiceDetails {
  constructor(
    @inject(TYPES.ServiceRepository) private _serviceRepo: IServiceRepository,
    @inject(TYPES.BookingRepository) private _bookingRepo: IBookingRepository,
  ) {}

  async execute(dto: GetServiceDetailsDto): Promise<ServiceResponseDTO> {
    if (!dto.serviceId) {
      throw new BadRequestError("Service Id Required");
    }
    const service = await this._serviceRepo.findById(dto.serviceId);
    if (!service) {
      throw new NotFoundError("Service");
    }

    // 1. Fetch active bookings for this service
    const bookings = await this._bookingRepo.findByServiceId(dto.serviceId);

    // 2. Aggregate all booked dates
    const bookedDatesSet = new Set<string>();
    bookings
      .filter((b) => b.status !== BookingStatus.Cancelled)
      .forEach((b) => {
        b.dates.forEach((d) =>
          bookedDatesSet.add(d.toISOString().split("T")[0]),
        );
      });

    // 3. Filter available dates
    const availableDates = service.availableDates.filter((d) => {
      const dateString = d.toISOString().split("T")[0];
      return !bookedDatesSet.has(dateString);
    });

    return {
      id: service.id!,
      title: service.title,
      category: service.category,
      pricePerDay: service.pricePerDay,
      description: service.description,
      location: service.location,
      contactDetails: service.contactDetails,
      imageUrl: service.imageUrl,
      adminId: service.adminId,
      availableDates: availableDates,
      bookedDates: Array.from(bookedDatesSet).map((d) => new Date(d)),
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    };
  }
}
