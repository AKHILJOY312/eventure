// src/application/use-cases/admin/UpdateService.ts
import { injectable, inject } from "inversify";
import { TYPES } from "@/config/di/types";
import {
  UpdateServiceDto,
  ServiceResponseDTO,
} from "@/application/dto/admin.dtos";
import { IServiceRepository } from "@/application/ports/repositories/IServiceRepository";
import { NotFoundError } from "@/application/error/AppError";
import { IUpdateService } from "@/application/ports/use-cases/admin/IAdminUseCase";
import { Service } from "@/entities/Service";

@injectable()
export class UpdateService implements IUpdateService {
  constructor(
    @inject(TYPES.ServiceRepository)
    private _serviceRepo: IServiceRepository,
  ) {}

  async execute(dto: UpdateServiceDto): Promise<ServiceResponseDTO> {
    const service = await this._serviceRepo.findByIdAndAdmin(
      dto.serviceId,
      dto.adminId,
    );

    if (!service) {
      throw new NotFoundError("SERVICE_NOT_FOUND_OR_NOT_OWNED");
    }

    // Let entity handle invariants
    service.updateDetails({
      title: dto.title,
      category: dto.category,
      pricePerDay: dto.pricePerDay,
      description: dto.description,
      location: dto.location,
      contactDetails: dto.contactDetails,
      imageUrl: dto.imageUrl,
    });

    if (dto.availableDates !== undefined) {
      service.updateAvailableDates(dto.availableDates.map((d) => new Date(d)));
    }

    await this._serviceRepo.update(service);

    return this.toResponseDTO(service);
  }

  private toResponseDTO(service: Service): ServiceResponseDTO {
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
