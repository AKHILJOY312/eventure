import { useState } from "react";
import type {
  // AdminService,
  ServiceInput,
  AdminServiceBooking,
  AdminService,
} from "@/types/admin.types";

import {
  createService,
  updateService,
  deleteService,
  getServiceBookings,
  getAdminServices,
} from "@/services/admin.service";

export function useAdminServices() {
  const [services, setServices] = useState<AdminService[]>([]);
  const [bookings, setBookings] = useState<AdminServiceBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
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

  const fetchServiceBookings = async (serviceId: string) => {
    try {
      setLoading(true);
      const res = await getServiceBookings(serviceId);
      setBookings(res.data.data);
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
  return {
    // services,
    bookings,
    loading,
    error,
    services,
    total,
    totalPages,
    addService,
    editService,
    removeService,
    fetchServiceBookings,
    fetchAdminServices,
  };
}
