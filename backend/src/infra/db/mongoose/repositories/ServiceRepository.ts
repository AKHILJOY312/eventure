// src/infrastructure/repositories/ServiceRepository.ts
import { HydratedDocument, Types } from "mongoose";
import {
  ServiceModel,
  ServiceDoc,
  toServiceEntity,
} from "../models/ServiceModel";

import { IServiceRepository } from "@/application/ports/repositories/IServiceRepository";
import { Service } from "@/entities/Service";

export class ServiceRepository implements IServiceRepository {
  // ────────────────────────────────────────────────
  //  Helpers: Domain ↔ Persistence mapping
  // ────────────────────────────────────────────────
  private toDomain(doc: HydratedDocument<ServiceDoc>): Service {
    return toServiceEntity(doc);
  }

  private toPersistence(service: Service): Partial<ServiceDoc> {
    return {
      title: service.title,
      category: service.category,
      pricePerDay: service.pricePerDay,
      description: service.description,
      location: service.location,
      contactDetails: service.contactDetails,
      imageUrl: service.imageUrl,
      adminId: service.adminId
        ? new Types.ObjectId(service.adminId)
        : undefined,
      availableDates:
        service.availableDates.length > 0 ? service.availableDates : undefined,
      bookedDates:
        service.bookedDates.length > 0 ? service.bookedDates : undefined,
      // isDeleted: handled separately in softDelete
      // createdAt / updatedAt → automatic via timestamps
    };
  }

  // ────────────────────────────────────────────────
  //  Interface methods only (as per IServiceRepository)
  // ────────────────────────────────────────────────

  async create(service: Service): Promise<Service> {
    const doc = await ServiceModel.create(this.toPersistence(service));
    return this.toDomain(doc);
  }

  async update(service: Service): Promise<void> {
    if (!service.id) {
      throw new Error("Cannot update service without id");
    }

    await ServiceModel.updateOne(
      {
        _id: new Types.ObjectId(service.id),
        isDeleted: { $ne: true },
      },
      { $set: this.toPersistence(service) },
    );
  }

  async softDelete(serviceId: string): Promise<void> {
    if (!Types.ObjectId.isValid(serviceId)) {
      return;
    }

    await ServiceModel.updateOne(
      { _id: new Types.ObjectId(serviceId) },
      {
        $set: {
          isDeleted: true,
          updatedAt: new Date(),
        },
      },
    );
  }

  async findById(id: string): Promise<Service | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    const doc = await ServiceModel.findOne({
      _id: new Types.ObjectId(id),
      isDeleted: { $ne: true },
    });

    return doc ? this.toDomain(doc) : null;
  }
}
