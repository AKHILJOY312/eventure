import { Service, ServiceCategory } from "@/entities/Service";

// IServiceQueryRepository.ts
export interface IServiceQueryRepository {
  findById(id: string): Promise<Service | null>;
  findAll(): Promise<Service[]>;
  findByAdminId(adminId: string): Promise<Service[]>;
  findByCategory(category: ServiceCategory): Promise<Service[]>;
  findByLocation(location: string): Promise<Service[]>;
  findAvailable(category: ServiceCategory, date: Date): Promise<Service[]>;
  findAvailableInRange(
    category: ServiceCategory,
    startDate: Date,
    endDate: Date,
  ): Promise<Service[]>;
  //   findWithFilters(filters: ServiceFilter): Promise<Service[]>;
  //   getStats(): Promise<ServiceStats>;
  getPopularCategories(
    limit?: number,
  ): Promise<{ category: ServiceCategory; count: number }[]>;
}

// IServiceCommandRepository.ts
export interface IServiceCommandRepository {
  create(service: Service): Promise<Service>;
  update(service: Service): Promise<void>;
  delete(serviceId: string): Promise<void>;
}

// IServiceRepository.ts (combined)
export interface IServiceRepository
  extends IServiceQueryRepository, IServiceCommandRepository {}
