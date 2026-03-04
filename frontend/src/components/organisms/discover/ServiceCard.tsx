import { Paper, Box, Typography, Button } from "@mui/material";
import { COLORS } from "@/styles/theme";

interface ServiceCardProps {
  service: {
    id: string;
    title: string;
    category: string;
    location: string;
    pricePerDay: number;
  };
  onViewDetails: (id: string) => void;
}

export function ServiceCard({ service, onViewDetails }: ServiceCardProps) {
  return (
    <Paper
      sx={{
        p: 2,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 2,
        transition: "0.2s",
        "&:hover": { boxShadow: 3 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="subtitle1" fontWeight={600}>
            {service.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {service.category} • {service.location}
          </Typography>
          <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
            ₹{service.pricePerDay}{" "}
            <Typography
              component="span"
              variant="caption"
              color="text.secondary"
            >
              / day
            </Typography>
          </Typography>
        </Box>
        <Button variant="outlined" onClick={() => onViewDetails(service.id)}>
          View Details
        </Button>
      </Box>
    </Paper>
  );
}
