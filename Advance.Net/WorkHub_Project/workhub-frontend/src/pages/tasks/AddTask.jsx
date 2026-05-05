import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  Stack,
  Autocomplete,
  CircularProgress
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { createTask } from "../../services/taskService";
import { getAllUsers } from "../../services/userService";

function AddTask() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Pending",
    dueDate: "",
    createdBy: 1, // later from JWT
    assignedTo: null
  });

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [saving, setSaving] = useState(false);

  // 🔹 Load users
  useEffect(() => {
    setLoadingUsers(true);
    getAllUsers()
      .then(res => {
        const arr = res?.data || res?.users || [];
        setUsers(Array.isArray(arr) ? arr : []);
      })
      .catch(() => alert("Failed to load users"))
      .finally(() => setLoadingUsers(false));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await createTask({
        ...form,
        assignedTo: form.assignedTo
          ? form.assignedTo.userId
          : null
      });
      navigate("/tasks");
    } catch {
      alert("Failed to create task");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #e3f2fd, #fce4ec)"
      }}
    >
      <Card sx={{ width: 520, boxShadow: 6, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Add New Task
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            mb={3}
          >
            Fill the details below to create a task
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Title */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Task Title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  multiline
                  rows={3}
                />
              </Grid>

              {/* Priority */}
              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  label="Priority"
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                >
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </TextField>
              </Grid>

              {/* Status */}
              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  label="Status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="InProgress">InProgress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </TextField>
              </Grid>

              {/* Due Date */}
              <Grid item xs={12}>
                <TextField
                  type="date"
                  fullWidth
                  label="Due Date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Assigned To */}
              <Grid item xs={12}>
                <Autocomplete
                  fullWidth
                  options={users}
                  getOptionLabel={(option) => option.fullName || ""}
                  isOptionEqualToValue={(opt, val) =>
                    opt.userId === val.userId
                  }
                  value={form.assignedTo}
                  loading={loadingUsers}
                  onChange={(e, value) =>
                    setForm({ ...form, assignedTo: value })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label="Assign To"
                      placeholder="Select user"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingUsers && <CircularProgress size={20} />}
                            {params.InputProps.endAdornment}
                          </>
                        )
                      }}
                      sx={{
                          "& .MuiInputBase-root": {
                            height: 56   // ⬅️ increase height here
                          }
                        }}
                    />
                  )}
                />
              </Grid>

            </Grid>

            {/* Buttons */}
            <Stack
              direction="row"
              justifyContent="space-between"
              mt={4}
            >
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/tasks")}
              >
                Back
              </Button>

              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                type="submit"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Task"}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default AddTask;
