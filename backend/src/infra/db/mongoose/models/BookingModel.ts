// src/infrastructure/models/BookingModel.ts
import mongoose, { Document, Schema, Types } from "mongoose";
import { Booking, BookingProps } from "@/entities/Booking";

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface BookingDoc extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  serviceId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  isDeleted: boolean;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<BookingDoc>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true, // calculated before save
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true },
);

export const BookingModel = mongoose.model<BookingDoc>(
  "Booking",
  bookingSchema,
);

// Mapper: Mongo → Domain
export const toBookingEntity = (doc: BookingDoc): Booking => {
  const props: BookingProps = {
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    serviceId: doc.serviceId.toString(),
    startDate: doc.startDate,
    endDate: doc.endDate,
    totalPrice: doc.totalPrice,
    status: doc.status,
    createdAt: doc.createdAt,
  };

  return new Booking(props);
};
