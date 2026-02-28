import { Service, ServiceCategory } from "@/entities/Service";

export interface IServiceRepository {
  create(service: Service): Promise<Service>;
  update(service: Service): Promise<void>;
  softDelete(serviceId: string): Promise<void>;

  findById(id: string): Promise<Service | null>;
  findByIdAndAdmin(id: string, adminId: string): Promise<Service | null>;
  findByAdminId(
    adminId: string,
    options?: { skipDeleted?: boolean },
  ): Promise<Service[]>;
  findAll(params: {
    category?: ServiceCategory;
    location?: string;
  }): Promise<Service[]>;
  findAvailablePaginated(params: {
    date: Date;
    category?: ServiceCategory;
    location?: string;
    skip: number;
    limit: number;
  }): Promise<{ services: Service[]; total: number }>;
  searchPaginated(params: {
    keyword?: string;
    category?: ServiceCategory;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    skip: number;
    limit: number;
  }): Promise<{ services: Service[]; total: number }>;
}
