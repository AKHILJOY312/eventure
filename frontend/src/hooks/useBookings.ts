import { useEffect, useState } from "react";
import type {
  Booking,
  CreateBookingInput,
  BookingQueryParams,
} from "@/types/booking.types";

import {
  createBooking,
  getMyBookings,
  cancelBooking,
  // calculateBookingPrice,
} from "@/services/booking.service";

export function useBookings(query?: BookingQueryParams) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getMyBookings(query);
      setBookings(res.data.data);
      setTotalPages(res.data.totalPages ?? 1);
      setTotal(res.data.total ?? 0);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch bookings";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [query?.page, query?.limit, query?.status]);

  const addBooking = async (data: CreateBookingInput) => {
    try {
      setCreating(true);
      const res = await createBooking(data);
      await fetchBookings(); // keep history synced
      return res.data.data;
    } finally {
      setCreating(false);
    }
  };

  const cancelBookingById = async (bookingId: string) => {
    try {
      setCancellingId(bookingId);
      await cancelBooking({ bookingId });
      await fetchBookings();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to cancel booking";
      setError(message);
    } finally {
      setCancellingId(null);
    }
  };

  // const getPrice = async (data: CreateBookingInput) => {
  //   const res = await calculateBookingPrice(data);
  //   return res.data.data;
  // };

  return {
    bookings,
    loading,
    error,
    creating,
    totalPages,
    total,
    refetch: fetchBookings,
    addBooking,
    cancelBooking: cancelBookingById,
    cancellingId,
    // getPrice,
  };
}
