import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Button, CircularProgress } from "@mui/material";
import { Add } from "@mui/icons-material";
import { COLORS } from "@/styles/theme";
import { useAdminServices } from "@/hooks/useAdminServices";
import ServiceList from "../organisms/admin/ServiceList";
import { BookingsList } from "../organisms/admin/BookingsList";
import CreateServiceModal from "../organisms/admin/CreateServiceModal";

function AdminPage() {
  const {
    services,
    bookings,
    loading,
    error,
    addService,
    removeService,
    fetchServiceBookings,
    fetchAdminServices,
  } = useAdminServices();

  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchAdminServices(page, 6);
  }, [page]);

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 800, color: COLORS.primaryUI }}
        >
          Service Management
        </Typography>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenModal(true)}
          sx={{
            bgcolor: COLORS.accent,
            "&:hover": {
              bgcolor: COLORS.accent,
              opacity: 0.9,
            },
          }}
        >
          Create Service
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <ServiceList
            services={services}
            page={page}
            onPrev={() => setPage((p) => p - 1)}
            onNext={() => setPage((p) => p + 1)}
            onDelete={async (id) => {
              await removeService(id);
              await fetchAdminServices(page, 6);
            }}
            onViewBookings={fetchServiceBookings}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <BookingsList bookings={bookings} />
        </Grid>
      </Grid>

      <CreateServiceModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onCreate={async (data) => {
          await addService(data);
          await fetchAdminServices(page, 6);
          setOpenModal(false);
        }}
      />
    </Box>
  );
}

export default AdminPage;
