// src/application/use-cases/admin/DeleteService.ts
import { injectable, inject } from "inversify";
import { TYPES } from "@/config/di/types";
import { DeleteServiceDto } from "@/application/dto/admin.dtos";
import { IServiceRepository } from "@/application/ports/repositories/IServiceRepository";
import { NotFoundError } from "@/application/error/AppError";
import { IDeleteService } from "@/application/ports/use-cases/admin/IAdminUseCase";

@injectable()
export class DeleteService implements IDeleteService {
  constructor(
    @inject(TYPES.ServiceRepository) private _serviceRepo: IServiceRepository,
  ) {}

  async execute(dto: DeleteServiceDto): Promise<{ message: string }> {
    const service = await this._serviceRepo.findByIdAndAdmin(
      dto.serviceId,
      dto.adminId,
    );
    if (!service) {
      throw new NotFoundError("SERVICE_NOT_FOUND_OR_NOT_OWNED");
    }

    await this._serviceRepo.softDelete(dto.serviceId);

    return { message: "SERVICE_DELETED_SUCCESSFULLY" };
  }
}
