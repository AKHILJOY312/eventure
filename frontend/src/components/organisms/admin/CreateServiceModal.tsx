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
import { DateManager } from "../../molecules/DateManager";

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

const INITIAL_STATE: ServiceInput = {
  title: "",
  category: "Venue",
  pricePerDay: 0,
  location: "",
  description: "",
  contactDetails: "",
  imageUrl: "",
  availableDates: [],
};

function CreateServiceModal({ open, onClose, onCreate }: Props) {
  const [form, setForm] = useState<ServiceInput>(INITIAL_STATE);

  const handleSubmit = async () => {
    try {
      await onCreate(form);
      setForm(INITIAL_STATE);
    } catch (error) {
      console.error("Form submission failed", error);
    }
  };

  const updateField = (field: keyof ServiceInput, value: any) => {
    setForm((p) => ({ ...p, [field]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>Create New Service</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Service Title"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            fullWidth
            required
          />

          <TextField
            select
            label="Category"
            value={form.category}
            onChange={(e) => updateField("category", e.target.value)}
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
            onChange={(e) => updateField("pricePerDay", Number(e.target.value))}
            fullWidth
            required
          />

          {/* Extracted Component */}
          <DateManager
            dates={form.availableDates || []}
            onUpdate={(newDates) => updateField("availableDates", newDates)}
          />

          <TextField
            label="Location"
            value={form.location}
            onChange={(e) => updateField("location", e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Description"
            multiline
            rows={2}
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!form.title || !form.location || form.pricePerDay <= 0}
          sx={{ bgcolor: COLORS.accent, "&:hover": { bgcolor: "#e88840" } }}
        >
          Create Service
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateServiceModal;
