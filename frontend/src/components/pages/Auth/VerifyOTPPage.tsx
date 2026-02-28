import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { COLORS, MONO_FONT } from "@/styles/theme";
// Assuming you have a verify thunk in your authThunks
import { verifyEmailOTP } from "@/redux/thunk/authThunks";

const VerifyOTPPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get state from Redux auth slice
  const { loading, error, user } = useAppSelector((state) => state.auth);
  const [otp, setOtp] = useState("");
  const [localError, setLocalError] = useState("");

  // Safety Redirect: If no user is in state (accessed page directly), send to login
  useEffect(() => {
    if (!user && !loading) {
      // navigate("/login");
    }
  }, [user, loading, navigate]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length < 4) {
      return setLocalError("INCOMPLETE_CODE");
    }

    const result = await dispatch(
      verifyEmailOTP({
        email: user?.email || "",
        otp,
      }),
    );

    if (verifyEmailOTP.fulfilled.match(result)) {
      // Success! Move to Dashboard
      navigate("/");
    }
  };

  return (
    <Box
      sx={{
        height: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, md: 6 },
          width: "100%",
          maxWidth: 400,
          bgcolor: COLORS.primaryUI,
          color: "white",
          borderRadius: 2,
          border: `2px dashed ${COLORS.accent}`, // Dashed border indicates "Pending" status
          textAlign: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: MONO_FONT,
            fontWeight: 900,
            color: COLORS.accent,
            mb: 1,
          }}
        >
          SIGNAL_VERIFICATION
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mb: 4,
            opacity: 0.7,
            fontFamily: MONO_FONT,
            fontSize: "0.75rem",
          }}
        >
          ENTER_THE_TEMPORARY_ACCESS_CODE_SENT_TO:
          <Box
            component="span"
            sx={{ display: "block", color: "white", mt: 0.5 }}
          >
            {user?.email || "YOUR_REGISTERED_EMAIL"}
          </Box>
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
            {(localError || error || "").toUpperCase()}
          </Alert>
        )}

        <form onSubmit={handleVerify}>
          <TextField
            fullWidth
            autoFocus
            variant="standard"
            placeholder="000000"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/\D/g, "")); // Only numbers
              if (localError) setLocalError("");
            }}
            inputProps={{
              maxLength: 6,
              style: {
                textAlign: "center",
                fontSize: "2rem",
                letterSpacing: "12px",
                fontFamily: MONO_FONT,
                color: "white",
              },
            }}
            sx={{
              mb: 4,
              "& .MuiInput-underline:before": {
                borderBottomColor: "rgba(255,255,255,0.2)",
              },
              "& .MuiInput-underline:after": {
                borderBottomColor: COLORS.accent,
              },
            }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading || otp.length < 4}
            sx={{
              py: 1.5,
              bgcolor: "white",
              color: COLORS.primaryUI,
              fontWeight: 900,
              fontFamily: MONO_FONT,
              "&:hover": { bgcolor: COLORS.accent, color: "white" },
              "&.Mui-disabled": {
                bgcolor: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.2)",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "VALIDATE_IDENTITY"
            )}
          </Button>

          <Button
            fullWidth
            variant="text"
            sx={{
              mt: 2,
              color: "rgba(255,255,255,0.4)",
              fontSize: "0.65rem",
              fontFamily: MONO_FONT,
            }}
            onClick={() => {
              /* Resend Logic */
            }}
          >
            REQUEST_NEW_SIGNAL_IN_60S
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default VerifyOTPPage;
