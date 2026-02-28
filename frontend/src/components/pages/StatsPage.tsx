import { Grid, Paper, Typography, Box, CircularProgress } from "@mui/material";
import { COLORS, MONO_FONT } from "@/styles/theme";
import { useTasks } from "@/hooks/useTasks";

const StatsPage = () => {
  const { tasks = [] } = useTasks();

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "done").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const pending = tasks.filter((t) => t.status === "todo").length;

  const completionRate =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  const isEmpty = total === 0;

  const distribution = [
    {
      label: "TODO",
      value: pending,
      color: "#9E9E9E",
    },
    {
      label: "IN_PROGRESS",
      value: inProgress,
      color: "#FF9B51",
    },
    {
      label: "DONE",
      value: completed,
      color: "#4CAF50",
    },
  ];

  return (
    <Box sx={{ mt: 2 }}>
      <Typography
        variant="h4"
        sx={{
          fontFamily: MONO_FONT,
          fontWeight: 900,
          mb: 4,
          color: COLORS.primaryUI,
        }}
      >
        SYSTEM_DIAGNOSTICS
      </Typography>

      {isEmpty ? (
        <Box
          sx={{
            p: 6,
            textAlign: "center",
            border: `1px dashed ${COLORS.border}`,
            borderRadius: 4,
            bgcolor: "rgba(0,0,0,0.02)",
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            System idle
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Create your first task to activate diagnostics.
          </Typography>
        </Box>
      ) : (
        <>
          {/* ===== TOP SECTION ===== */}
          <Grid container spacing={4} alignItems="center">
            {/* Completion Ring */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: "center",
                  bgcolor: COLORS.primaryUI,
                  borderRadius: 4,
                  border: `2px solid ${COLORS.accent}`,
                }}
              >
                <Box position="relative" display="inline-flex">
                  <CircularProgress
                    variant="determinate"
                    value={completionRate}
                    size={140}
                    thickness={5}
                    sx={{ color: COLORS.accent }}
                  />
                  <Box
                    top={0}
                    left={0}
                    bottom={0}
                    right={0}
                    position="absolute"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        fontFamily: MONO_FONT,
                        fontWeight: 900,
                        color: COLORS.accent,
                      }}
                    >
                      {completionRate}%
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  variant="button"
                  sx={{
                    display: "block",
                    mt: 2,
                    color: "white",
                    opacity: 0.7,
                    letterSpacing: 2,
                  }}
                >
                  COMPLETION_RATE
                </Typography>
              </Paper>
            </Grid>

            {/* Total Tasks */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  bgcolor: COLORS.primaryUI,
                  borderRadius: 4,
                  border: `2px solid ${COLORS.accent}`,
                }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontFamily: MONO_FONT,
                    fontWeight: 900,
                    color: COLORS.accent,
                  }}
                >
                  {total}
                </Typography>

                <Typography
                  variant="button"
                  sx={{ color: "white", opacity: 0.7, letterSpacing: 2 }}
                >
                  TOTAL_TASKS
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* ===== SECOND ROW ===== */}
          <Grid container spacing={4} sx={{ mt: 1 }}>
            {[
              { label: "COMPLETED", value: completed, color: "#4CAF50" },
              { label: "IN_PROGRESS", value: inProgress, color: "#FF9B51" },
              { label: "PENDING", value: pending, color: "#2196F3" },
            ].map((s) => (
              <Grid size={{ xs: 12, md: 4 }} key={s.label}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    textAlign: "center",
                    bgcolor: COLORS.primaryUI,
                    borderRadius: 4,
                    border: `2px solid ${s.color}`,
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontFamily: MONO_FONT,
                      fontWeight: 900,
                      color: s.color,
                    }}
                  >
                    {s.value}
                  </Typography>

                  <Typography
                    variant="button"
                    sx={{ color: "white", opacity: 0.7, letterSpacing: 2 }}
                  >
                    {s.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* ===== DISTRIBUTION BARS ===== */}
          <Paper
            elevation={0}
            sx={{
              mt: 4,
              p: 4,
              bgcolor: COLORS.primaryUI,
              borderRadius: 4,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <Typography
              variant="button"
              sx={{
                color: "white",
                opacity: 0.7,
                letterSpacing: 2,
                display: "block",
                mb: 3,
              }}
            >
              STATUS_DISTRIBUTION
            </Typography>

            {distribution.map((d) => {
              const percent = total === 0 ? 0 : (d.value / total) * 100;

              return (
                <Box key={d.label} sx={{ mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography
                      variant="caption"
                      sx={{ fontFamily: MONO_FONT, color: "white" }}
                    >
                      {d.label}
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{ fontFamily: MONO_FONT, color: "white" }}
                    >
                      {d.value}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: "rgba(255,255,255,0.1)",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        width: `${percent}%`,
                        height: "100%",
                        bgcolor: d.color,
                      }}
                    />
                  </Box>
                </Box>
              );
            })}
          </Paper>
        </>
      )}
    </Box>
  );
};

export default StatsPage;
