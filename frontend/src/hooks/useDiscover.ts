import { useState } from "react";
import type {
  Service,
  SearchServiceParams,
  AvailabilityFilterParams,
} from "@/types/discover.types";

import {
  searchServices,
  filterServicesByAvailability,
  getServiceDetails,
} from "@/services/discover.service";

export function useDiscover() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (params?: SearchServiceParams) => {
    try {
      setLoading(true);
      const res = await searchServices(params);
      setServices(res.data.data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to search services";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const filterByAvailability = async (params: AvailabilityFilterParams) => {
    try {
      setLoading(true);
      const res = await filterServicesByAvailability(params);
      setServices(res.data.data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to filter services";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const getDetails = async (serviceId: string) => {
    try {
      setLoading(true);
      const res = await getServiceDetails(serviceId);
      setSelectedService(res.data.data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load service details";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    services,
    selectedService,
    setSelectedService,
    loading,
    error,
    search,
    filterByAvailability,
    getDetails,
  };
}
