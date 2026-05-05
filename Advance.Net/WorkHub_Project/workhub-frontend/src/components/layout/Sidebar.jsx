// src/components/layout/Sidebar.jsx
import {
  Box, Typography, List, ListItemButton, ListItemIcon,
  ListItemText, Divider, Avatar, IconButton
} from "@mui/material";
import { useState, useEffect } from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import GroupIcon from "@mui/icons-material/Group";
import TaskIcon from "@mui/icons-material/Task";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BarChartIcon from "@mui/icons-material/BarChart";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import { AssessmentOutlined, HomeMaxOutlined, PersonOutlined } from "@mui/icons-material";
import { NavLink, useNavigate } from "react-router-dom";
import { getLoggedInUser ,logoutUser} from "../../services/authService";
import { getUserById } from "../../services/userService";

// ── Menu items with optional role restriction ──────────────────
// roles: ["Admin"] → only admins see it
// roles: ["User"]  → only users see it
// roles omitted    → everyone sees it
const ALL_MENU = [
  // ── Admin only ──────────────────────────────────────────────
  { label: "Team Dashboard", path: "/dashboard",     exact: true,  icon: <DashboardIcon />,      roles: ["Admin"] },
  { label: "Home",           path: "/showcase",      exact: true,  icon: <HomeMaxOutlined />,    roles: ["Admin"] },
  { label: "Members",        path: "/users",         exact: false, icon: <GroupIcon />,          roles: ["Admin"] },
  { label: "Tasks",          path: "/tasks",         exact: true,  icon: <TaskIcon />,           roles: ["Admin"] },
  { label: "Assign Tasks",   path: "/tasks/assign",  exact: true,  icon: <AssessmentOutlined />, roles: ["Admin"] },
  { label: "Sub Tasks",      path: "/subtasks",      exact: true,  icon: <TaskIcon />,           roles: ["Admin"] },
  { label: "Calendar",       path: "/calendar",      exact: true,  icon: <CalendarMonthIcon />,  roles: ["Admin"] },
  { label: "Performance",    path: "/performance",   exact: true,  icon: <BarChartIcon />,       roles: ["Admin"] },
  { label: "Messages",       path: "/messages",      exact: true,  icon: <MailIcon />,           roles: ["Admin"] },

  // ── User only ───────────────────────────────────────────────
  { label: "Dashboard",      path: "/user-dashboard", exact: true, icon: <DashboardIcon />,      roles: ["User"] },
  { label: "Members",        path: "/users",          exact: false, icon: <GroupIcon />,         roles: ["User"] },
  { label: "Tasks",          path: "/tasks",          exact: true,  icon: <TaskIcon />,          roles: ["User"] },
  { label: "Sub Tasks",      path: "/subtasks",       exact: true,  icon: <TaskIcon />,          roles: ["User"] },
  { label: "Calendar",       path: "/calendar",       exact: true,  icon: <CalendarMonthIcon />, roles: ["User"] },
  { label: "Performance",    path: "/performance",    exact: true,  icon: <BarChartIcon />,      roles: ["User"] },
  { label: "Messages",       path: "/messages",       exact: true,  icon: <MailIcon />,          roles: ["User"] },
];

function Sidebar() {
  const navigate = useNavigate();
  const loggedUser = getLoggedInUser();
  const [user, setUser] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (loggedUser?.userId) {
      getUserById(loggedUser.userId).then(res => setUser(res.data));
    }
  }, [loggedUser?.userId]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logoutUser();
      navigate("/login");
    }
  };

  // Filter menu items by role
  const visibleMenu = ALL_MENU.filter(item => {
    if (!item.roles) return true;                          // no restriction → show to all
    return item.roles.includes(loggedUser?.role);          // role match
  }).map(item => {
    // "My Profile" → dynamically point to logged-in user's profile page
    if (item.dynamic === "profile" && loggedUser?.userId) {
      return { ...item, path: `/users/${loggedUser.userId}` };
    }
    return item;
  });

  if (!user) return <Box sx={{ width: 260, p: 2 }}><Typography>Loading...</Typography></Box>;

  return (
    <Box
      sx={{
        width: collapsed ? 70 : 260,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        borderRight: "1px solid",
        borderColor: "divider",
        px: collapsed ? 0 : 2,
        py: 3,
        transition: "0.3s",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        {!collapsed && (
          <Typography variant="h6" fontWeight="bold">✅ WorkHub</Typography>
        )}
        <IconButton onClick={() => setCollapsed(!collapsed)}>
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Nav Links */}
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <List>
          {visibleMenu.map(item => (
            <ListItemButton
              key={(item.roles?.[0] ?? "all") + item.path}
              component={NavLink}
              to={item.path}
              end={item.exact}
              sx={{
                borderRadius: 2,
                my: 0.5,
                justifyContent: collapsed ? "center" : "flex-start",
                "&.active": { bgcolor: "#b9e3fd", color: "primary.main", fontWeight: "bold" },
                px: collapsed ? 0 : 2,
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: "primary.light", justifyContent: "center" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{ opacity: collapsed ? 0 : 1, transition: "0.2s" }}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* Upgrade banner — only for users */}
      {!collapsed && loggedUser?.role === "User" && (
        <Box sx={{ mt: 2, p: 2, bgcolor: "primary.light", borderRadius: 2 }}>
          <Typography fontWeight="bold">Upgrade to Premium</Typography>
          <Typography variant="caption">Unlimited tasks, projects & team</Typography>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      {/* User footer */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Avatar
          src={user.profileImage ? `https://localhost:7039/${user.profileImage}` : ""}
          sx={{ cursor: "pointer" }}
          onClick={() => navigate(`/users/${user.userId}`)}
        >
          {!user.profileImage && user.fullName?.charAt(0)}
        </Avatar>

        {!collapsed && (
          <Box sx={{ flexGrow: 1 }}>
            <Typography fontSize={14}>{user.fullName}</Typography>
            <Typography fontSize={12} color="gray">{user.email}</Typography>
          </Box>
        )}

        <IconButton color="error" onClick={handleLogout}>
          <LogoutIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default Sidebar;