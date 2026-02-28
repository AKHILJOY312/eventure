// src/presentation/components/modals/CreateTaskModal.tsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";

import { useUi } from "@/hooks/useUi";
import { useTasks } from "@/hooks/useTasks";
import type { TaskStatus } from "@/types";

import { COLORS, MONO_FONT } from "@/styles/theme";

export default function CreateTaskModal() {
  const { createTaskModalOpen, closeCreateTask } = useUi();
  const { addTask } = useTasks();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  /**
   * Reset form when modal closes
   */
  useEffect(() => {
    if (!createTaskModalOpen) {
      setTitle("");
      setDescription("");
      setStatus("todo");
      setError(null);
      setSubmitting(false);
    }
  }, [createTaskModalOpen]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      setSubmitting(true);

      await addTask({
        title: title.trim(),
        description: description.trim() || null,
        status,
      });

      closeCreateTask();
    } catch (err) {
      console.error(err);
      setError("Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={createTaskModalOpen}
      onClose={closeCreateTask}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: "white",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: MONO_FONT,
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        CREATE_NEW_TASK
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError(null);
            }}
            fullWidth
            autoFocus
            error={!!error}
            helperText={error}
            InputProps={{ sx: { fontFamily: MONO_FONT } }}
          />

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            fullWidth
            InputProps={{ sx: { fontFamily: MONO_FONT } }}
          />

          <TextField
            select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            fullWidth
            InputProps={{ sx: { fontFamily: MONO_FONT } }}
          >
            <MenuItem value="todo">Todo</MenuItem>
            <MenuItem value="inprogress">In Progress</MenuItem>
            <MenuItem value="done">Done</MenuItem>
          </TextField>

          {error && (
            <Typography color="error" fontSize={13}>
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          borderTop: `1px solid ${COLORS.border}`,
          px: 3,
          py: 2,
        }}
      >
        <Button
          onClick={closeCreateTask}
          disabled={submitting}
          sx={{ fontFamily: MONO_FONT }}
        >
          CANCEL
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting}
          sx={{
            bgcolor: COLORS.primaryUI,
            fontFamily: MONO_FONT,
            "&:hover": {
              bgcolor: COLORS.primaryUI,
              opacity: 0.9,
            },
          }}
        >
          {submitting ? "CREATING..." : "CREATE"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
