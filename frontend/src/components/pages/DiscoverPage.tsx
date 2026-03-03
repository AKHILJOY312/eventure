import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Grid,
  Divider,
} from "@mui/material";
import { COLORS } from "@/styles/theme";
import { createBooking } from "@/services/booking.service";
import dayjs from "dayjs";
import { useDiscover } from "@/hooks/useDiscover";
import type { ServiceCategory } from "@/types/admin.types";

const CATEGORIES: ServiceCategory[] = [
  "Venue",
  "Hotel",
  "Caterer",
  "Cameraman",
  "DJ",
];

export function DiscoverPage() {
  const {
    services,
    loading,
    error,
    search,
    getDetails,
    selectedService,
    setSelectedService,
  } = useDiscover();

  // Pagination & Search
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");

  // --- New Filter States ---
  const [category, setCategory] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [filterDate, setFilterDate] = useState<string>("");
  const [location, setLocation] = useState("");

  // Booking states
  const [bookingDate, setBookingDate] = useState<string>(
    dayjs().format("YYYY-MM-DD"),
  );
  const [bookingLoading, setBookingLoading] = useState(false);

  // Updated Fetch logic to include all filters
  const fetchServices = async () => {
    try {
      await search({
        page,
        limit: 10,
        keyword: keyword || undefined,
        category: category || undefined,
        location: location || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        date: filterDate || undefined,
      });
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  // Trigger search on page change OR when filters are applied
  useEffect(() => {
    fetchServices();
  }, [page]);

  const handleReset = () => {
    setKeyword("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setFilterDate("");
    setLocation("");
    setPage(1);
  };

  const handleViewDetails = async (serviceId: string) => {
    try {
      await getDetails(serviceId);
    } catch (err) {
      console.error("Details failed", err);
    }
  };

  const handleBook = async () => {
    if (!selectedService) return;
    try {
      setBookingLoading(true);
      await createBooking({
        serviceId: selectedService.id,
        startDate: bookingDate,
        endDate: bookingDate,
      });
      alert("Booking successful!");
      setSelectedService(null);
    } catch (err: any) {
      alert(err.message || "Booking failed");
    } finally {
      setBookingLoading(false);
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

      {/* --- Filter Section --- */}
      <Paper sx={{ p: 2, mb: 4, borderRadius: 2, bgcolor: "#f9f9f9" }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              label="Search keyword"
              placeholder="Name or description..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <TextField
              select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              fullWidth
            >
              <MenuItem value="">All Categories</MenuItem>
              {CATEGORIES.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <TextField
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <TextField
              label="Min Price"
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <TextField
              label="Max Price"
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              label="Available on Date"
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid
            size={{ xs: 12, md: 9 }}
            sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
          >
            <Button variant="outlined" onClick={handleReset}>
              Reset
            </Button>
            <Button
              variant="contained"
              sx={{ bgcolor: COLORS.accent }}
              onClick={() => {
                setPage(1);
                fetchServices();
              }}
            >
              Apply Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Divider sx={{ mb: 3 }} />

      {loading && (
        <CircularProgress sx={{ display: "block", mx: "auto", my: 4 }} />
      )}
      {error && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}

      {!loading && services.length === 0 && (
        <Typography align="center" sx={{ py: 4, opacity: 0.6 }}>
          No services found matching your criteria.
        </Typography>
      )}

      <Stack spacing={2}>
        {services.map((s) => (
          <Paper
            key={s.id}
            sx={{ p: 2, border: `1px solid ${COLORS.border}`, borderRadius: 2 }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {s.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {s.category} • {s.location}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                  ₹{s.price}{" "}
                  <Typography component="span" variant="caption">
                    / day
                  </Typography>
                </Typography>
              </Box>
              <Button
                variant="outlined"
                onClick={() => handleViewDetails(s.id)}
              >
                View Details
              </Button>
            </Box>
          </Paper>
        ))}
      </Stack>

      {/* Pagination */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          mt: 4,
        }}
      >
        <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </Button>
        <Typography fontWeight={600}>Page {page}</Typography>
        <Button onClick={() => setPage((p) => p + 1)}>Next</Button>
      </Box>

      {/* Booking Modal */}
      <Dialog open={!!selectedService} onClose={() => setSelectedService(null)}>
        <DialogTitle>Book {selectedService?.title}</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minWidth: 350,
            mt: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {selectedService?.description}
          </Typography>
          <TextField
            label="Select Date"
            type="date"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <Box sx={{ bgcolor: "#f0f4f8", p: 2, borderRadius: 1 }}>
            <Typography variant="subtitle2">Total Price</Typography>
            <Typography variant="h5" color="primary">
              ₹{selectedService?.price}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setSelectedService(null)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleBook}
            disabled={bookingLoading}
          >
            {bookingLoading ? "Booking..." : "Confirm Booking"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DiscoverPage;
