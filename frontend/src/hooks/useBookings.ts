import { useEffect, useState } from "react";
import type {
  Booking,
  CreateBookingInput,
  BookingQueryParams,
} from "@/types/booking.types";

import {
  createBooking,
  getMyBookings,
  // calculateBookingPrice,
} from "@/services/booking.service";

export function useBookings(query?: BookingQueryParams) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getMyBookings(query);
      setBookings(res.data.data);
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
  }, []);

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

  // const getPrice = async (data: CreateBookingInput) => {
  //   const res = await calculateBookingPrice(data);
  //   return res.data.data;
  // };

  return {
    bookings,
    loading,
    error,
    creating,
    refetch: fetchBookings,
    addBooking,
    // getPrice,
  };
}
