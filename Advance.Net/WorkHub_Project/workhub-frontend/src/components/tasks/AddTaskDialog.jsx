import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  Divider,
  Autocomplete,
  CircularProgress
} from "@mui/material";
import { useEffect, useState } from "react";
import { createTask } from "../../services/taskService";
import { getAllUsers } from "../../services/userService";

function AddTaskDialog({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Pending",
    dueDate: "",
    createdBy: 1, // TODO: from JWT later
    assignedTo: null
  });

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [saving, setSaving] = useState(false);

  // 🔹 Load users for dropdown
  useEffect(() => {
    if (!open) return;

    const loadUsers = async () => {
      setLoadingUsers(true);
      try {
        const res = await getAllUsers();
        setUsers(res.data);
      } catch {
        alert("Failed to load users");
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, [open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await createTask({
        ...form,
        assignedTo: form.assignedTo
          ? form.assignedTo.userId
          : null
      });
      onCreated();
      onClose();
      setForm({
        title: "",
        description: "",
        priority: "Medium",
        status: "Pending",
        dueDate: "",
        createdBy: 1,
        assignedTo: null
      });
    } catch {
      alert("Failed to create task");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: "bold" }}>
        ➕ Create New Task
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          {/* Title */}
          <TextField
            label="Task Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            fullWidth
          />

          {/* Description */}
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
          />

          <Divider />

          {/* Priority & Status */}
          <Stack direction="row" spacing={2}>
            <TextField
              select
              label="Priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </TextField>

            <TextField
              select
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="InProgress">InProgress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </TextField>
          </Stack>

          {/* Due Date */}
          <TextField
            type="date"
            label="Due Date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          {/* Assigned To */}
          <Autocomplete
            options={users}
            getOptionLabel={(option) => option.fullName || ""}
            isOptionEqualToValue={(option, value) =>
                option.userId === value.userId
            }
            value={form.assignedTo}
            loading={loadingUsers}
            onChange={(event, newValue) => {
                setForm({ ...form, assignedTo: newValue });
            }}
            renderInput={(params) => (
                <TextField
                {...params}
                label="Assign To"
                placeholder="Select user"
                fullWidth
                InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                    <>
                        {loadingUsers && <CircularProgress size={20} />}
                        {params.InputProps.endAdornment}
                    </>
                    ),
                }}
                />
            )}
            />

        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? "Saving..." : "Create Task"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddTaskDialog;
