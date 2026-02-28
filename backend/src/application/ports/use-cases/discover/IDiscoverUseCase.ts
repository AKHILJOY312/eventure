// ===================== INTERFACES =====================

import {
  FilterByAvailabilityDto,
  GetServiceDetailsDto,
  PaginatedServicesDTO,
  SearchServicesDto,
  ServiceResponseDTO,
} from "@/application/dto/discover.dtos";

export interface ISearchServices {
  execute(dto: SearchServicesDto): Promise<PaginatedServicesDTO>;
}

export interface IFilterServicesByAvailability {
  execute(dto: FilterByAvailabilityDto): Promise<PaginatedServicesDTO>;
}

export interface IGetServiceDetails {
  execute(dto: GetServiceDetailsDto): Promise<ServiceResponseDTO>;
}
