import { useMemo } from "react";
import { Grid, Box, Typography } from "@mui/material";
import { COLORS } from "@/styles/theme";
import TaskCard from "../organisms/task/TaskCard";
import { useTasks } from "@/hooks/useTasks";
import { AnimatePresence } from "framer-motion";

const BoardPage = () => {
  const { tasks = [], removeTask, changeStatus } = useTasks();
  const grouped = useMemo(() => {
    const map = {
      Planned: [] as typeof tasks,
      "In Progress": [] as typeof tasks,
      Completed: [] as typeof tasks,
    };

    for (const t of tasks) {
      if (t.status === "todo") map.Planned.push(t);
      else if (t.status === "in-progress") map["In Progress"].push(t);
      else if (t.status === "done") map.Completed.push(t);
    }

    return map;
  }, [tasks]);

  const isEmpty = tasks.length === 0;

  return (
    <Grid container spacing={3} alignItems="stretch">
      {Object.entries(grouped).map(([status, list]) => (
        <Grid size={{ xs: 12, md: 4 }} key={status}>
          <Box sx={{ mb: 1 }}>
            <Typography
              variant="overline"
              sx={{
                fontWeight: 800,
                color: COLORS.primaryUI,
                letterSpacing: 1,
              }}
            >
              {status} [{list.length}]
            </Typography>
          </Box>

          <Box
            sx={{
              minHeight: "65vh",
              p: 2,
              bgcolor: "rgba(0,0,0,0.03)",
              borderRadius: 3,
              border: `1px dashed ${COLORS.border}`,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: "stretch", //  important
            }}
          >
            {list.length === 0 ? (
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ opacity: 0.6, fontStyle: "italic" }}
                >
                  No tasks
                </Typography>
              </Box>
            ) : (
              <AnimatePresence>
                {list.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={removeTask}
                    onMoveNext={(id, currentStatus) => {
                      if (currentStatus === "todo")
                        changeStatus(id, "in-progress");
                      else if (currentStatus === "in-progress")
                        changeStatus(id, "done");
                    }}
                  />
                ))}
              </AnimatePresence>
            )}
          </Box>
        </Grid>
      ))}

      {isEmpty && (
        <Grid size={{ xs: 12 }}>
          <Box
            sx={{
              mt: 4,
              p: 4,
              textAlign: "center",
              border: `1px dashed ${COLORS.border}`,
              borderRadius: 3,
              bgcolor: "rgba(0,0,0,0.02)",
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              No tasks yet
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              Create your first task to start organizing your workflow.
            </Typography>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default BoardPage;
