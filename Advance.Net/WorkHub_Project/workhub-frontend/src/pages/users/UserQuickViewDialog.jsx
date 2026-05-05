import {
  Dialog,
  DialogContent,
  Box,
  Avatar,
  Typography,
  Chip,
  Tabs,
  Tab,
  Button,
  LinearProgress,
  Stack,
  IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import PersonIcon from "@mui/icons-material/Person";
import ChatIcon from "@mui/icons-material/Chat";
import { useState } from "react";

function TabPanel({ value, index, children }) {
  return value === index && <Box mt={3}>{children}</Box>;
}

const UserQuickViewDialog = ({ open, user, onClose, onViewProfile }) => {
  const [tab, setTab] = useState(0);
  const API_BASE_URL = "https://localhost:7039";

  if (!user) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      BackdropProps={{
        sx: {
          backdropFilter: "blur(6px)",
          backgroundColor: "rgba(0,0,0,0.35)"
        }
      }}
    >
      <DialogContent sx={{ p: 4, position: "relative" }}>
        {/* ❌ CLOSE */}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 12, right: 12 }}
        >
          <CloseIcon />
        </IconButton>

        {/* ===== HEADER ===== */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            // src={user.profileImage}
            src={
                user.profileImage
                  ? `${API_BASE_URL}${user.profileImage}`
                  : ""
              }
            sx={{ width: 64, height: 64 }}
          />
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {user.fullName}
            </Typography>
            <Stack direction="row" spacing={1} mt={0.5}>
              <Typography color="text.secondary">
                {user.roleName}
              </Typography>
              <Chip label="Active" size="small" />
              <Chip label="Member" color="primary" size="small" />
            </Stack>
          </Box>
        </Stack>

        {/* ===== TABS ===== */}
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          sx={{
            mt: 4,
            backgroundColor: "#bfd7f3",
            borderRadius: 3,
            p: 0.5,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2
            },
            "& .Mui-selected": {
              backgroundColor: "#64b5f6",
              color: "#fff"
            }
          }}
        >
          <Tab label="Information" />
          <Tab label="Projects" />
          <Tab label="Skills" />
        </Tabs>

        {/* ===== INFORMATION TAB ===== */}
        <TabPanel value={tab} index={0}>
          <Stack spacing={2}>
            <Typography>Email: {user.email}</Typography>
            <Typography>Status: {user.isActive ? "Active" : "Inactive"}</Typography>
          </Stack>
        </TabPanel>

        {/* ===== PROJECTS TAB ===== */}
        <TabPanel value={tab} index={1}>
          <Stack spacing={2}>
            {(user.assignedTasks || []).map(task => (
              <Box
                key={task.taskId}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  p: 2
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <WorkOutlineIcon color="primary" />
                  <Box>
                    <Typography fontWeight="bold">{task.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Active project
                    </Typography>
                  </Box>
                </Stack>

                <Button variant="outlined" size="small">
                  View
                </Button>
              </Box>
            ))}
          </Stack>
        </TabPanel>

        {/* ===== SKILLS TAB ===== */}
        <TabPanel value={tab} index={2}>
          {/* SKILL CHIPS */}
          <Stack direction="row" spacing={1} mb={3}>
            {(user.skills || []).map(skill => (
              <Chip
                key={skill.skillId}
                label={skill.skillName}
                color="primary"
              />
            ))}
          </Stack>

          {/* SKILL BARS */}
          <Typography fontWeight="bold" mb={2}>
            Expertise Areas
          </Typography>

          {(user.skills || []).map(skill => (
            <Box key={skill.skillId} mb={2}>
              <Stack
                direction="row"
                justifyContent="space-between"
                mb={0.5}
              >
                <Typography>{skill.skillName}</Typography>
                <Typography>
                  {skill.skillLevel === "Expert"
                    ? "80%"
                    : skill.skillLevel === "Intermediate"
                    ? "70%"
                    : "50%"}
                </Typography>
              </Stack>

              <LinearProgress
                variant="determinate"
                value={
                  skill.skillLevel === "Expert"
                    ? 80
                    : skill.skillLevel === "Intermediate"
                    ? 70
                    : 50
                }
                sx={{
                  height: 8,
                  borderRadius: 5,
                  backgroundColor: "#e0e0e0",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#42a5f5"
                  }
                }}
              />
            </Box>
          ))}
        </TabPanel>

        {/* ===== FOOTER ===== */}
        <Stack
          direction="row"
          justifyContent="space-between"
          mt={4}
        >
          <Button onClick={onClose}>Close</Button>

          <Stack direction="row" spacing={2}>
            <Button
              startIcon={<PersonIcon />}
              variant="outlined"
              onClick={onViewProfile}
            >
              View Profile
            </Button>

            <Button
              startIcon={<ChatIcon />}
              variant="contained"
            >
              Message
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default UserQuickViewDialog;
