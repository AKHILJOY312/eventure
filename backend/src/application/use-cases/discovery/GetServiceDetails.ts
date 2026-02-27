import {
  GetServiceDetailsDto,
  ServiceResponseDTO,
} from "@/application/dto/discover.dtos";
import { BadRequestError, NotFoundError } from "@/application/error/AppError";
import { IServiceRepository } from "@/application/ports/repositories/IServiceRepository";
import { IGetServiceDetails } from "@/application/ports/use-cases/discover/IDiscoverUseCase";
import { TYPES } from "@/config/di/types";
import { inject, injectable } from "inversify";

@injectable()
export class GetServiceDetails implements IGetServiceDetails {
  constructor(
    @inject(TYPES.ServiceRepository) private _serviceRepo: IServiceRepository,
  ) {}

  async execute(dto: GetServiceDetailsDto): Promise<ServiceResponseDTO> {
    if (!dto.serviceId) {
      throw new BadRequestError("Service Id Required");
    }
    const service = await this._serviceRepo.findById(dto.serviceId);
    if (!service) {
      throw new NotFoundError("Service");
    }
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
      availableDates: service.availableDates,
      bookedDates: service.bookedDates,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    };
  }
}
