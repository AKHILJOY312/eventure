import { Box, Typography, Paper, Stack, Chip } from "@mui/material";
import { COLORS } from "@/styles/theme";

type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface AdminBooking {
  id: string;
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: BookingStatus;
}

type Props = {
  bookings: AdminBooking[];
};

export function BookingsList({ bookings }: Props) {
  const isEmpty = bookings.length === 0;

  const getStatusColor = (status: AdminBooking["status"]) => {
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
    <Box>
      <Typography
        variant="overline"
        sx={{
          fontWeight: 800,
          letterSpacing: 1,
          color: COLORS.primaryUI,
          mb: 2,
          display: "block",
        }}
      >
        SERVICE BOOKINGS [{bookings.length}]
      </Typography>

      {isEmpty ? (
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            border: `1px dashed ${COLORS.border}`,
            bgcolor: "rgba(0,0,0,0.02)",
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.6 }}>
            No bookings found for this service.
          </Typography>
        </Paper>
      ) : (
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
                transition: "0.2s ease",
                "&:hover": {
                  boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                },
              }}
            >
              <Box>
                <Typography variant="subtitle2" fontWeight={600}>
                  User: {b.userId}
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
