import { Paper, Grid, TextField, MenuItem, Button } from "@mui/material";
import { COLORS } from "@/styles/theme";
import type { ServiceCategory } from "@/types/admin.types";

const CATEGORIES: ServiceCategory[] = [
  "Venue",
  "Hotel",
  "Caterer",
  "Cameraman",
  "DJ",
];

interface Props {
  filters: any;
  setFilter: (key: string, value: any) => void;
  onApply: () => void;
  onReset: () => void;
}

export function DiscoverFilters({
  filters,
  setFilter,
  onApply,
  onReset,
}: Props) {
  return (
    <Paper sx={{ p: 2, mb: 4, borderRadius: 2, bgcolor: "#f9f9f9" }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            label="Search"
            placeholder="Name..."
            value={filters.keyword}
            onChange={(e) => setFilter("keyword", e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 6, md: 2 }}>
          <TextField
            select
            label="Category"
            value={filters.category}
            onChange={(e) => setFilter("category", e.target.value)}
            fullWidth
          >
            <MenuItem value="">All</MenuItem>
            {CATEGORIES.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 6, md: 2 }}>
          <TextField
            label="Location"
            value={filters.location}
            onChange={(e) => setFilter("location", e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 6, md: 2.5 }}>
          <TextField
            label="Available on Date"
            type="date"
            value={filters.date}
            onChange={(e) => setFilter("date", e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
        <Grid
          size={{ xs: 12, md: 2.5 }}
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <Button variant="outlined" onClick={onReset} fullWidth>
            Reset
          </Button>
          <Button
            variant="contained"
            sx={{ bgcolor: COLORS.accent }}
            onClick={onApply}
            fullWidth
          >
            Apply
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
