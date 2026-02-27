import { inject, injectable } from "inversify";
import { IServiceRepository } from "@/application/ports/repositories/IServiceRepository";
import { TYPES } from "@/config/di/types";
import {
  CalculateBookingPriceDto,
  CalculateBookingPriceResponseDTO,
} from "@/application/dto/booking.dtos";
import { NotFoundError, BadRequestError } from "@/application/error/AppError";
import { ICalculateBookingPrice } from "@/application/ports/use-cases/booking/IBookingUseCase";

@injectable()
export class CalculateBookingPrice implements ICalculateBookingPrice {
  constructor(
    @inject(TYPES.ServiceRepository)
    private serviceRepo: IServiceRepository,
  ) {}

  async execute(
    dto: CalculateBookingPriceDto,
  ): Promise<CalculateBookingPriceResponseDTO> {
    const service = await this.serviceRepo.findById(dto.serviceId);

    if (!service) {
      throw new NotFoundError("SERVICE_NOT_FOUND");
    }

    if (dto.startDate >= dto.endDate) {
      throw new BadRequestError("INVALID_DATE_RANGE");
    }

    const diff =
      Math.ceil(
        (dto.endDate.getTime() - dto.startDate.getTime()) /
          (1000 * 60 * 60 * 24),
      ) + 1;

    const total = diff * service.pricePerDay;

    return {
      serviceId: service.id!,
      pricePerDay: service.pricePerDay,
      durationInDays: diff,
      totalPrice: total,
    };
  }
}
