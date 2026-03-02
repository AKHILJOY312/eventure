// admin.service.ts
import api from "./api";

/* =========================
   Service Management
========================= */

export const createService = (data: {
  title: string;
  category: string;
  pricePerDay: number;
  description?: string;
  location: string;
  contactDetails?: string;
  imageUrl?: string;
  availableDates?: string[];
}) => {
  return api.post("/admin/services", data);
};

export const updateService = (
  serviceId: string,
  data: {
    title?: string;
    category?: string;
    pricePerDay?: number;
    description?: string;
    location?: string;
    contactDetails?: string;
    imageUrl?: string;
    availableDates?: string[];
  },
) => {
  return api.patch(`/admin/services/${serviceId}`, data);
};

export const deleteService = (serviceId: string) => {
  return api.delete(`/admin/services/${serviceId}`);
};

/* =========================
   Bookings (Per Service)
========================= */

export const getServiceBookings = (
  serviceId: string,
  params?: {
    page?: number;
    limit?: number;
    status?: string;
  },
) => {
  return api.get(`/admin/services/${serviceId}/bookings`, { params });
};
