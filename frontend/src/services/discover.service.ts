// discover.service.ts
import api from "./api";

/* =========================
   Search Services
========================= */

export const searchServices = (params?: {
  page?: number;
  limit?: number;
  keyword?: string;
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  date?: string; // ISO string
}) => {
  return api.get("/discover/services", { params });
};

/* =========================
   Filter By Availability
========================= */

export const filterServicesByAvailability = (params: {
  date: string; // ISO string
  category?: string;
  location?: string;
  page?: number;
  limit?: number;
}) => {
  return api.get("/discover/services/availability", { params });
};

/* =========================
   Get Service Details
========================= */

export const getServiceDetails = (serviceId: string) => {
  return api.get(`/discover/services/${serviceId}`);
};
