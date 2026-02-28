import { Box, Container, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import { COLORS } from "@/styles/theme";

const AuthLayout = () => (
  <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      bgcolor: COLORS.mainBg,
      background: `radial-gradient(circle, ${COLORS.mainBg} 0%, #D1D8D8 100%)`,
    }}
  >
    <CssBaseline />
    <Container maxWidth="sm">
      <Outlet />
    </Container>
  </Box>
);

export default AuthLayout;
