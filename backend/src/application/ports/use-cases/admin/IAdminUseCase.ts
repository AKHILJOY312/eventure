// ===================== INTERFACES =====================

export interface ICreateService {
  execute(dto: CreateServiceDto): Promise<ServiceResponseDTO>;
}

export interface IUpdateService {
  execute(dto: UpdateServiceDto): Promise<ServiceResponseDTO>;
}

export interface IDeleteService {
  execute(dto: DeleteServiceDto): Promise<{ message: string }>;
}

export interface IGetServiceBookings {
  execute(dto: GetServiceBookingsDto): Promise<PaginatedServiceBookingsDTO>;
}
