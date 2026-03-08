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

    const updates: Partial<
      Pick<
        UpdateServiceDto,
        | "title"
        | "category"
        | "pricePerDay"
        | "description"
        | "location"
        | "contactDetails"
        | "imageUrl"
      >
    > = {};

    if (dto.title !== undefined) updates.title = dto.title;
    if (dto.category !== undefined) updates.category = dto.category;
    if (dto.pricePerDay !== undefined) updates.pricePerDay = dto.pricePerDay;
    if (dto.description !== undefined) updates.description = dto.description;
    if (dto.location !== undefined) updates.location = dto.location;
    if (dto.contactDetails !== undefined)
      updates.contactDetails = dto.contactDetails;
    if (dto.imageUrl !== undefined) updates.imageUrl = dto.imageUrl;

    // Let entity handle invariants
    if (Object.keys(updates).length > 0) {
      service.updateDetails(updates);
    }

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
