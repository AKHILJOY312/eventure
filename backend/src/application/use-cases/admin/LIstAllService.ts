// src/application/use-cases/admin/ListAdminServices.ts

import { injectable, inject } from "inversify";
import { TYPES } from "@/config/di/types";
import { IServiceRepository } from "@/application/ports/repositories/IServiceRepository";
import { IListAllServices } from "@/application/ports/use-cases/admin/IAdminUseCase";
import {
  // ServiceResponseDTO,
  PaginatedServicesDTO,
} from "@/application/dto/admin.dtos";
// import { Service } from "@/entities/Service";
import { toAdminServiceResponseDTO } from "@/application/mappers/admin.service.mapper";

@injectable()
export class ListServices implements IListAllServices {
  constructor(
    @inject(TYPES.ServiceRepository)
    private _serviceRepo: IServiceRepository,
  ) {}

  async execute(dto: {
    adminId: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedServicesDTO> {
    const page = dto.page && dto.page > 0 ? dto.page : 1;
    const limit = dto.limit && dto.limit > 0 ? dto.limit : 10;

    const skip = (page - 1) * limit;

    const allServices = await this._serviceRepo.findByAdminId(dto.adminId, {
      skipDeleted: true,
    });

    const total = allServices.length;

    const paginated = allServices.slice(skip, skip + limit);

    const totalPages = Math.ceil(total / limit);

    return {
      data: paginated.map((s) => toAdminServiceResponseDTO(s)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  // private toResponseDTO(s: Service): ServiceResponseDTO {
  //   return {
  //     id: s.id!,
  //     title: s.title,
  //     category: s.category,
  //     pricePerDay: s.pricePerDay,
  //     description: s.description,
  //     location: s.location,
  //     contactDetails: s.contactDetails,
  //     imageUrl: s.imageUrl,
  //     adminId: s.adminId,
  //     availableDates: s.availableDates,
  //     bookedDates: s.bookedDates,
  //     createdAt: s.createdAt,
  //     updatedAt: s.updatedAt,
  //   };
  // }
}
