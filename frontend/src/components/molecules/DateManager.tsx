import { useState } from "react";
import { TextField, Button, Stack, Chip, Box, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

type DateManagerProps = {
  dates: string[];
  onUpdate: (dates: string[]) => void;
};

export function DateManager({ dates, onUpdate }: DateManagerProps) {
  const [dateInput, setDateInput] = useState("");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");

  const mergeDates = (incoming: string[]) => {
    const merged = Array.from(new Set([...dates, ...incoming])).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
    onUpdate(merged);
  };

  const buildDateRange = (start: string, end: string): string[] => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return [];
    }
    if (startDate > endDate) return [];

    const result: string[] = [];
    const cursor = new Date(startDate);

    while (cursor <= endDate) {
      result.push(cursor.toISOString().slice(0, 10));
      cursor.setDate(cursor.getDate() + 1);
    }

    return result;
  };

  const handleAddDate = () => {
    if (!dateInput) return;
    mergeDates([dateInput]);
    setDateInput("");
  };

  const handleAddRange = () => {
    if (!rangeStart || !rangeEnd) return;
    const rangeDates = buildDateRange(rangeStart, rangeEnd);
    if (rangeDates.length === 0) return;
    mergeDates(rangeDates);
    setRangeStart("");
    setRangeEnd("");
  };

  const handleAddNext7Days = () => {
    const today = new Date();
    const next7Days: string[] = [];
    for (let i = 0; i < 7; i += 1) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      next7Days.push(date.toISOString().slice(0, 10));
    }
    mergeDates(next7Days);
  };

  const handleRemoveDate = (dateToRemove: string) => {
    onUpdate(dates.filter((d) => d !== dateToRemove));
  };

  const handleClearAll = () => {
    onUpdate([]);
  };

  return (
    <Box sx={{ p: 2, border: "1px dashed #ccc", borderRadius: 1 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Manage Available Dates
      </Typography>

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <TextField
          type="date"
          label="Add Single Date"
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

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mb: 2 }}>
        <TextField
          type="date"
          label="Range Start"
          InputLabelProps={{ shrink: true }}
          value={rangeStart}
          onChange={(e) => setRangeStart(e.target.value)}
          size="small"
          fullWidth
        />
        <TextField
          type="date"
          label="Range End"
          InputLabelProps={{ shrink: true }}
          value={rangeEnd}
          onChange={(e) => setRangeEnd(e.target.value)}
          size="small"
          fullWidth
        />
        <Button variant="outlined" onClick={handleAddRange}>
          Add Range
        </Button>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Button variant="text" size="small" onClick={handleAddNext7Days}>
          Add Next 7 Days
        </Button>
        <Button variant="text" size="small" color="error" onClick={handleClearAll}>
          Clear All
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
