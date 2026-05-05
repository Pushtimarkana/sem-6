import { useEffect, useState } from "react";
import { getAllUsers } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Chip,
  Container,
  Box,
  Grow,
  Button
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ChatIcon from "@mui/icons-material/Chat";
// import UserQuickViewDialog from "../../components/users/UserQuickViewDialog";
import UserQuickViewDialog from "./UserQuickViewDialog";


const UserList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const API_BASE_URL = "https://localhost:7039";


  useEffect(() => {
    getAllUsers()
      .then(res => {
        const usersArray = res?.data || [];
        setUsers(Array.isArray(usersArray) ? usersArray : []);
      })
      .catch(err => {
        console.error(err);
        setUsers([]);
      });
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* PAGE TITLE */}
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Users
      </Typography>

      {users.length === 0 && (
        <Typography color="text.secondary">
          No users found.
        </Typography>
      )}

      <Button
        variant="contained"
        onClick={() => navigate("/users/add")}
      >
        + Add User
      </Button>


      {/* 🔥 PERFECT GRID (3 PER ROW) */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)", // ✅ EXACTLY 3
          gap: 4
        }}
      >
        {users.map((user, index) => (
          <Grow
            in
            timeout={500 + index * 150}
            key={user.userId}
          >
            <Box sx={{ height: "100%" }}>
              <Card
               onClick={() => {setSelectedUser(user);setOpenDialog(true);}}
                sx={{
                  cursor: "pointer",
                  height: "100%",
                  minHeight: 250,
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: "0.35s",
                  "&:hover": {
                    boxShadow: 10,
                    transform: "translateY(-8px)"
                  }
                }}
              >
                <CardContent>
                  {/* AVATAR */}
                  {/* <Avatar
                    src={
                      user.profileImage
                        ? user.profileImage.startsWith("http")
                          ? user.profileImage
                          : `http://localhost:5000${user.profileImage}`
                        : ""
                    }
                    sx={{
                      width: 90,
                      height: 90,
                      mx: "auto",
                      mb: 1
                    }}
                  >
                    {!user.profileImage && user.fullName?.charAt(0)}
                  </Avatar> */}
                  <Avatar
                    src={
                      user.profileImage
                        ? `${API_BASE_URL}${user.profileImage}`
                        : ""
                    }
                    sx={{ width: 90, height: 90,mx:"auto",mb:1, cursor: "pointer" }}
                    
                  >
                    {!user.profileImage && user.fullName?.charAt(0)}
                  </Avatar>

                  {/* NAME */}
                  <Typography variant="h6" mt={1}>
                    {user.fullName}
                  </Typography>

                  {/* EMAIL */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mb={2}
                  >
                    {user.email}
                  </Typography>

                  {/* ROLE + STATUS */}
                  <Box>
                    <Chip
                      label={user.roleName || "User"}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={user.isActive ? "Active" : "Inactive"}
                      color={user.isActive ? "success" : "error"}
                      size="small"
                    />
                  </Box>
                  {/* ACTION BUTTONS */}
                  <Box
                    mt={3}
                    display="flex"
                    justifyContent="center"
                    gap={1}
                  >
                    {/* VIEW PROFILE */}
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<PersonIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/users/${user.userId}`);
                      }}
                      sx={{
                        transition: "0.3s",
                        "&:hover": {
                          backgroundColor: "primary.main",
                          color: "#fff",
                          borderColor: "primary.main"
                        }
                      }}
                    >
                      View
                    </Button>

                    {/* MESSAGE */}
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<ChatIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/messages/${user.userId}`);
                      }}
                      sx={{
                        transition: "0.3s",
                        "&:hover": {
                          backgroundColor: "success.dark"
                        }
                      }}
                    >
                      Message
                    </Button>
                  </Box>

                </CardContent>
              </Card>
            </Box>
          </Grow>
        ))}
      </Box>
      {selectedUser && (
      <UserQuickViewDialog
        open={openDialog}
        user={selectedUser}
        onClose={() => setOpenDialog(false)}
        onViewProfile={() =>
          navigate(`/users/${selectedUser.userId}`)
        }
      />
    )}
    </Container>
  );
};

export default UserList;
