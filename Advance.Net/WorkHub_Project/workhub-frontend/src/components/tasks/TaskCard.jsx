import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Divider,
  Box,
  IconButton,
  CardActions,
  Tooltip,
  Popover,
  Autocomplete,
  TextField,
} from "@mui/material";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
// import Popover from "@mui/material/Popover";
// import Autocomplete from "@mui/material/Autocomplete";
// import TextField from "@mui/material/TextField";


const getPriorityColor = (priority) => {
  switch (priority) {
    case "High":
      return "error";
    case "Medium":
      return "warning";
    case "Low":
      return "success";
    default:
      return "default";
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "warning";
    case "InProgress":
      return "info";
    case "Completed":
      return "success";
    default:
      return "default";
  }
};


function TaskCard({ task, onDelete,labels=[], assignLabelToTask, removeLabelFromTask }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleOpenLabelPopup = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseLabelPopup = () => {
    setAnchorEl(null);
  };

  const labelColors = {
    Bug: "#FFEBEE",
    Backend: "#E3F2FD",
    Frontend: "#E8F5E9",
    Urgent: "#FFF3E0"
  }; 
  return (
    <Card
      sx={{
        width: "100%",
        height: "100%",             
        minHeight: 300, 
        borderRadius: 3,
        boxShadow: 3,
        transition: "all 0.35s ease",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          boxShadow: 10,
          transform: "translateY(-8px)"
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {/* TITLE */}
        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
          sx={{ minHeight: 56 }}
        >
          {task.title}
        </Typography>

        {/* STATUS & PRIORITY */}
        <Stack direction="row" spacing={1} mb={2}>
          <Chip
            label={task.status}
            color={getStatusColor(task.status)}
            size="small"
          />
          <Chip
            label={task.priority}
            color={getPriorityColor(task.priority)}
            size="small"
          />
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          sx={{ mt: 1, flexWrap: "wrap" }}
        >
          {task.labels?.map((label) => (
            <Chip
              key={label.labelId}
              label={label.labelName}
              size="small"
              onDelete={() =>
                removeLabelFromTask(task.taskId, label.labelId)
              }
              deleteIcon={<CloseIcon sx={{ fontSize: 16 }} />}
              sx={{
                fontSize: "0.7rem",
                height: 22,
                borderRadius: "6px",
                backgroundColor: labelColors[label.labelName] || "#EEEEEE",
                color: "#0D47A1",
                fontWeight: 500
              }}
            />
          ))}
        </Stack>


        <Divider sx={{ mb: 2 }} />

        {/* DESCRIPTION */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            minHeight: 40
          }}
        >
          {task.description ?? "No description provided"}
        </Typography>

        {/* ASSIGNED TO */}
        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
          <AssignmentIndIcon fontSize="small" />
          <Typography variant="body2">
            {task.assignedToName ?? "Unassigned"}
          </Typography>
        </Stack>

        {/* CREATED BY */}
        <Stack direction="row" spacing={1} alignItems="center">
          <PersonIcon fontSize="small" />
          <Typography variant="body2">
            {task.createdByName}
          </Typography>
        </Stack>

        {/* DATES */}
        <Box mt={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <CalendarMonthIcon fontSize="small" />
            <Typography variant="caption">
              Created:{" "}
              {task.createdAt
                ? new Date(task.createdAt).toLocaleDateString()
                : "-"}
            </Typography>
          </Stack>

          <Typography variant="caption" color="text.secondary">
            Updated:{" "}
            {task.updatedAt
              ? new Date(task.updatedAt).toLocaleDateString()
              : "-"}
          </Typography>
        </Box>
      </CardContent>

      {/* ACTIONS */}
      <CardActions sx={{ justifyContent: "flex-end", px: 2 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Tooltip title="Add Label">
            <IconButton
              size="small"
              color="primary"
              onClick={handleOpenLabelPopup}
              sx={{
                border: "1px dashed",
                borderRadius: 2
              }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Tooltip title="Edit Task">
          <IconButton
            color="primary"
            onClick={() => navigate(`/tasks/edit/${task.taskId}`)}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete Task">
          <IconButton
            color="error"
            onClick={() => onDelete(task.taskId)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseLabelPopup}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left"
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
      >
        <Box sx={{ p: 2, width: 220 }}>
          <Typography variant="subtitle2" mb={1}>
            Add Label
          </Typography>

          <Autocomplete
            size="small"
            options={labels || []}
            getOptionLabel={(o) => o.labelName || ""}
            onChange={(e, value) => {
              if (value) {
                assignLabelToTask(task.taskId, value.labelId);
                handleCloseLabelPopup();
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="Select label" />
            )}
          />
        </Box>
      </Popover>


    </Card>
  );
}

export default TaskCard;
