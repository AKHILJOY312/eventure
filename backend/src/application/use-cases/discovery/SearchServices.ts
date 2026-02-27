import {
  SearchServicesDto,
  PaginatedServicesDTO,
} from "@/application/dto/discover.dtos";
import { IServiceRepository } from "@/application/ports/repositories/IServiceRepository";
import { ISearchServices } from "@/application/ports/use-cases/discover/IDiscoverUseCase";
import { TYPES } from "@/config/di/types";
import { inject, injectable } from "inversify";
import { toServiceResponseDTO } from "@/application/mappers/service.mapper";

@injectable()
export class SearchServices implements ISearchServices {
  constructor(
    @inject(TYPES.ServiceRepository)
    private _serviceRepo: IServiceRepository,
  ) {}

  async execute(dto: SearchServicesDto): Promise<PaginatedServicesDTO> {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;

    if (page <= 0 || limit <= 0) {
      throw new Error("INVALID_PAGINATION");
    }

    if (
      dto.minPrice !== undefined &&
      dto.maxPrice !== undefined &&
      dto.minPrice > dto.maxPrice
    ) {
      throw new Error("INVALID_PRICE_RANGE");
    }

    const skip = (page - 1) * limit;

    const { services, total } = await this._serviceRepo.searchPaginated({
      keyword: dto.keyword,
      category: dto.category,
      location: dto.location,
      minPrice: dto.minPrice,
      maxPrice: dto.maxPrice,
      skip,
      limit,
    });

    const filtered = services;

    return {
      data: filtered.map(toServiceResponseDTO),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
