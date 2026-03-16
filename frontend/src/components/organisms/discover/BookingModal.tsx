import dayjs from "dayjs";
import type { Service } from "@/types/discover.types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  DialogActions,
  Button,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import { COLORS, MONO_FONT } from "@/styles/theme";

interface Props {
  service: Service | null;
  open: boolean;
  onClose: () => void;
  bookingDates: string[];
  setBookingDates: (dates: string[]) => void;
  onConfirm: () => void;
  loading: boolean;
}

export function BookingModal({
  service,
  open,
  onClose,
  bookingDates,
  setBookingDates,
  onConfirm,
  loading,
}: Props) {
  if (!service) return null;

  const today = dayjs().format("YYYY-MM-DD");

  const availableFutureDates = service.availableDates
    .filter((d) => d >= today)
    .sort();

  const selectedCount = bookingDates.length;
  const totalPrice = selectedCount * service.pricePerDay;
  const isInvalid = selectedCount === 0;

  const toggleDate = (date: string) => {
    if (bookingDates.includes(date)) {
      setBookingDates(bookingDates.filter((d) => d !== date));
      return;
    }
    setBookingDates([...bookingDates, date]);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: COLORS.cardSurface,
          borderRadius: 3,
          border: `1px solid ${COLORS.border}`,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          color: COLORS.primaryUI,
          fontFamily: MONO_FONT,
        }}
      >
        {service.title}
      </DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* Description */}
        <Typography
          variant="body2"
          sx={{ color: COLORS.primaryUI, opacity: 0.8 }}
        >
          {service.description}
        </Typography>

        {/* Metadata */}
        <Box>
          <Typography sx={{ color: COLORS.primaryUI }}>
            Location: {service.location}
          </Typography>

          <Typography sx={{ color: COLORS.primaryUI }}>
            Rating: {service.rating ?? "No ratings yet"}
          </Typography>

          <Typography sx={{ color: COLORS.primaryUI }}>
            Contact: {service.contactDetails}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: COLORS.border }} />

        {/* Date Selection */}
        <Typography
          variant="subtitle2"
          sx={{
            color: COLORS.primaryUI,
            fontWeight: 600,
          }}
        >
          Select Available Dates
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          {availableFutureDates.length === 0 && (
            <Typography sx={{ color: COLORS.adminAccent }}>
              No upcoming availability.
            </Typography>
          )}

          {availableFutureDates.map((date) => {
            const isSelected = bookingDates.includes(date);

            return (
              <Chip
                key={date}
                label={dayjs(date).format("DD MMM")}
                onClick={() => toggleDate(date)}
                sx={{
                  fontFamily: MONO_FONT,
                  backgroundColor: isSelected ? COLORS.accent : COLORS.mainBg,
                  color: isSelected ? "#fff" : COLORS.primaryUI,
                  border: `1px solid ${COLORS.border}`,
                  "&:hover": {
                    backgroundColor: COLORS.accent,
                    color: "#fff",
                  },
                }}
              />
            );
          })}
        </Stack>

        {selectedCount > 0 && (
          <>
            <Divider sx={{ borderColor: COLORS.border }} />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  color: COLORS.primaryUI,
                  fontWeight: 600,
                }}
              >
                Selected Dates
              </Typography>

              <Button
                size="small"
                onClick={() => setBookingDates([])}
                sx={{
                  color: COLORS.primaryUI,
                  border: `1px solid ${COLORS.border}`,
                  textTransform: "none",
                }}
              >
                Clear Selection
              </Button>
            </Box>

            <Stack direction="row" spacing={1} flexWrap="wrap">
              {bookingDates
                .slice()
                .sort()
                .map((date) => (
                  <Chip
                    key={`selected-${date}`}
                    label={dayjs(date).format("DD MMM")}
                    onDelete={() =>
                      setBookingDates(bookingDates.filter((d) => d !== date))
                    }
                    sx={{
                      fontFamily: MONO_FONT,
                      backgroundColor: COLORS.mainBg,
                      color: COLORS.primaryUI,
                      border: `1px solid ${COLORS.border}`,
                    }}
                  />
                ))}
            </Stack>
          </>
        )}

        <Divider sx={{ borderColor: COLORS.border }} />

        {/* Price Box */}
        <Box
          sx={{
            backgroundColor: COLORS.mainBg,
            p: 2,
            borderRadius: 2,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <Typography variant="subtitle2" sx={{ color: COLORS.primaryUI }}>
            Total Price
            {selectedCount > 0
              ? ` (${selectedCount} day${selectedCount > 1 ? "s" : ""})`
              : ""}
          </Typography>

          <Typography
            variant="h5"
            sx={{
              color: COLORS.accent,
              fontWeight: 700,
              fontFamily: MONO_FONT,
            }}
          >
            ₹{totalPrice.toLocaleString()}
          </Typography>

          <Typography
            variant="caption"
            sx={{ color: COLORS.primaryUI, opacity: 0.7 }}
          >
            Price per day: ₹{service.pricePerDay.toLocaleString()}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            color: COLORS.primaryUI,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={loading || isInvalid}
          sx={{
            backgroundColor: COLORS.accent,
            color: "#fff",
            fontWeight: 600,
            "&:hover": {
              backgroundColor: "#e8873f",
            },
          }}
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
