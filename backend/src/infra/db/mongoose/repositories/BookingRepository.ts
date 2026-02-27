import { FilterQuery, HydratedDocument, Types } from "mongoose";
import {
  BookingModel,
  BookingDoc,
  toBookingEntity,
} from "../models/BookingModel";

import { IBookingRepository } from "@/application/ports/repositories/IBookingRepository";
import { Booking, BookingStatus } from "@/entities/Booking";

type SortableBookingFields =
  | "createdAt"
  | "startDate"
  | "endDate"
  | "totalPrice"
  | "status";

export class BookingRepository implements IBookingRepository {
  private toDomain(doc: HydratedDocument<BookingDoc>): Booking {
    return toBookingEntity(doc);
  }

  private toPersistence(booking: Booking): Partial<BookingDoc> {
    return {
      userId: booking.userId ? new Types.ObjectId(booking.userId) : undefined,
      serviceId: booking.serviceId
        ? new Types.ObjectId(booking.serviceId)
        : undefined,
      startDate: booking.startDate,
      endDate: booking.endDate,
      totalPrice: booking.totalPrice,
      status: booking.status,
    };
  }

  async create(booking: Booking): Promise<Booking> {
    const doc = await BookingModel.create(this.toPersistence(booking));
    return this.toDomain(doc);
  }

  async update(booking: Booking): Promise<void> {
    if (!booking.id) {
      throw new Error("Cannot update booking without id");
    }

    await BookingModel.updateOne(
      { _id: new Types.ObjectId(booking.id), isDeleted: { $ne: true } },
      { $set: this.toPersistence(booking) },
    );
  }

  async softDelete(bookingId: string): Promise<void> {
    if (!Types.ObjectId.isValid(bookingId)) {
      return;
    }

    await BookingModel.updateOne(
      { _id: new Types.ObjectId(bookingId) },
      {
        $set: {
          isDeleted: true,
          updatedAt: new Date(),
        },
      },
    );
  }

  async findById(id: string): Promise<Booking | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    const doc = await BookingModel.findOne({
      _id: new Types.ObjectId(id),
      isDeleted: { $ne: true },
    });
    return doc ? this.toDomain(doc) : null;
  }

  async findByServiceId(serviceId: string): Promise<Booking[]> {
    if (!Types.ObjectId.isValid(serviceId)) return [];

    const docs = await BookingModel.find({
      serviceId: new Types.ObjectId(serviceId),
      isDeleted: { $ne: true },
    }).sort({ startDate: 1 });

    return docs.map((doc) => this.toDomain(doc));
  }
  async findByServiceIdPaginated(params: {
    serviceId: string;
    status?: BookingStatus;
    skip?: number;
    limit?: number;
    sortBy?: SortableBookingFields;
    sortOrder?: "asc" | "desc";
  }): Promise<{ bookings: Booking[]; total: number }> {
    const {
      serviceId,
      status,
      skip = 0,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params;

    if (!Types.ObjectId.isValid(serviceId)) {
      return { bookings: [], total: 0 };
    }

    const filter: FilterQuery<BookingDoc> = {
      serviceId: new Types.ObjectId(serviceId),
      isDeleted: { $ne: true },
      ...(status ? { status } : {}),
    };

    const sort: Record<SortableBookingFields, 1 | -1> = {
      createdAt: 0 as 1 | -1,
      startDate: 0 as 1 | -1,
      endDate: 0 as 1 | -1,
      totalPrice: 0 as 1 | -1,
      status: 0 as 1 | -1,
    };

    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    const [docs, total] = await Promise.all([
      BookingModel.find(filter)
        .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(limit),
      BookingModel.countDocuments(filter),
    ]);

    return {
      bookings: docs.map((doc) => this.toDomain(doc)),
      total,
    };
  }
}
