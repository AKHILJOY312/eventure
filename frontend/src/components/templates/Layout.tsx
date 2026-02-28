import { useState } from "react";
import {
  Box,
  CssBaseline,
  Container,
  Paper,
  InputBase,
  Button,
} from "@mui/material";
import { Search, Add } from "@mui/icons-material";
import { Outlet, useLocation } from "react-router-dom";
import { COLORS, MONO_FONT } from "@/styles/theme";
import TopNav from "./TopNav";
import { useUi } from "@/hooks/useUi";
import CreateTaskModal from "../molecules/CreateTaskModal";

const Layout = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { openCreateTask } = useUi();
  const showSearch =
    location.pathname === "/" || location.pathname === "/stats";

  const handleAddTask = () => {
    openCreateTask();
    console.log("Add task clicked");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        bgcolor: COLORS.mainBg,
        overflow: "hidden",
      }}
    >
      <CssBaseline />
      <TopNav />

      {showSearch && (
        <Box
          sx={{
            width: "100%",
            bgcolor: "white",
            borderBottom: `1px solid ${COLORS.border}`,
            py: 1.5,
          }}
        >
          <Container maxWidth={false} sx={{ px: 4, display: "flex", gap: 2 }}>
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                px: 2,
                bgcolor: COLORS.mainBg,
              }}
            >
              <Search sx={{ color: COLORS.primaryUI, opacity: 0.5 }} />
              <InputBase
                placeholder="SEARCH_DB..."
                fullWidth
                sx={{ ml: 1, fontFamily: MONO_FONT }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Paper>

            <Button
              variant="contained"
              onClick={handleAddTask}
              startIcon={<Add />}
              sx={{ bgcolor: COLORS.primaryUI, fontFamily: MONO_FONT }}
            >
              NEW_TASK
            </Button>
          </Container>
        </Box>
      )}

      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 4 }}>
        <Container maxWidth={false}>
          <Outlet />
        </Container>
      </Box>
      <CreateTaskModal />
    </Box>
  );
};

export default Layout;
