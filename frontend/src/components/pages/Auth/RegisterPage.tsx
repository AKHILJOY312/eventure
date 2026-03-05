import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { COLORS, MONO_FONT } from "@/styles/theme";
// Assuming you have a register thunk in your authThunks
import { registerUser } from "@/redux/thunk/authThunks";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [localError, setLocalError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (localError) setLocalError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Pro-level validation
    if (formData.password !== formData.confirmPassword) {
      return setLocalError("PASSWORDS_DO_NOT_MATCH");
    }

    // Logic: Dispatch registration.
    // On success, the thunk should update state to trigger navigation to /verify-email
    const result = await dispatch(
      registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      }),
    );

    if (registerUser.fulfilled.match(result)) {
      navigate("/verify-email");
    }
  };

  const inputStyles = {
    bgcolor: "rgba(255,255,255,0.05)",
    color: "white",
    fontFamily: MONO_FONT,
    borderRadius: 1,
    "& .MuiFilledInput-underline:before": {
      borderBottomColor: "rgba(255,255,255,0.1)",
    },
  };
  const displayError = (localError || error || "").toString().toUpperCase();

  return (
    <Box
      sx={{
        height: "90vh",
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
          maxWidth: 500,
          bgcolor: COLORS.primaryUI,
          color: "white",
          borderRadius: 4,
          border: `1px solid ${COLORS.accent}`,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontFamily: MONO_FONT,
            fontWeight: 900,
            mb: 1,
            textAlign: "center",
          }}
        >
          INITIALIZE_NODE
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
          RESERVED_FOR_AUTHORIZED_PERSONNEL
        </Typography>

        {(error || localError) && (
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
            {displayError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                name="name"
                label="NAME"
                variant="filled"
                value={formData.name}
                onChange={handleChange}
                InputProps={{ sx: inputStyles }}
                InputLabelProps={{
                  sx: { color: "rgba(255,255,255,0.5)", fontFamily: MONO_FONT },
                }}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                required
                name="email"
                label="EMAIL_ADDRESS"
                variant="filled"
                value={formData.email}
                onChange={handleChange}
                InputProps={{ sx: inputStyles }}
                InputLabelProps={{
                  sx: { color: "rgba(255,255,255,0.5)", fontFamily: MONO_FONT },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                type="password"
                name="password"
                label="PASSWORD"
                variant="filled"
                value={formData.password}
                onChange={handleChange}
                InputProps={{ sx: inputStyles }}
                InputLabelProps={{
                  sx: { color: "rgba(255,255,255,0.5)", fontFamily: MONO_FONT },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                type="password"
                name="confirmPassword"
                label="CONFIRM_PASS"
                variant="filled"
                value={formData.confirmPassword}
                onChange={handleChange}
                InputProps={{ sx: inputStyles }}
                InputLabelProps={{
                  sx: { color: "rgba(255,255,255,0.5)", fontFamily: MONO_FONT },
                }}
              />
            </Grid>
          </Grid>

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              mt: 4,
              py: 1.5,
              bgcolor: COLORS.accent,
              color: COLORS.primaryUI,
              fontWeight: 900,
              fontFamily: MONO_FONT,
              "&:hover": { bgcolor: "#e88a46" },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "PROVISION_ACCOUNT"
            )}
          </Button>
        </form>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Link
            component="button"
            onClick={() => navigate("/login")}
            sx={{
              color: "rgba(255,255,255,0.4)",
              fontFamily: MONO_FONT,
              fontSize: "0.75rem",
              textDecoration: "none",
            }}
          >
            EXISTING_OPERATOR?_LOGIN
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
