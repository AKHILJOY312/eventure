// src/application/use-cases/admin/CreateService.ts
import { injectable, inject } from "inversify";
import { TYPES } from "@/config/di/types";
import {
  CreateServiceDto,
  ServiceResponseDTO,
} from "@/application/dto/admin.dtos";

import { IServiceRepository } from "@/application/ports/repositories/IServiceRepository";
import { Service } from "@/entities/Service";
import { BadRequestError } from "@/application/error/AppError";
import { ICreateService } from "@/application/ports/use-cases/admin/IAdminUseCase";

@injectable()
export class CreateService implements ICreateService {
  constructor(
    @inject(TYPES.ServiceRepository) private serviceRepo: IServiceRepository,
  ) {}

  async execute(dto: CreateServiceDto): Promise<ServiceResponseDTO> {
    if (dto.pricePerDay <= 0) {
      throw new BadRequestError("PRICE_MUST_BE_POSITIVE");
    }
    if (!dto.title?.trim()) {
      throw new BadRequestError("TITLE_IS_REQUIRED");
    }

    const service = new Service({
      title: dto.title.trim(),
      category: dto.category,
      pricePerDay: dto.pricePerDay,
      description: dto.description?.trim(),
      location: dto.location.trim(),
      contactDetails: dto.contactDetails?.trim(),
      imageUrl: dto.imageUrl,
      adminId: dto.adminId,
      availableDates: dto.availableDates ?? [],
      bookedDates: [],
    });

    const created = await this.serviceRepo.create(service);

    return this.toResponseDTO(created);
  }

  private toResponseDTO(s: Service): ServiceResponseDTO {
    return {
      id: s.id!,
      title: s.title,
      category: s.category,
      pricePerDay: s.pricePerDay,
      description: s.description,
      location: s.location,
      contactDetails: s.contactDetails,
      imageUrl: s.imageUrl,
      adminId: s.adminId,
      availableDates: s.availableDates,
      bookedDates: s.bookedDates,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    };
  }
}
