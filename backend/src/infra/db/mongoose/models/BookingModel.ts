// src/infrastructure/models/BookingModel.ts
import mongoose, { Document, Schema, Types } from "mongoose";
import { Booking, BookingProps, BookingStatus } from "@/entities/Booking";

export interface BookingDoc extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  serviceId: Types.ObjectId;
  dates: Date[]; // array of consecutive dates (start → end)
  totalPrice: number;
  status: BookingStatus;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<BookingDoc>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
      index: true,
    },
    dates: {
      type: [Date],
      required: true,
      minlength: 1,
      // Optional: you can add custom validation if you want extra safety
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, "Total price cannot be negative"],
    },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.Pending,
      index: true, // useful for queries like "all pending bookings"
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// Optional: Add compound index if you frequently query by service + date range
// (helps with availability checks)
bookingSchema.index({ serviceId: 1, dates: 1 });

// Optional: Prevent overlapping bookings (very common requirement)
bookingSchema.pre("save", async function (next) {
  if (!this.isNew && !this.isModified("dates")) {
    return next();
  }

  try {
    const overlapQuery = {
      serviceId: this.serviceId,
      _id: { $ne: this._id },
      isDeleted: false,
      status: { $in: [BookingStatus.Pending, BookingStatus.Confirmed] },
      dates: { $in: this.dates }, // any shared date → overlap
    };

    const overlapping = await mongoose.models.Booking.findOne(overlapQuery);

    if (overlapping) {
      return next(new Error("Selected dates overlap with an existing booking"));
    }

    next();
  } catch (err) {
    next(err as Error);
  }
});

export const BookingModel = mongoose.model<BookingDoc>(
  "Booking",
  bookingSchema,
);

// ────────────────────────────────────────────────
// Mapper: MongoDB Document → Domain Entity
export function toBookingEntity(doc: BookingDoc): Booking {
  const props: BookingProps = {
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    serviceId: doc.serviceId.toString(),
    dates: doc.dates, // MongoDB returns Date objects
    totalPrice: doc.totalPrice,
    status: doc.status as BookingStatus,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };

  // The constructor will validate & normalize the dates array
  return new Booking(props);
}

// ────────────────────────────────────────────────
// Optional: Domain Entity → MongoDB (for create / update)
export function toBookingDocument(booking: Booking): Partial<BookingDoc> {
  return {
    userId: new Types.ObjectId(booking.userId),
    serviceId: new Types.ObjectId(booking.serviceId),
    dates: booking.dates, // already normalized Date[]
    totalPrice: booking.totalPrice,
    status: booking.status,
    isDeleted: false,
    // createdAt / updatedAt handled by Mongoose timestamps
  };
}
