import React from "react";
import { Box, Container, Typography, Tabs, Tab, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

import { COLORS, MONO_FONT } from "@/styles/theme";
import { useAuth } from "@/hooks/useAuth";

const TopNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, logout } = useAuth();

  const currentTab = location.pathname === "/stats" ? "stats" : "board";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Box sx={{ bgcolor: COLORS.primaryUI, color: "white" }}>
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
          onClick={() => navigate("/")}
          sx={{ cursor: "pointer", fontFamily: MONO_FONT }}
        >
          Pixel_Task
        </Typography>

        <Tabs
          value={currentTab}
          onChange={(_, newValue) =>
            navigate(newValue === "stats" ? "/stats" : "/")
          }
          textColor="inherit"
        >
          <Tab value="board" label="BOARD" />
          <Tab value="stats" label="STATS" />
        </Tabs>

        <Box>
          {!isAuthenticated ? (
            <Button onClick={() => navigate("/login")} color="inherit">
              LOGIN
            </Button>
          ) : (
            <Button onClick={handleLogout} color="inherit">
              LOGOUT
            </Button>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default TopNav;
