import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import type { ServiceInput, ServiceCategory } from "@/types/admin.types";
import { COLORS } from "@/styles/theme";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (data: ServiceInput) => Promise<void>;
};

const CATEGORIES: ServiceCategory[] = [
  "Venue",
  "Hotel",
  "Caterer",
  "Cameraman",
  "DJ",
];

function CreateServiceModal({ open, onClose, onCreate }: Props) {
  const initialState: ServiceInput = {
    title: "",
    category: "Venue",
    pricePerDay: 0,
    location: "",
    description: "",
    contactDetails: "",
    imageUrl: "",
  };

  const [form, setForm] = useState<ServiceInput>(initialState);

  const handleSubmit = async () => {
    try {
      await onCreate(form);
      setForm(initialState);
    } catch (error) {
      console.error("Form submission failed", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>Create New Service</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Service Title"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            fullWidth
            required
          />

          <TextField
            select
            label="Category"
            value={form.category}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                category: e.target.value as ServiceCategory,
              }))
            }
            fullWidth
          >
            {CATEGORIES.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            type="number"
            label="Price Per Day (₹)"
            value={form.pricePerDay}
            onChange={(e) =>
              setForm((p) => ({ ...p, pricePerDay: Number(e.target.value) }))
            }
            fullWidth
            required
          />

          <TextField
            label="Location"
            placeholder="City, Area"
            value={form.location}
            onChange={(e) =>
              setForm((p) => ({ ...p, location: e.target.value }))
            }
            fullWidth
            required
          />

          <TextField
            label="Contact Details"
            placeholder="Phone number or Email"
            value={form.contactDetails}
            onChange={(e) =>
              setForm((p) => ({ ...p, contactDetails: e.target.value }))
            }
            fullWidth
          />

          <TextField
            label="Image URL"
            placeholder="https://example.com/image.jpg"
            value={form.imageUrl}
            onChange={(e) =>
              setForm((p) => ({ ...p, imageUrl: e.target.value }))
            }
            fullWidth
          />

          <TextField
            label="Description"
            multiline
            rows={3}
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: "text.secondary" }}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!form.title || !form.location || form.pricePerDay <= 0}
          sx={{
            bgcolor: COLORS.accent,
            "&:hover": { bgcolor: "#e88840" },
          }}
        >
          Create Service
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateServiceModal;
