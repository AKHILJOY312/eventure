import React from "react";
import { Box, Container, Typography, Tabs, Tab, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

import { COLORS, MONO_FONT } from "@/styles/theme";
import { useAuth } from "@/hooks/useAuth";
import { PATHS } from "@/routes/routeConstant";
const TopNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";
  const navBg = isAdmin ? COLORS.adminPrimary : COLORS.primaryUI;
  const accent = isAdmin ? COLORS.adminAccent : COLORS.accent;

  const handleLogout = async () => {
    await logout();
    navigate(PATHS.AUTH.LOGIN);
  };

  return (
    <Box sx={{ bgcolor: navBg, color: "white" }}>
      <Container
        maxWidth={false}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
        }}
      >
        <Typography
          onClick={() => navigate(PATHS.HOME)}
          sx={{ cursor: "pointer", fontFamily: MONO_FONT }}
        >
          Event_ure
        </Typography>

        {isUser && (
          <Tabs
            value={location.pathname}
            onChange={(_, newValue) => navigate(newValue)}
            textColor="inherit"
            slotProps={{
              indicator: {
                sx: {
                  backgroundColor: accent,
                },
              },
            }}
          >
            <Tab value={PATHS.USER.DASHBOARD} label="BOOKINGS" />
            <Tab value={PATHS.USER.DISCOVER} label="DISCOVER" />
          </Tabs>
        )}

        <Box>
          <Button onClick={handleLogout} color="inherit">
            LOGOUT
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default TopNav;
