import React from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useAuth } from "@/hooks/useAuth";
import { COLORS, MONO_FONT } from "@/styles/theme";
import { createZodFormikValidator } from "@/utils/zodFormik";
import { loginFormSchema } from "@/utils/zodSchemas";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: createZodFormikValidator(loginFormSchema),
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values) => {
      await login(values.email.trim(), values.password);
    },
  });

  const fieldError = (field: "email" | "password") =>
    formik.touched[field] && formik.errors[field] ? formik.errors[field] : "";

  const hasFieldError = (field: "email" | "password") =>
    Boolean(fieldError(field));

  const inputStyles = {
    bgcolor: "rgba(255,255,255,0.05)",
    color: "white",
    fontFamily: MONO_FONT,
  };

  return (
    <Box
      sx={{
        height: "85vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          width: "100%",
          maxWidth: 420,
          bgcolor: COLORS.primaryUI,
          color: "white",
          borderRadius: 4,
          border: `1px solid ${COLORS.accent}`,
          boxShadow: `0 0 20px ${COLORS.accent}22`,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontFamily: MONO_FONT,
            fontWeight: 900,
            mb: 1,
            textAlign: "center",
            letterSpacing: 2,
          }}
        >
          AUTH_GATEWAY
        </Typography>

        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            mb: 3,
            opacity: 0.6,
            fontFamily: MONO_FONT,
          }}
        >
          SECURE_ENCRYPTED_ACCESS_ONLY
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              bgcolor: "rgba(211, 47, 47, 0.1)",
              color: "#f44336",
              border: "1px solid #f44336",
              fontFamily: MONO_FONT,
              fontSize: "0.7rem",
            }}
          >
            {error.toUpperCase()}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            required
            name="email"
            label="USER_IDENTIFIER (EMAIL)"
            variant="filled"
            margin="normal"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={hasFieldError("email")}
            helperText={fieldError("email") || " "}
            InputProps={{ sx: inputStyles }}
            InputLabelProps={{
              sx: { color: "rgba(255,255,255,0.5)", fontFamily: MONO_FONT },
            }}
            FormHelperTextProps={{
              sx: {
                color: "#ff9e9e",
                fontFamily: MONO_FONT,
                fontSize: "0.65rem",
              },
            }}
          />

          <TextField
            fullWidth
            required
            type="password"
            name="password"
            label="ACCESS_PHRASE"
            variant="filled"
            margin="normal"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={hasFieldError("password")}
            helperText={fieldError("password") || " "}
            InputProps={{ sx: inputStyles }}
            InputLabelProps={{
              sx: { color: "rgba(255,255,255,0.5)", fontFamily: MONO_FONT },
            }}
            FormHelperTextProps={{
              sx: {
                color: "#ff9e9e",
                fontFamily: MONO_FONT,
                fontSize: "0.65rem",
              },
            }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              mt: 2,
              py: 1.5,
              bgcolor: COLORS.accent,
              color: COLORS.primaryUI,
              fontWeight: 900,
              fontFamily: MONO_FONT,
              "&:hover": { bgcolor: "#e88a46" },
              "&.Mui-disabled": {
                bgcolor: "rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.3)",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "EXECUTE_LOGIN"
            )}
          </Button>
        </form>

        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            pt: 2,
          }}
        >
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate("/register")}
            sx={{
              color: COLORS.accent,
              fontFamily: MONO_FONT,
              fontSize: "0.7rem",
              textDecoration: "none",
            }}
          >
            CREATE_NEW_ID
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
