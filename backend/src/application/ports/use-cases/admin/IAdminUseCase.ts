import {
  BookingStatusUpdateResponseDTO,
  CreateServiceDto,
  DeleteServiceDto,
  GetServiceBookingsDto,
  PaginatedServiceBookingsDTO,
  PaginatedServicesDTO,
  PaginationDto,
  UpdateBookingStatusDto,
  UpdateServiceDto,
} from "@/application/dto/admin.dtos";
import { ServiceResponseDTO } from "@/application/dto/discover.dtos";

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
export interface IListAllServices {
  execute(dto: PaginationDto): Promise<PaginatedServicesDTO>;
}

export interface IUpdateBookingStatus {
  execute(dto: UpdateBookingStatusDto): Promise<BookingStatusUpdateResponseDTO>;
}
