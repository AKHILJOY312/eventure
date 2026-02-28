// src/interface-adapters/http/validators/bookingValidators.ts
import { BookingStatus } from "@/entities/Booking";
import { z } from "zod";

export const createBookingSchema = z
  .object({
    serviceId: z.string().min(1, "Service ID is required"),
    startDate: z.iso
      .datetime({ message: "Invalid start date format (ISO)" })
      .refine(
        (val) => new Date(val) > new Date(),
        "Start date must be in the future",
      )
      .transform((val) => new Date(val)),
    endDate: z.iso
      .datetime({ message: "Invalid end date format (ISO)" })
      .transform((val) => new Date(val)),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export const getUserBookingsQuerySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, "Page must be a number")
    .transform(Number)
    .refine((n) => Number.isInteger(n) && n > 0, {
      message: "Page must be a positive integer",
    })
    .default(1)
    .optional(),

  limit: z
    .string()
    .regex(/^\d+$/, "Limit must be a number")
    .transform(Number)
    .refine((n) => Number.isInteger(n) && n > 0 && n <= 50, {
      message: "Limit must be an integer between 1 and 50",
    })
    .default(10)
    .optional(),

  status: z.enum(BookingStatus).optional(),
});

export const calculatePriceQuerySchema = z
  .object({
    serviceId: z.string().min(1, "Service ID is required"),
    startDate: z.iso
      .datetime({ message: "Invalid start date format" })
      .transform((val) => new Date(val)),
    endDate: z.iso
      .datetime({ message: "Invalid end date format" })
      .transform((val) => new Date(val)),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });
