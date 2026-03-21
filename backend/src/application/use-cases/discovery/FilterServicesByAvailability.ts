import {
  FilterByAvailabilityDto,
  PaginatedServicesDTO,
} from "@/application/dto/discover.dtos";
import { BadRequestError } from "@/application/error/AppError";
import { IServiceRepository } from "@/application/ports/repositories/IServiceRepository";
import { IFilterServicesByAvailability } from "@/application/ports/use-cases/discover/IDiscoverUseCase";
import { TYPES } from "@/config/di/types";
import { inject, injectable } from "inversify";
import { toServiceResponseDTO } from "@/application/mappers/user.service.mapper";

@injectable()
export class FilterServicesByAvailability implements IFilterServicesByAvailability {
  constructor(
    @inject(TYPES.ServiceRepository)
    private _serviceRepo: IServiceRepository,
  ) {}

  async execute(dto: FilterByAvailabilityDto): Promise<PaginatedServicesDTO> {
    if (!dto.date) {
      throw new BadRequestError("DATE_REQUIRED");
    }

    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;

    if (page <= 0 || limit <= 0) {
      throw new BadRequestError("INVALID_PAGINATION");
    }

    const skip = (page - 1) * limit;

    const { services, total } = await this._serviceRepo.findAvailablePaginated({
      date: dto.date,
      category: dto.category,
      location: dto.location,
      skip,
      limit,
    });

    return {
      data: services.map(toServiceResponseDTO),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
