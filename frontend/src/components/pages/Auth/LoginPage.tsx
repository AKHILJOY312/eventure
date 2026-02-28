import React, { useState } from "react";
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
import { useAuth } from "@/hooks/useAuth";
import { COLORS, MONO_FONT } from "@/styles/theme";

// Removed setView from props to use useNavigate (The Pro Way)
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Dispatch the Redux login thunk
    await login(formData.email, formData.password);
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
          boxShadow: `0 0 20px ${COLORS.accent}22`, // Subtle glow
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

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            required
            name="email"
            label="USER_IDENTIFIER (EMAIL)"
            variant="filled"
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            InputProps={{
              sx: {
                bgcolor: "rgba(255,255,255,0.05)",
                color: "white",
                fontFamily: MONO_FONT,
              },
            }}
            InputLabelProps={{
              sx: { color: "rgba(255,255,255,0.5)", fontFamily: MONO_FONT },
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
            value={formData.password}
            onChange={handleChange}
            InputProps={{
              sx: {
                bgcolor: "rgba(255,255,255,0.05)",
                color: "white",
                fontFamily: MONO_FONT,
              },
            }}
            InputLabelProps={{
              sx: { color: "rgba(255,255,255,0.5)", fontFamily: MONO_FONT },
            }}
          />

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
