import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  TextField,
  Box,
  DialogActions,
  Button,
} from "@mui/material";

interface Props {
  service: any;
  open: boolean;
  onClose: () => void;
  bookingDate: string;
  setBookingDate: (date: string) => void;
  onConfirm: () => void;
  loading: boolean;
}

export function BookingModal({
  service,
  open,
  onClose,
  bookingDate,
  setBookingDate,
  onConfirm,
  loading,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ fontWeight: 700 }}>Book {service?.title}</DialogTitle>
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
          {service?.description}
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
            ₹{service?.pricePerDay}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onConfirm} disabled={loading}>
          {loading ? "Booking..." : "Confirm Booking"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
