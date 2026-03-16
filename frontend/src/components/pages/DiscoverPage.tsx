import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Stack,
  CircularProgress,
  Divider,
  Button,
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
import { useUi } from "@/hooks/useUi";

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
  const [bookingDates, setBookingDates] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    keyword: "",
    category: "",
    location: "",
    date: "",
    minPrice: "",
    maxPrice: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const { triggerAlert } = useUi();
  const { addBooking, creating } = useBookings();

  const fetchServices = async (nextPage = page) => {
    const searchParams: SearchServiceParams = { page: nextPage, limit: 10 };
    if (filters.keyword) searchParams.keyword = filters.keyword;
    if (filters.location) searchParams.location = filters.location;
    if (filters.date) searchParams.date = filters.date;
    if (filters.category) searchParams.category = filters.category;
    if (filters.minPrice !== "") searchParams.minPrice = Number(filters.minPrice);
    if (filters.maxPrice !== "") searchParams.maxPrice = Number(filters.maxPrice);

    await search(searchParams);
  };

  useEffect(() => {
    fetchServices();
  }, [page]);

  useEffect(() => {
    setBookingDates([]);
  }, [selectedService?.id]);

  const handleBook = async () => {
    if (!selectedService) return;

    const uniqueDates = Array.from(
      new Set(bookingDates.map((date) => dayjs(date).format("YYYY-MM-DD"))),
    ).sort();

    try {
      await addBooking({
        serviceId: selectedService.id,
        dates: uniqueDates,
      });

      triggerAlert("Booking successful!", "success");
      setSelectedService(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch bookings";
      triggerAlert(message || "Failed to book", "error");
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

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="outlined"
          onClick={() => setShowFilters((prev) => !prev)}
          sx={{ borderColor: COLORS.border, color: COLORS.primaryUI }}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </Box>

      {showFilters && (
        <>
          <DiscoverFilters
            filters={filters}
            setFilter={(k, v) => setFilters((p) => ({ ...p, [k]: v }))}
            onApply={() => {
              setPage(1);
              fetchServices(1);
            }}
            onReset={() => {
              setFilters({
                keyword: "",
                category: "",
                location: "",
                date: "",
                minPrice: "",
                maxPrice: "",
              });
              setPage(1);
              fetchServices(1);
            }}
          />

          <Divider sx={{ mb: 3 }} />
        </>
      )}

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
        bookingDates={bookingDates}
        setBookingDates={setBookingDates}
        onClose={() => setSelectedService(null)}
        onConfirm={handleBook}
        loading={creating}
      />
    </Box>
  );
}

export default DiscoverPage;
