import { z } from "zod";
import { ServiceCategory } from "@/entities/Service";
import { BookingStatus } from "@/entities/Booking";

// Helper for date arrays
const dateArraySchema = z
  .array(
    z.preprocess((arg) => {
      if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    }, z.date()),
  )
  .optional();

export const createServiceSchema = z.object({
  title: z.string().min(3).max(100),
  category: z.enum(ServiceCategory),
  pricePerDay: z.number().positive(),
  description: z.string().optional(),
  location: z.string().min(2),
  contactDetails: z.string().optional(),
  imageUrl: z.string().url().optional(),
  availableDates: dateArraySchema,
});

export const updateServiceSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  category: z.enum(ServiceCategory).optional(),
  pricePerDay: z.number().positive().optional(),
  description: z.string().optional(),
  location: z.string().min(2).optional(),
  contactDetails: z.string().optional(),
  imageUrl: z.string().url().optional(),
  availableDates: dateArraySchema,
});

export const getBookingsSchema = z.object({
  page: z.preprocess((val) => Number(val), z.number().min(1)).optional(),
  limit: z
    .preprocess((val) => Number(val), z.number().min(1).max(50))
    .optional(),
  status: z.enum(BookingStatus).optional(),
});
