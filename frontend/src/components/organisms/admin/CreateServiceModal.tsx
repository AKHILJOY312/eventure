import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { useState } from "react";
import type { ServiceInput } from "@/types/admin.types";
import { COLORS } from "@/styles/theme";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (data: ServiceInput) => Promise<void>;
};

function CreateServiceModal({ open, onClose, onCreate }: Props) {
  const [form, setForm] = useState<ServiceInput>({
    title: "",
    category: "Venue",
    pricePerDay: 0,
    location: "",
  });

  const handleSubmit = async () => {
    await onCreate(form);
    setForm({
      title: "",
      category: "Venue",
      pricePerDay: 0,
      location: "",
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create New Service</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Title"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            fullWidth
          />

          <TextField
            label="Category"
            value={form.category}
            onChange={(e) =>
              setForm((p) => ({ ...p, category: e.target.value }))
            }
            fullWidth
          />

          <TextField
            type="number"
            label="Price Per Day"
            value={form.pricePerDay}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                pricePerDay: Number(e.target.value),
              }))
            }
            fullWidth
          />

          <TextField
            label="Location"
            value={form.location}
            onChange={(e) =>
              setForm((p) => ({ ...p, location: e.target.value }))
            }
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            bgcolor: COLORS.adminPrimary,
            color: "#fff",
            "&:hover": {
              bgcolor: "#162029", // slightly darker shade
            },
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            bgcolor: COLORS.accent,
            color: "#fff",
            "&:hover": {
              bgcolor: "#e88840", // darker accent tone
            },
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateServiceModal;
