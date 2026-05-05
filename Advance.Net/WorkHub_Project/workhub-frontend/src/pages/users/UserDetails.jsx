import { useEffect, useState,useRef } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { uploadUserProfileImage } from "../../services/userService";
import { getLoggedInUser } from "../../services/authService";

import {
  Container,
  Box,
  Avatar,
  Typography,
  Chip,
  Stack,
  Card,
  CardContent,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Popover,
  Autocomplete,
  TextField,
  Snackbar
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getUserById,deleteUser } from "../../services/userService";
import {getAllSkills} from "../../services/skillService"
import{assignSkillToUser,removeSkillFromUser,updateUserSkillLevel} from "../../services/userSkillService"

const getSkillColor = (level) => {
  switch (level) {
    case "Expert":
      return "success";
    case "Intermediate":
      return "warning";
    case "Beginner":
      return "info";
    default:
      return "default";
  }
};


function UserDetails() {

  const { id } = useParams();
  const refreshUser = async () => {
    const res = await getUserById(id);
    setUser(res.data);
  };
  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState([]);
  const [editSkill, setEditSkill] = useState(null);
  const fileInputRef = useRef();
  const API_BASE_URL = "https://localhost:7039";

  const [skillAnchorEl, setSkillAnchorEl] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);


  const navigate = useNavigate();
  const [openDelete, setOpenDelete] = useState(false);
  const loggedUser = getLoggedInUser();


  // useEffect(() => {
  //   getUserById(id).then(res => setUser(res.data));
  // }, [id]);
  useEffect(() => {
    Promise.all([getUserById(id), getAllSkills()])
      .then(([userRes, skillRes]) => {
        setUser(userRes.data);
        setSkills(skillRes.data);
      });
  }, [id]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await uploadUserProfileImage(user.userId, file);
      await refreshUser(); // re-fetch user
    } catch (err) {
      alert("Failed to upload image");
    }
  };


  if (!user) return <p>Loading...</p>;
  console.log("loggedUser:", loggedUser)
  console.log("user.userId:", user.userId);
  console.log(typeof loggedUser.userId, typeof user.userId);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* ================= PROFILE ================= */}
      <Card sx={{ mb: 4, borderRadius: 3 }}>
        
      <Stack direction="row" spacing={2} mt={3}>
        {loggedUser.userId === user.userId && (
          <Button
            variant="outlined"
            onClick={() => navigate(`/users/edit/${user.userId}`)}
          >
            Edit profile
          </Button>

          
        )}
          

          <Button
            variant="contained"
            color="error"
            onClick={() => setOpenDelete(true)}
          >
            Delete
          </Button>
        </Stack>
        <CardContent>
          <Stack direction="row" spacing={4} alignItems="center">
            <input
              type="file"
              accept="image/*"
              hidden
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            <Avatar
              src={
                user.profileImage
                  ? `${API_BASE_URL}${user.profileImage}`
                  : ""
              }
              sx={{ width: 120, height: 120, cursor: "pointer" }}
              onClick={() => fileInputRef.current.click()} 
            >
              {!user.profileImage && user.fullName?.charAt(0)}
            </Avatar>



            <Box>
              <Typography variant="h4" fontWeight="bold">
                {user.fullName}
              </Typography>

              <Typography color="text.secondary">
                {user.email}
              </Typography>

              <Stack direction="row" spacing={2} mt={2}>
                <Chip label={user.roleName} />
                <Chip
                  label={user.isActive ? "Active" : "Inactive"}
                  color={user.isActive ? "success" : "error"}
                />
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* ================= SKILLS ================= */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5" fontWeight="bold">
          Skills
        </Typography>

        <Button
          size="small"
          variant="outlined"
          onClick={(e) => setSkillAnchorEl(e.currentTarget)}
        >
          Add Skill
        </Button>
      </Stack>

      {user.skills.length === 0 ? (
        <Typography color="text.secondary" mb={4}>
          No skills added.
        </Typography>
      ) : (
        <Stack direction="row" spacing={2} flexWrap="wrap" mb={4}>
          {user.skills.map(skill => (
            <Chip
              key={skill.skillId}
              label={`${skill.skillName} (${skill.skillLevel})`}
              color={getSkillColor(skill.skillLevel)}
              onClick={(e) =>
                setEditSkill({
                  anchorEl: e.currentTarget,
                  userId: user.userId, 
                  skillId: skill.skillId,
                  skillLevel: skill.skillLevel
                })
              }
              
              onDelete={async () => {
                await removeSkillFromUser(user.userId, skill.skillId);
                refreshUser();
              }}
              deleteIcon={<CloseIcon />}
              sx={{ cursor: "pointer" }}
            />
            
          ))}
        </Stack>
      )}
      <Popover
        open={Boolean(editSkill)}
        anchorEl={editSkill?.anchorEl}
        onClose={() => setEditSkill(null)}
      >
        <Box sx={{ p: 2, width: 220 }}>
          <Typography variant="subtitle2" mb={1}>
            Update Skill Level
          </Typography>

          <Autocomplete
            options={["Beginner", "Intermediate", "Expert"]}
            value={editSkill?.skillLevel}
              onChange={async (e, value) => {
              if (!value || value === editSkill.skillLevel) return;

              await updateUserSkillLevel(
                editSkill.userId,
                editSkill.skillId,
                value
              );

              setEditSkill(null);
              setSnackbarOpen(true);
              refreshUser();
            }}
            renderInput={(params) => (
              <TextField {...params} label="Skill Level" />
            )}
          />
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={2000}
            onClose={() => setSnackbarOpen(false)}
            message="Skill updated successfully"
          />

        </Box>
      </Popover>

      <Popover
        open={Boolean(skillAnchorEl)}
        anchorEl={skillAnchorEl}
        onClose={() => setSkillAnchorEl(null)}
      >
        <Box sx={{ p: 2, width: 240 }}>
          <Autocomplete
            options={skills || []}
            getOptionLabel={(o) => o.skillName}
            onChange={async (e, value) => {
              if (value) {
                await assignSkillToUser(user.userId, value.skillId, "Beginner");
                setSkillAnchorEl(null);
                refreshUser();
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="Select Skill" />
            )}
          />
        </Box>
      </Popover>

      <Divider sx={{ my: 4 }} />

      {/* ================= TASKS ================= */}
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Assigned Tasks
      </Typography>

      {user.assignedTasks.length === 0 ? (
        <Typography color="text.secondary">
          No tasks assigned.
        </Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 3
          }}
        >
          {user.assignedTasks.map(task => (
            <Card
              key={task.taskId}
              sx={{
                borderRadius: 3,
                boxShadow: 3,
                transition: "0.3s",
                "&:hover": {
                  boxShadow: 8,
                  transform: "translateY(-6px)"
                }
              }}
            >
              <CardContent>
                <Typography fontWeight="bold">
                  {task.title}
                </Typography>

                <Stack direction="row" spacing={1} mt={1}>

                  <Chip label={task.status} size="small" />
                  <Chip label={task.priority} size="small" />
                </Stack>
              </CardContent>
            </Card>
            
          ))}
        </Box>
        
      )}
      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        BackdropProps={{
          sx: {
            backdropFilter: "blur(6px)",
            backgroundColor: "rgba(0,0,0,0.3)"
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Delete User?
        </DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to delete this user?
            This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={async () => {
              await deleteUser(user.userId);
              navigate("/users");
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
    
    
  );
}

export default UserDetails;
