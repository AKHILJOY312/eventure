import React from "react";
import {
  Paper,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { COLORS, MONO_FONT } from "@/styles/theme";
import type { Task } from "@/types";
import { motion } from "framer-motion";

const MotionPaper = motion(Paper);

const statusColorMap = {
  todo: "#9E9E9E",
  "in-progress": "#FF9B51",
  done: "#4CAF50",
};
type TaskCardProps = {
  task: Task;
  onDelete: (taskId: string) => void;
  onMoveNext: (taskId: string, status: Task["status"]) => void;
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, onMoveNext }) => {
  const formattedDate = new Date(task.createdAt).toLocaleDateString();

  const handleDelete = () => {
    onDelete(task.id);
  };

  const handleMoveNext = () => {
    onMoveNext(task.id, task.status);
  };

  return (
    <MotionPaper
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.25 }}
      elevation={0}
      sx={{
        width: "100%",
        p: 2,
        bgcolor: COLORS.cardSurface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        position: "relative",
        transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          borderColor: COLORS.primaryUI,
          transform: "translateY(-2px)",
        },
        "&:hover .task-actions": {
          opacity: 1,
        },
      }}
    >
      {/* ACTION ICONS */}
      <Box
        className="task-actions"
        sx={{
          position: "absolute",
          top: 6,
          right: 6,
          display: "flex",
          gap: 0.5,
          opacity: 0,
          transition: "opacity 0.2s ease",
        }}
      >
        {task.status !== "done" && (
          <Tooltip title="Move to next phase">
            <IconButton
              size="small"
              onClick={handleMoveNext}
              sx={{
                color: COLORS.primaryUI,
                "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
              }}
            >
              <ArrowForwardIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Delete task">
          <IconButton
            size="small"
            onClick={handleDelete}
            sx={{
              color: "#FF6B6B",
              "&:hover": { bgcolor: "rgba(255,0,0,0.05)" },
            }}
          >
            <DeleteOutlineIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* TITLE */}
      <Typography
        variant="subtitle2"
        sx={{
          fontFamily: MONO_FONT,
          fontWeight: 700,
          lineHeight: 1.3,
          pr: 5,
        }}
      >
        {task.title.toUpperCase()}
      </Typography>

      {/* DESCRIPTION */}
      {task.description && (
        <Typography
          variant="body2"
          sx={{
            fontFamily: MONO_FONT,
            opacity: 0.7,
            lineHeight: 1.4,
          }}
        >
          {task.description}
        </Typography>
      )}

      {/* FOOTER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 1,
        }}
      >
        <Chip
          label={task.status.toUpperCase()}
          size="small"
          sx={{
            fontSize: "0.65rem",
            fontFamily: MONO_FONT,
            bgcolor: statusColorMap[task.status],
            color: "#fff",
            height: 20,
          }}
        />

        <Typography
          variant="caption"
          sx={{
            fontFamily: MONO_FONT,
            opacity: 0.6,
          }}
        >
          {formattedDate}
        </Typography>
      </Box>
    </MotionPaper>
  );
};

export default TaskCard;
