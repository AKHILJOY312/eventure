import { Box, Container, CssBaseline } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import { COLORS } from "@/styles/theme";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "./PageTransition";

const AuthLayout = () => {
  const location = useLocation();

  return (
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
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </Container>
    </Box>
  );
};

export default AuthLayout;
