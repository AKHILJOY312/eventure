// booking.service.ts
import api from "./api";

/* =========================
   Create Booking
========================= */

export const createBooking = (data: {
  serviceId: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
}) => {
  return api.post("/bookings", data);
};

/* =========================
   Get My Bookings
========================= */

export const getMyBookings = (params?: {
  page?: number;
  limit?: number;
  status?: string;
}) => {
  return api.get("/bookings/me", { params });
};

/* =========================
   Calculate Booking Price
========================= */

export const calculateBookingPrice = (params: {
  serviceId: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
}) => {
  return api.get("/bookings/price/calculate", { params });
};
