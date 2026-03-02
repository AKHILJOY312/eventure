import { Box, Typography, Paper, Button, Stack } from "@mui/material";
import { Delete, Event } from "@mui/icons-material";
import { COLORS } from "@/styles/theme";
import type { AdminService } from "@/types/admin.types";

type Props = {
  services: AdminService[];
  page: number;
  onPrev: () => void;
  onNext: () => void;
  onDelete: (id: string) => Promise<void>;
  onViewBookings: (id: string) => void;
};

export default function ServiceList({
  services,
  page,
  onPrev,
  onNext,
  onDelete,
  onViewBookings,
}: Props) {
  const isEmpty = services.length === 0;

  return (
    <Box>
      <Typography
        variant="overline"
        sx={{
          fontWeight: 800,
          color: COLORS.primaryUI,
          letterSpacing: 1,
          mb: 2,
          display: "block",
        }}
      >
        MY SERVICES [{services.length}]
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
            No services created yet.
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {services.map((s) => (
            <Paper
              key={s.id}
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
                <Typography variant="subtitle1" fontWeight={600}>
                  {s.title}
                </Typography>

                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  ₹{s.pricePerDay} • {s.location}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  startIcon={<Event />}
                  onClick={() => onViewBookings(s.id)}
                >
                  Bookings
                </Button>

                <Button
                  size="small"
                  startIcon={<Delete />}
                  sx={{
                    color: COLORS.adminAccent,
                  }}
                  onClick={() => onDelete(s.id)}
                >
                  Delete
                </Button>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}

      {/* Pagination */}
      {!isEmpty && (
        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Button disabled={page === 1} onClick={onPrev}>
            Prev
          </Button>

          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Page {page}
          </Typography>

          <Button onClick={onNext}>Next</Button>
        </Box>
      )}
    </Box>
  );
}
