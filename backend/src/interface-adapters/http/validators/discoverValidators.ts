import { z } from "zod";
import { ServiceCategory } from "@/entities/Service";

// pagination base
const paginationSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});

// search
export const searchServicesSchema = paginationSchema.extend({
  keyword: z.string().min(1).optional(),
  category: z.enum(ServiceCategory).optional(),
  location: z.string().min(1).optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  date: z.coerce.date().optional(),
});

// filter availability
export const filterAvailabilitySchema = paginationSchema.extend({
  date: z.coerce.date(),
  category: z.enum(ServiceCategory).optional(),
  location: z.string().min(1).optional(),
});

// get details
export const getServiceDetailsSchema = z.object({
  serviceId: z.string().min(1),
});
