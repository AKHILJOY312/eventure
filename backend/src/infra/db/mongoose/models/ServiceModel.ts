// src/infrastructure/models/ServiceModel.ts
import mongoose, { Document, Schema, Types } from "mongoose";
import { Service, ServiceCategory, ServiceProps } from "@/entities/Service";

export interface ServiceDoc extends Document {
  _id: Types.ObjectId;
  title: string;
  category: ServiceCategory;
  pricePerDay: number;
  description?: string;
  location: string;
  contactDetails?: string;
  imageUrl?: string;
  adminId: Types.ObjectId;
  availableDates?: Date[];
  bookedDates?: Date[];
  isDeleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<ServiceDoc>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: Object.values(ServiceCategory),
      required: true,
    },

    pricePerDay: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
    },

    location: {
      type: String,
      required: true,
    },

    contactDetails: {
      type: String,
    },

    imageUrl: {
      type: String,
    },

    adminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    availableDates: {
      type: [Date],
      default: [],
    },

    bookedDates: {
      type: [Date],
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);
serviceSchema.index({ adminId: 1, isDeleted: 1 });
serviceSchema.index({ category: 1, location: 1 });
serviceSchema.index({ title: "text", description: "text", location: "text" });

export const ServiceModel = mongoose.model<ServiceDoc>(
  "Service",
  serviceSchema,
);

// Mapper: Mongo → Domain
export const toServiceEntity = (doc: ServiceDoc): Service => {
  const props: ServiceProps = {
    id: doc._id.toString(),
    title: doc.title,
    category: doc.category as ServiceCategory,
    pricePerDay: doc.pricePerDay,
    description: doc.description,
    location: doc.location,
    contactDetails: doc.contactDetails,
    imageUrl: doc.imageUrl,
    adminId: doc.adminId.toString(),
    availableDates: doc.availableDates ?? [],
    bookedDates: doc.bookedDates ?? [],
    createdAt: doc.createdAt,
  };

  return new Service(props);
};
