import {
  Box,
  Typography,
  Paper,
  Stack,
  CircularProgress,
  Chip,
} from "@mui/material";
import { useBookings } from "@/hooks/useBookings";
import { COLORS } from "@/styles/theme";

function BookingsPage() {
  const { bookings, loading, error } = useBookings();
  const isEmpty = bookings.length === 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: 700, mb: 2, color: COLORS.primaryUI }}
      >
        My Bookings
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {isEmpty && !loading && (
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            border: `1px dashed ${COLORS.border}`,
            bgcolor: "rgba(0,0,0,0.02)",
          }}
        >
          <Typography sx={{ opacity: 0.6 }}>
            You have no bookings yet.
          </Typography>
        </Paper>
      )}

      {!isEmpty && (
        <Stack spacing={2}>
          {bookings.map((b) => (
            <Paper
              key={b.id}
              elevation={0}
              sx={{
                p: 2,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                "&:hover": { boxShadow: "0 4px 16px rgba(0,0,0,0.05)" },
              }}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {b.status || "Service"}
                </Typography>

                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  {b.startDate} → {b.endDate}
                </Typography>

                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  ₹{b.totalPrice}
                </Typography>
              </Box>

              <Chip
                label={b.status.toUpperCase()}
                color={getStatusColor(b.status)}
                size="small"
              />
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
}

export default BookingsPage;
