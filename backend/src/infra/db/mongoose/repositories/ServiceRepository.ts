// src/infrastructure/repositories/ServiceRepository.ts
import { FilterQuery, HydratedDocument, Types } from "mongoose";
import {
  ServiceModel,
  ServiceDoc,
  toServiceEntity,
} from "../models/ServiceModel";

import { IServiceRepository } from "@/application/ports/repositories/IServiceRepository";
import { Service, ServiceCategory } from "@/entities/Service";

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

  async findByIdAndAdmin(id: string, adminId: string): Promise<Service | null> {
    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(adminId)) {
      return null;
    }

    const filter: FilterQuery<ServiceDoc> = {
      _id: new Types.ObjectId(id),
      adminId: new Types.ObjectId(adminId),
      isDeleted: { $ne: true },
    };

    const doc = await ServiceModel.findOne(filter);

    return doc ? this.toDomain(doc) : null;
  }

  async findByAdminId(
    adminId: string,
    options?: { skipDeleted?: boolean },
  ): Promise<Service[]> {
    if (!Types.ObjectId.isValid(adminId)) return [];

    const filter: FilterQuery<ServiceDoc> = {
      adminId: new Types.ObjectId(adminId),
    };

    if (options?.skipDeleted !== false) {
      filter.isDeleted = { $ne: true };
    }

    const docs = await ServiceModel.find(filter).sort({ createdAt: -1 });

    return docs.map((doc) => this.toDomain(doc));
  }

  async findAll(params: {
    category?: ServiceCategory;
    location?: string;
  }): Promise<Service[]> {
    const filter: FilterQuery<ServiceDoc> = {
      isDeleted: { $ne: true },
    };

    if (params.category) {
      filter.category = params.category;
    }
    if (params.location) {
      filter.location = { $regex: params.location, $options: "i" };
    }
    const docs = await ServiceModel.find(filter).sort({ createAt: -1 });
    return docs.map((doc) => this.toDomain(doc));
  }

  async findAvailablePaginated(params: {
    date: Date;
    category?: ServiceCategory;
    location?: string;
    skip: number;
    limit: number;
  }): Promise<{ services: Service[]; total: number }> {
    const start = new Date(params.date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 1);

    const filter: FilterQuery<ServiceDoc> = {
      isDeleted: { $ne: true },
      availableDates: { $elemMatch: { $gte: start, $lt: end } },
      bookedDates: { $not: { $elemMatch: { $gte: start, $lt: end } } },
    };
    if (params.category) {
      filter.category = params.category;
    }
    if (params.location) {
      filter.location = { $regex: params.location, $options: "i" };
    }

    const [docs, total] = await Promise.all([
      ServiceModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(params.skip)
        .limit(params.limit),
      ServiceModel.countDocuments(filter),
    ]);

    return {
      services: docs.map((doc) => this.toDomain(doc)),
      total,
    };
  }

  async searchPaginated(params: {
    keyword?: string;
    category?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    date?: Date;
    skip: number;
    limit: number;
  }): Promise<{ services: Service[]; total: number }> {
    const filter: FilterQuery<ServiceDoc> = {
      isDeleted: { $ne: true },
    };

    if (params.keyword) {
      const terms = params.keyword
        .trim()
        .split(/\s+/)
        .filter(Boolean);

      if (terms.length > 0) {
        const escapeRegex = (value: string) =>
          value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const pattern = `\\b(?:${terms.map(escapeRegex).join("|")})`;
        filter.$or = [
          { title: { $regex: pattern, $options: "i" } },
        ];
      }
    }

    if (params.category) {
      filter.category = params.category;
    }

    if (params.location) {
      filter.location = { $regex: params.location, $options: "i" };
    }

    if (params.date) {
      const start = new Date(params.date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(start.getDate() + 1);

      filter.availableDates = { $elemMatch: { $gte: start, $lt: end } };
      filter.bookedDates = { $not: { $elemMatch: { $gte: start, $lt: end } } };
    }

    if (params.minPrice !== undefined || params.maxPrice !== undefined) {
      filter.pricePerDay = {};
      if (params.minPrice !== undefined) {
        filter.pricePerDay.$gte = params.minPrice;
      }
      if (params.maxPrice !== undefined) {
        filter.pricePerDay.$lte = params.maxPrice;
      }
    }

    const [docs, total] = await Promise.all([
      ServiceModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(params.skip)
        .limit(params.limit),
      ServiceModel.countDocuments(filter),
    ]);

    return {
      services: docs.map((doc) => this.toDomain(doc)),
      total,
    };
  }
}
