import { Service } from "@/entities/Service";

export interface IServiceRepository {
  create(service: Service): Promise<Service>;
  update(service: Service): Promise<void>;
  softDelete(serviceId: string): Promise<void>;

  findById(id: string): Promise<Service | null>;
}
