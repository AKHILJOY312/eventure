import { FilterQuery, HydratedDocument, Types } from "mongoose";
import {
  BookingModel,
  BookingDoc,
  toBookingEntity,
} from "../models/BookingModel";

import {
  IBookingRepository,
  PaginatedBookingResult,
  SortOrder,
  BookingSortableFields,
} from "@/application/ports/repositories/IBookingRepository";

import { Booking, BookingStatus } from "@/entities/Booking";

export class BookingRepository implements IBookingRepository {
  // ---------------------------
  // Mapping
  // ---------------------------

  private toDomain(doc: HydratedDocument<BookingDoc>): Booking {
    return toBookingEntity(doc);
  }

  private toPersistence(booking: Booking): Partial<BookingDoc> {
    return {
      userId: new Types.ObjectId(booking.userId),
      serviceId: new Types.ObjectId(booking.serviceId),
      startDate: booking.startDate,
      endDate: booking.endDate,
      totalPrice: booking.totalPrice,
      status: booking.status,
    };
  }

  // ---------------------------
  // Create
  // ---------------------------

  async create(booking: Booking): Promise<Booking> {
    const doc = await BookingModel.create(this.toPersistence(booking));
    return this.toDomain(doc);
  }

  // ---------------------------
  // Update
  // ---------------------------

  async update(booking: Booking): Promise<void> {
    if (!booking.id) {
      throw new Error("Cannot update booking without id");
    }

    const result = await BookingModel.updateOne(
      {
        _id: new Types.ObjectId(booking.id),
        isDeleted: { $ne: true },
      },
      {
        $set: this.toPersistence(booking),
      },
    );

    if (result.matchedCount === 0) {
      throw new Error("Booking not found or already deleted");
    }
  }

  // ---------------------------
  // Soft Delete
  // ---------------------------

  async softDelete(bookingId: string): Promise<void> {
    const result = await BookingModel.updateOne(
      {
        _id: new Types.ObjectId(bookingId),
        isDeleted: { $ne: true },
      },
      {
        $set: {
          isDeleted: true,
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      throw new Error("Booking not found or already deleted");
    }
  }

  // ---------------------------
  // Find By ID
  // ---------------------------

  async findById(id: string): Promise<Booking | null> {
    const doc = await BookingModel.findOne({
      _id: new Types.ObjectId(id),
      isDeleted: { $ne: true },
    });

    return doc ? this.toDomain(doc) : null;
  }

  // ---------------------------
  // Find By Service (non-paginated)
  // ---------------------------

  async findByServiceId(serviceId: string): Promise<Booking[]> {
    const docs = await BookingModel.find({
      serviceId: new Types.ObjectId(serviceId),
      isDeleted: { $ne: true },
    }).sort({ startDate: 1 });

    return docs.map((doc) => this.toDomain(doc));
  }

  // ---------------------------
  // Find By Service (paginated)
  // ---------------------------

  async findByServiceIdPaginated(params: {
    serviceId: string;
    status?: BookingStatus;
    skip?: number;
    limit?: number;
    sortBy?: BookingSortableFields;
    sortOrder?: SortOrder;
  }): Promise<PaginatedBookingResult> {
    const {
      serviceId,
      status,
      skip = 0,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params;

    const filter: FilterQuery<BookingDoc> = {
      serviceId: new Types.ObjectId(serviceId),
      isDeleted: { $ne: true },
      ...(status ? { status } : {}),
    };

    const sortDirection = sortOrder === "asc" ? 1 : -1;

    const [docs, total] = await Promise.all([
      BookingModel.find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(limit),
      BookingModel.countDocuments(filter),
    ]);

    return {
      bookings: docs.map((doc) => this.toDomain(doc)),
      total,
    };
  }

  // ---------------------------
  // Find Overlapping Bookings
  // ---------------------------

  async findOverlappingBookings(params: {
    serviceId: string;
    startDate: Date;
    endDate: Date;
  }): Promise<Booking[]> {
    const { serviceId, startDate, endDate } = params;

    const filter: FilterQuery<BookingDoc> = {
      serviceId: new Types.ObjectId(serviceId),
      isDeleted: { $ne: true },
      status: { $ne: "cancelled" }, // cancelled bookings do not block availability
      startDate: { $lte: endDate },
      endDate: { $gte: startDate },
    };

    const docs = await BookingModel.find(filter);

    return docs.map((doc) => this.toDomain(doc));
  }

  // ---------------------------
  // Find By User (paginated)
  // ---------------------------

  async findByUserIdPaginated(params: {
    userId: string;
    status?: BookingStatus;
    skip?: number;
    limit?: number;
    sortBy?: BookingSortableFields;
    sortOrder?: SortOrder;
  }): Promise<PaginatedBookingResult> {
    const {
      userId,
      status,
      skip = 0,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params;

    const filter: FilterQuery<BookingDoc> = {
      userId: new Types.ObjectId(userId),
      isDeleted: { $ne: true },
      ...(status ? { status } : {}),
    };

    const sortDirection = sortOrder === "asc" ? 1 : -1;

    const [docs, total] = await Promise.all([
      BookingModel.find(filter)
        .sort({ [sortBy]: sortDirection })
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
