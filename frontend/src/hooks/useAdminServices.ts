import { useState } from "react";
import type {
  // AdminService,
  ServiceInput,
  AdminServiceBooking,
  AdminService,
} from "@/types/service.types";

import {
  createService,
  updateService,
  deleteService,
  getServiceBookings,
  getAdminServices,
  updateBookingStatus,
} from "@/services/admin.service";

export function useAdminServices() {
  const [services, setServices] = useState<AdminService[]>([]);
  const [bookings, setBookings] = useState<AdminServiceBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [bookingsTotalPages, setBookingsTotalPages] = useState(1);
  const [bookingsTotal, setBookingsTotal] = useState(0);
  const addService = async (data: ServiceInput) => {
    try {
      setLoading(true);
      const res = await createService(data);
      return res.data.data;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create service";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editService = async (serviceId: string, data: ServiceInput) => {
    try {
      setLoading(true);
      const res = await updateService(serviceId, data);
      return res.data.data;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update service";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeService = async (serviceId: string) => {
    try {
      setLoading(true);
      await deleteService(serviceId);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to delete service";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceBookings = async (
    serviceId: string,
    page = 1,
    limit = 5,
  ) => {
    try {
      setLoading(true);
      const res = await getServiceBookings(serviceId, { page, limit });
      setBookings(res.data.data);
      setBookingsTotal(res.data.total ?? 0);
      setBookingsTotalPages(res.data.totalPages ?? 1);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch bookings";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminServices = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const res = await getAdminServices({ page, limit });

      setServices(res.data.data);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);

      return res.data;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch services";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const moveBookingStatus = async (
    serviceId: string,
    bookingId: string,
    status: "pending" | "confirmed" | "cancelled",
  ) => {
    try {
      setLoading(true);
      await updateBookingStatus(serviceId, bookingId, status);

      setBookings((prev) =>
        prev.map((booking) =>
          booking.bookingId === bookingId ? { ...booking, status } : booking,
        ),
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update booking status";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    // services,
    bookings,
    loading,
    error,
    services,
    total,
    totalPages,
    bookingsTotal,
    bookingsTotalPages,
    addService,
    editService,
    removeService,
    fetchServiceBookings,
    fetchAdminServices,
    moveBookingStatus,
  };
}
