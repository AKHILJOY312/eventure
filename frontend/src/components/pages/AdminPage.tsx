import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  CircularProgress,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import { COLORS } from "@/styles/theme";
import { useAdminServices } from "@/hooks/useAdminServices";
import { useDebounce } from "@/hooks/useDebounce";
import type { AdminService, ServiceInput } from "@/types/service.types";
import ServiceList from "../organisms/admin/ServiceList";
import { BookingsList } from "../organisms/admin/BookingsList";
import CreateServiceModal from "../organisms/admin/CreateServiceModal";

function AdminPage() {
  const {
    services,
    bookings,
    loading,
    error,
    totalPages,
    bookingsTotalPages,
    addService,
    editService,
    removeService,
    fetchServiceBookings,
    fetchAdminServices,
    moveBookingStatus,
  } = useAdminServices();

  const [page, setPage] = useState(1);
  const [bookingsPage, setBookingsPage] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null,
  );
  const [openModal, setOpenModal] = useState(false);
  const [editingService, setEditingService] = useState<AdminService | null>(
    null,
  );
  const [serviceSearch, setServiceSearch] = useState("");
  const debouncedServiceSearch = useDebounce(serviceSearch, 400);

  const normalizedSearch = debouncedServiceSearch.trim().toLowerCase();
  const filteredServices = services.filter((service) => {
    if (!normalizedSearch) return true;

    return [service.title, service.category, service.location, service.description]
      .filter(Boolean)
      .some((value) => value!.toLowerCase().includes(normalizedSearch));
  });

  useEffect(() => {
    fetchAdminServices(page, 6);
  }, [page]);

  useEffect(() => {
    if (!selectedServiceId) return;
    fetchServiceBookings(selectedServiceId, bookingsPage, 5);
  }, [selectedServiceId, bookingsPage]);

  const closeServiceModal = () => {
    setOpenModal(false);
    setEditingService(null);
  };

  const toFormValues = (service: AdminService): ServiceInput => ({
    title: service.title,
    category: service.category as ServiceInput["category"],
    pricePerDay: service.pricePerDay,
    description: service.description ?? "",
    location: service.location,
    contactDetails: service.contactDetails ?? "",
    imageUrl: service.imageUrl ?? "",
    availableDates:
      service.availableDates?.map((date) => new Date(date).toISOString().slice(0, 10)) ??
      [],
  });

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
          onClick={() => {
            setEditingService(null);
            setOpenModal(true);
          }}
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
          <TextField
            fullWidth
            size="small"
            value={serviceSearch}
            onChange={(event) => setServiceSearch(event.target.value)}
            placeholder="Search services by title, category, location..."
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <ServiceList
            services={filteredServices}
            page={page}
            totalPages={totalPages}
            emptyMessage={
              normalizedSearch
                ? "No services found for your search."
                : "No services created yet."
            }
            onPrev={() => setPage((p) => p - 1)}
            onNext={() => setPage((p) => p + 1)}
            onEdit={(service) => {
              setEditingService(service);
              setOpenModal(true);
            }}
            onDelete={async (id) => {
              await removeService(id);
              await fetchAdminServices(page, 6);
            }}
            onViewBookings={(id) => {
              setSelectedServiceId(id);
              setBookingsPage(1);
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <BookingsList
            bookings={bookings}
            page={bookingsPage}
            totalPages={bookingsTotalPages}
            onPageChange={setBookingsPage}
            onMoveStatus={moveBookingStatus}
          />
        </Grid>
      </Grid>

      <CreateServiceModal
        open={openModal}
        onClose={closeServiceModal}
        title={editingService ? "Edit Service" : "Create New Service"}
        submitLabel={editingService ? "Update Service" : "Create Service"}
        initialValues={editingService ? toFormValues(editingService) : undefined}
        onSubmit={async (data) => {
          if (editingService) {
            await editService(editingService.id, data);
          } else {
            await addService(data);
          }
          await fetchAdminServices(page, 6);
          closeServiceModal();
        }}
      />
    </Box>
  );
}

export default AdminPage;
