import {
  Box,
  Typography,
  Paper,
  Stack,
  CircularProgress,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useBookings } from "@/hooks/useBookings";
import { COLORS } from "@/styles/theme";
import { Pagination } from "@/components/atoms/Pagination";
import { useState } from "react";
import dayjs from "dayjs";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

function BookingsPage() {
  const [page, setPage] = useState(1);
  const [confirmBookingId, setConfirmBookingId] = useState<string | null>(null);
  const { bookings, loading, error, totalPages, cancelBooking, cancellingId } =
    useBookings({
      page,
      limit: 6,
    });
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
  const isPastBooking = (startDate: string) =>
    dayjs(startDate).isBefore(dayjs(), "day");
  const isCancellable = (status: string, startDate: string) =>
    status !== "cancelled" && !isPastBooking(startDate);

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
        <>
          <Stack spacing={2}>
            {bookings.map((b) => {
              const cancellable = isCancellable(b.status, b.startDate);
              const isCancelling = cancellingId === b.id;
              const isPast = isPastBooking(b.startDate);
              return (
                <Paper
                  key={b.id}
                  elevation={0}
                  sx={{
                    p: 2,
                    border: `1px solid ${isPast ? "rgba(148,163,184,0.4)" : COLORS.border}`,
                    borderRadius: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    bgcolor: isPast ? "rgba(148,163,184,0.06)" : "transparent",
                    "&:hover": {
                      boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                    },
                    "&:hover .cancel-action": {
                      opacity: 1,
                      pointerEvents: "auto",
                    },
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {b.service?.title ?? "Service"}
                    </Typography>

                    <Typography variant="body2" sx={{ opacity: 0.7 }}>
                      {b.startDate} to {b.endDate}
                    </Typography>

                    <Typography variant="body2" sx={{ opacity: 0.7 }}>
                      {b.service?.category ?? "Category unavailable"} |{" "}
                      {b.service?.location ?? "Location unavailable"}
                    </Typography>

                    <Typography variant="body2" sx={{ opacity: 0.7 }}>
                      Total: Rs.{b.totalPrice}
                    </Typography>

                    {b.service?.pricePerDay !== undefined && (
                      <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        Price per day: Rs.{b.service.pricePerDay}
                      </Typography>
                    )}
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: 1,
                    }}
                  >
                    <Chip
                      label={b.status.toUpperCase()}
                      color={getStatusColor(b.status)}
                      size="small"
                    />
                    <Chip
                      label={isPast ? "PAST" : "UPCOMING"}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: isPast
                          ? "rgba(100,116,139,0.4)"
                          : "rgba(34,197,94,0.35)",
                        color: isPast ? "rgba(100,116,139,0.8)" : "#16a34a",
                      }}
                    />
                    {cancellable && (
                      <Tooltip title="Cancel booking" placement="left">
                        <IconButton
                          className="cancel-action"
                          aria-label="Cancel booking"
                          size="small"
                          color="error"
                          onClick={() => setConfirmBookingId(b.id)}
                          disabled={isCancelling}
                          sx={{
                            opacity: 0,
                            pointerEvents: "none",
                            transition: "opacity 120ms ease",
                            border: "1px solid rgba(239,68,68,0.25)",
                            bgcolor: "rgba(239,68,68,0.04)",
                          }}
                        >
                          <CancelOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Paper>
              );
            })}
          </Stack>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
      <Dialog
        open={Boolean(confirmBookingId)}
        onClose={() => setConfirmBookingId(null)}
        aria-labelledby="cancel-booking-dialog-title"
      >
        <DialogTitle id="cancel-booking-dialog-title">
          Cancel booking?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            This action cannot be undone. Do you want to cancel this booking?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmBookingId(null)}
            disabled={Boolean(cancellingId)}
          >
            Keep
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={!confirmBookingId || Boolean(cancellingId)}
            onClick={async () => {
              if (!confirmBookingId) return;
              await cancelBooking(confirmBookingId);
              setConfirmBookingId(null);
            }}
          >
            {cancellingId ? "Cancelling..." : "Cancel booking"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default BookingsPage;
