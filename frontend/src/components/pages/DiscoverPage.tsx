import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Stack,
  CircularProgress,
  Divider,
} from "@mui/material";
import { COLORS } from "@/styles/theme";
import dayjs from "dayjs";
import { useDiscover } from "@/hooks/useDiscover";
import { DiscoverFilters } from "@/components/organisms/discover/DiscoverFilters";
import { BookingModal } from "@/components/organisms/discover/BookingModal";
import { ServiceCard } from "@/components/organisms/discover/ServiceCard"; // Import here
import { Pagination } from "@/components/atoms/Pagination";
import type { SearchServiceParams } from "@/types/discover.types";
import { useBookings } from "@/hooks/useBookings";

function DiscoverPage() {
  const {
    services,
    loading,
    totalPages,
    search,
    getDetails,
    selectedService,
    setSelectedService,
  } = useDiscover();

  const [page, setPage] = useState(1);
  const [bookingDate, setBookingDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [filters, setFilters] = useState({
    keyword: "",
    category: "",
    location: "",
    date: "",
  });
  const { addBooking, creating } = useBookings();

  const fetchServices = async (nextPage = page) => {
    const searchParams: SearchServiceParams = { page: nextPage, limit: 10 };
    if (filters.keyword) searchParams.keyword = filters.keyword;
    if (filters.location) searchParams.location = filters.location;
    if (filters.date) searchParams.date = filters.date;
    if (filters.category) searchParams.category = filters.category;

    await search(searchParams);
  };

  useEffect(() => {
    fetchServices();
  }, [page]);

  const handleBook = async () => {
    if (!selectedService) return;

    const formattedDate = dayjs(bookingDate).format("YYYY-MM-DD");

    try {
      await addBooking({
        serviceId: selectedService.id,
        dates: [formattedDate],
      });

      alert("Booking successful!");
      setSelectedService(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch bookings";
      alert(message);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: 700, mb: 3, color: COLORS.primaryUI }}
      >
        Discover Services
      </Typography>

      <DiscoverFilters
        filters={filters}
        setFilter={(k, v) => setFilters((p) => ({ ...p, [k]: v }))}
        onApply={() => {
          setPage(1);
          fetchServices(1);
        }}
        onReset={() => {
          setFilters({ keyword: "", category: "", location: "", date: "" });
          setPage(1);
          fetchServices(1);
        }}
      />

      <Divider sx={{ mb: 3 }} />

      {loading ? (
        <CircularProgress sx={{ display: "block", mx: "auto", my: 4 }} />
      ) : (
        <>
          <Stack spacing={2}>
            {services.map((s) => (
              <ServiceCard key={s.id} service={s} onViewDetails={getDetails} />
            ))}
          </Stack>
          {services.length > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      <BookingModal
        open={!!selectedService}
        service={selectedService}
        bookingDate={bookingDate}
        setBookingDate={setBookingDate}
        onClose={() => setSelectedService(null)}
        onConfirm={handleBook}
        loading={creating}
      />
    </Box>
  );
}

export default DiscoverPage;
