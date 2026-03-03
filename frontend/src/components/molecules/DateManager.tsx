import { useState } from "react";
import { TextField, Button, Stack, Chip, Box, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

type DateManagerProps = {
  dates: string[];
  onUpdate: (dates: string[]) => void;
};

export function DateManager({ dates, onUpdate }: DateManagerProps) {
  const [dateInput, setDateInput] = useState("");

  const handleAddDate = () => {
    if (!dateInput || dates.includes(dateInput)) return;
    onUpdate([...dates, dateInput]);
    setDateInput("");
  };

  const handleRemoveDate = (dateToRemove: string) => {
    onUpdate(dates.filter((d) => d !== dateToRemove));
  };

  return (
    <Box sx={{ p: 2, border: "1px dashed #ccc", borderRadius: 1 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Manage Available Dates
      </Typography>

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <TextField
          type="date"
          label="Add Date"
          InputLabelProps={{ shrink: true }}
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
          size="small"
          fullWidth
        />
        <Button
          variant="outlined"
          onClick={handleAddDate}
          startIcon={<AddIcon />}
        >
          Add
        </Button>
      </Stack>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {dates.map((date) => (
          <Chip
            key={date}
            label={date}
            onDelete={() => handleRemoveDate(date)}
            color="primary"
            variant="outlined"
          />
        ))}
        {dates.length === 0 && (
          <Typography variant="caption" color="text.secondary">
            No dates added yet.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
