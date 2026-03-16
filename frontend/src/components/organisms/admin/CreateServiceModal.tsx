import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { useFormik } from "formik";
import type { ServiceInput, ServiceCategory } from "@/types/service.types";
import { COLORS } from "@/styles/theme";
import { DateManager } from "../../molecules/DateManager";
import { createZodFormikValidator } from "@/utils/zodFormik";
import { createServiceFormSchema } from "@/utils/zodSchemas";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  submitLabel?: string;
  initialValues?: ServiceInput;
  onSubmit: (data: ServiceInput) => Promise<void>;
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

function CreateServiceModal({
  open,
  onClose,
  title = "Create New Service",
  submitLabel = "Create Service",
  initialValues,
  onSubmit,
}: Props) {
  const formik = useFormik<ServiceInput>({
    initialValues: initialValues ?? INITIAL_STATE,
    enableReinitialize: true,
    validate: createZodFormikValidator(createServiceFormSchema),
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, helpers) => {
      try {
        await onSubmit({
          ...values,
          title: values.title.trim(),
          location: values.location.trim(),
          description: values.description?.trim() || "",
          contactDetails: values.contactDetails.trim(),
          imageUrl: values.imageUrl?.trim() || "",
        });
        helpers.resetForm();
      } catch (error) {
        console.error("Form submission failed", error);
      }
    },
  });

  const hasFieldError = (field: keyof ServiceInput) =>
    Boolean(formik.touched[field] && formik.errors[field]);

  const fieldError = (field: keyof ServiceInput) =>
    formik.touched[field] && formik.errors[field]
      ? String(formik.errors[field])
      : "";

  const handleCancel = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Service Title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={hasFieldError("title")}
              helperText={fieldError("title") || " "}
              fullWidth
              required
            />

            <TextField
              select
              label="Category"
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={hasFieldError("category")}
              helperText={fieldError("category") || " "}
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
              label="Price Per Day (INR)"
              name="pricePerDay"
              value={formik.values.pricePerDay}
              onBlur={formik.handleBlur}
              onChange={(e) => {
                const parsed = Number(e.target.value);
                formik.setFieldValue("pricePerDay", Number.isNaN(parsed) ? 0 : parsed);
              }}
              error={hasFieldError("pricePerDay")}
              helperText={fieldError("pricePerDay") || " "}
              fullWidth
              required
            />

            <DateManager
              dates={formik.values.availableDates || []}
              onUpdate={(newDates) => {
                formik.setFieldTouched("availableDates", true, false);
                formik.setFieldValue("availableDates", newDates);
              }}
            />
            {fieldError("availableDates") && (
              <FormHelperText error>{fieldError("availableDates")}</FormHelperText>
            )}

            <TextField
              label="Location"
              name="location"
              value={formik.values.location}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={hasFieldError("location")}
              helperText={fieldError("location") || " "}
              fullWidth
              required
            />

            <TextField
              label="Contact Details"
              name="contactDetails"
              value={formik.values.contactDetails}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={hasFieldError("contactDetails")}
              helperText={fieldError("contactDetails") || " "}
              fullWidth
              required
            />

            <TextField
              label="Description"
              name="description"
              multiline
              rows={2}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={hasFieldError("description")}
              helperText={fieldError("description") || " "}
              fullWidth
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button
            variant="contained"
            type="submit"
            disabled={formik.isSubmitting}
            sx={{ bgcolor: COLORS.accent, "&:hover": { bgcolor: "#e88840" } }}
          >
            {submitLabel}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default CreateServiceModal;
