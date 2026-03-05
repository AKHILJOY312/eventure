import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { COLORS } from "@/styles/theme";
import type {
  AdminBookingStatus,
  AdminServiceBooking,
} from "@/types/service.types";
import { Pagination } from "@/components/atoms/Pagination";

type Props = {
  bookings: AdminServiceBooking[];
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onMoveStatus: (
    serviceId: string,
    bookingId: string,
    status: AdminBookingStatus,
  ) => Promise<void>;
};

export function BookingsList({
  bookings,
  page,
  totalPages,
  onPageChange,
  onMoveStatus,
}: Props) {
  const isEmpty = bookings.length === 0;
  const dateFormatter = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formatDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return dateFormatter.format(date);
  };

  const getStatusColor = (status: AdminBookingStatus) => {
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
        <>
          <Stack spacing={2}>
            {bookings.map((b) => (
              <Paper
                key={b.bookingId}
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
                    User: {b.userName || b.userId}
                  </Typography>

                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    {formatDate(b.startDate)} to {formatDate(b.endDate)}
                  </Typography>

                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    Rs.{b.totalPrice}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    label={b.status.toUpperCase()}
                    color={getStatusColor(b.status)}
                    size="small"
                  />
                  <FormControl size="small" sx={{ minWidth: 130 }}>
                    <Select
                      value={b.status}
                      onChange={(e) =>
                        onMoveStatus(
                          b.serviceId,
                          b.bookingId,
                          e.target.value as AdminBookingStatus,
                        )
                      }
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="confirmed">Confirmed</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Paper>
            ))}
          </Stack>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </>
      )}
    </Box>
  );
}
