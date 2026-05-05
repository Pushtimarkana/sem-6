// src/components/layout/Navbar.jsx
import {
  AppBar, Toolbar, Box, IconButton, Avatar,
  Tooltip, Menu, MenuItem, Badge, Popover,
  Typography, Divider, CircularProgress, Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import SearchIcon        from "@mui/icons-material/Search";
import LogoutIcon        from "@mui/icons-material/Logout";
import DarkModeIcon      from "@mui/icons-material/DarkMode";
import LightModeIcon     from "@mui/icons-material/LightMode";
import SettingsIcon      from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DoneAllIcon       from "@mui/icons-material/DoneAll";
import RefreshIcon       from "@mui/icons-material/Refresh";
import TaskIcon          from "@mui/icons-material/Task";
import WarningAmberIcon  from "@mui/icons-material/WarningAmber";
import CheckCircleIcon   from "@mui/icons-material/CheckCircle";
import ErrorIcon         from "@mui/icons-material/Error";
import AssignmentIcon    from "@mui/icons-material/Assignment";

import { ColorModeContext } from "../../context/ThemeContext";
import { useNotifications }  from "../../context/NotificationContext";
import { getLoggedInUser }   from "../../services/authService";
import { getUserById }       from "../../services/userService";

const API_BASE = "https://localhost:7039";

// ── Type metadata ─────────────────────────────────────────────
const TYPE_META = {
  assigned:  { color: "#6c63ff", bg: "#6c63ff18", MuiIcon: AssignmentIcon  },
  deadline:  { color: "#ffb547", bg: "#ffb54718", MuiIcon: WarningAmberIcon },
  overdue:   { color: "#ff4d7e", bg: "#ff4d7e18", MuiIcon: ErrorIcon        },
  completed: { color: "#3dd68c", bg: "#3dd68c18", MuiIcon: CheckCircleIcon  },
};

// ── Time formatter ────────────────────────────────────────────
function timeAgo(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const m    = Math.floor(diff / 60_000);
  if (m < 1)  return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ── Single notification row ───────────────────────────────────
function NotifRow({ notif, onMarkRead }) {
  const theme = useTheme();
  const meta  = TYPE_META[notif.type] ?? TYPE_META.assigned;
  const Icon  = meta.MuiIcon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      onClick={() => !notif.read && onMarkRead(notif.id)}
      style={{
        display:    "flex",
        gap:        12,
        padding:    "12px 16px",
        cursor:     notif.read ? "default" : "pointer",
        background: notif.read
          ? "transparent"
          : theme.palette.mode === "dark" ? "rgba(108,99,255,0.06)" : "rgba(108,99,255,0.04)",
        borderLeft: notif.read ? "3px solid transparent" : `3px solid ${meta.color}`,
        transition: "background 0.2s",
      }}
    >
      {/* icon circle */}
      <div style={{
        width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
        background: meta.bg,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon style={{ fontSize: 18, color: meta.color }} />
      </div>

      {/* text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: notif.read ? 400 : 600,
          color: theme.palette.text.primary,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {notif.title}
        </div>
        <div style={{
          fontSize: 12, color: theme.palette.text.secondary,
          marginTop: 2, lineHeight: 1.4,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {notif.message}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 5 }}>
          {notif.time && (
            <span style={{ fontSize: 11, color: theme.palette.text.disabled }}>
              {timeAgo(notif.time)}
            </span>
          )}
          {notif.priority && (
            <Chip
              label={notif.priority}
              size="small"
              sx={{
                height: 16, fontSize: 10,
                bgcolor: notif.priority === "High"   ? "#ff4d7e20"
                       : notif.priority === "Medium" ? "#ffb54720"
                       : "#00d2c820",
                color:   notif.priority === "High"   ? "#ff4d7e"
                       : notif.priority === "Medium" ? "#ffb547"
                       : "#00d2c8",
                "& .MuiChip-label": { px: 0.8 },
              }}
            />
          )}
        </div>
      </div>

      {/* unread dot */}
      {!notif.read && (
        <div style={{
          width: 8, height: 8, borderRadius: "50%",
          background: meta.color, flexShrink: 0, marginTop: 5,
        }} />
      )}
    </motion.div>
  );
}

// ── Notification panel ────────────────────────────────────────
function NotificationPanel({ anchorEl, onClose }) {
  const theme                                       = useTheme();
  const { notifications, unreadCount, loading, markRead, markAllRead, refresh } = useNotifications();
  const [filter, setFilter]                         = useState("all");

  const open = Boolean(anchorEl);

  const filtered = notifications.filter(n => {
    if (filter === "unread") return !n.read;
    if (filter === "overdue" || filter === "deadline" || filter === "completed") return n.type === filter;
    return true;
  });

  const filterTabs = [
    { key: "all",       label: "All"       },
    { key: "unread",    label: `Unread (${unreadCount})` },
    { key: "overdue",   label: "Overdue"   },
    { key: "deadline",  label: "Deadlines" },
    { key: "completed", label: "Completed" },
  ];

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      PaperProps={{
        sx: {
          width: 380,
          maxHeight: 560,
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: theme.palette.mode === "dark"
            ? "0 8px 40px rgba(0,0,0,0.6)"
            : "0 8px 40px rgba(0,0,0,0.15)",
          border: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
          display: "flex",
          flexDirection: "column",
        }
      }}
    >
      {/* Header */}
      <Box sx={{
        px: 2, py: 1.5,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: `1px solid ${theme.palette.divider}`,
        flexShrink: 0,
      }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography fontWeight={700} fontSize={15}>Notifications</Typography>
          {unreadCount > 0 && (
            <Box sx={{
              bgcolor: "#ff4d7e", color: "#fff",
              borderRadius: 99, px: 1, py: 0.1,
              fontSize: 11, fontWeight: 700,
              lineHeight: "18px", minWidth: 20, textAlign: "center",
            }}>
              {unreadCount}
            </Box>
          )}
        </Box>
        <Box display="flex" alignItems="center" gap={0.5}>
          <Tooltip title="Refresh">
            <IconButton size="small" onClick={refresh} disabled={loading}>
              {loading
                ? <CircularProgress size={14} />
                : <RefreshIcon sx={{ fontSize: 16 }} />}
            </IconButton>
          </Tooltip>
          {unreadCount > 0 && (
            <Tooltip title="Mark all read">
              <IconButton size="small" onClick={markAllRead}>
                <DoneAllIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* Filter tabs */}
      <Box sx={{
        display: "flex", gap: 0.5, px: 1.5, py: 1,
        overflowX: "auto", flexShrink: 0,
        borderBottom: `1px solid ${theme.palette.divider}`,
        "&::-webkit-scrollbar": { display: "none" },
      }}>
        {filterTabs.map(tab => (
          <Box
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            sx={{
              px: 1.5, py: 0.5, borderRadius: 99, fontSize: 12,
              fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
              transition: "all 0.15s",
              bgcolor: filter === tab.key ? "#6c63ff" : "transparent",
              color:   filter === tab.key ? "#fff"
                     : theme.palette.text.secondary,
              "&:hover": {
                bgcolor: filter === tab.key ? "#6c63ff" : theme.palette.action.hover,
              },
            }}
          >
            {tab.label}
          </Box>
        ))}
      </Box>

      {/* List */}
      <Box sx={{ overflowY: "auto", flex: 1 }}>
        {loading && notifications.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={5}>
            <CircularProgress size={28} sx={{ color: "#6c63ff" }} />
          </Box>
        ) : filtered.length === 0 ? (
          <Box py={5} textAlign="center">
            <Box fontSize={36} mb={1}>🔔</Box>
            <Typography fontSize={14} color="text.secondary">
              {filter === "unread" ? "All caught up!" : "No notifications here"}
            </Typography>
          </Box>
        ) : (
          <AnimatePresence initial={false}>
            {filtered.map((notif, i) => (
              <Box key={notif.id}>
                <NotifRow notif={notif} onMarkRead={markRead} />
                {i < filtered.length - 1 && (
                  <Divider sx={{ mx: 2, opacity: 0.5 }} />
                )}
              </Box>
            ))}
          </AnimatePresence>
        )}
      </Box>

      {/* Footer */}
      {notifications.length > 0 && (
        <Box sx={{
          px: 2, py: 1, textAlign: "center",
          borderTop: `1px solid ${theme.palette.divider}`,
          flexShrink: 0,
        }}>
          <Typography
            fontSize={12} color="#6c63ff" fontWeight={600}
            sx={{ cursor: "pointer", "&:hover": { opacity: 0.8 } }}
            onClick={markAllRead}
          >
            Mark all as read
          </Typography>
        </Box>
      )}
    </Popover>
  );
}

// ══════════════════════════════════════════════════════════════
// NAVBAR
// ══════════════════════════════════════════════════════════════
function Navbar() {
  const [menuAnchor,  setMenuAnchor]  = useState(null);
  const [notifAnchor, setNotifAnchor] = useState(null);
  const [userAvatar,  setUserAvatar]  = useState(null);
  const [userInitial, setUserInitial] = useState("U");

  const theme     = useTheme();
  const colorMode = useContext(ColorModeContext);
  const navigate  = useNavigate();
  const loggedUser = getLoggedInUser();

  const { unreadCount } = useNotifications();

  // Load avatar for the navbar
  useEffect(() => {
    if (!loggedUser?.userId) return;
    getUserById(loggedUser.userId).then(res => {
      const u = res.data;
      if (u?.profileImage) setUserAvatar(`${API_BASE}${u.profileImage}`);
      if (u?.fullName)     setUserInitial(u.fullName.charAt(0).toUpperCase());
    }).catch(() => {});
  }, [loggedUser?.userId]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        color="default"
        sx={{ borderBottom: "1px solid", borderColor: "divider" }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Left */}
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton size="small">
              <SearchIcon />
            </IconButton>
          </Box>

          {/* Right */}
          <Box display="flex" alignItems="center" gap={0.5}>
            {/* Dark/Light toggle */}
            <Tooltip title="Toggle theme">
              <IconButton onClick={colorMode.toggleColorMode}>
                {theme.palette.mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>

            {/* Settings */}
            <Tooltip title="Settings">
              <IconButton>
                <SettingsIcon />
              </IconButton>
            </Tooltip>

            {/* 🔔 Notifications */}
            <Tooltip title="Notifications">
              <IconButton
                onClick={e => setNotifAnchor(notifAnchor ? null : e.currentTarget)}
              >
                <Badge
                  badgeContent={unreadCount}
                  max={99}
                  sx={{
                    "& .MuiBadge-badge": {
                      bgcolor: "#ff4d7e",
                      color:   "#fff",
                      fontSize: 10,
                      fontWeight: 700,
                      minWidth: 18,
                      height: 18,
                      // pulse animation when there are unread notifications
                      animation: unreadCount > 0 ? "pulse 2s infinite" : "none",
                    },
                    "@keyframes pulse": {
                      "0%":   { boxShadow: "0 0 0 0 rgba(255,77,126,0.6)" },
                      "70%":  { boxShadow: "0 0 0 6px rgba(255,77,126,0)" },
                      "100%": { boxShadow: "0 0 0 0 rgba(255,77,126,0)"  },
                    },
                  }}
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Avatar menu */}
            <IconButton onClick={e => setMenuAnchor(e.currentTarget)} size="small" sx={{ ml: 0.5 }}>
              <Avatar
                src={userAvatar ?? ""}
                sx={{
                  width: 32, height: 32,
                  background: `linear-gradient(135deg, #6c63ff, #00d2c8)`,
                  fontSize: 14, fontWeight: 700,
                }}
              >
                {!userAvatar && userInitial}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Notification panel */}
      <NotificationPanel
        anchorEl={notifAnchor}
        onClose={() => setNotifAnchor(null)}
      />

      {/* Profile menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        PaperProps={{ sx: { borderRadius: 2, minWidth: 160, mt: 0.5 } }}
      >
        <MenuItem onClick={() => { setMenuAnchor(null); navigate(`/users/${loggedUser?.userId}`); }}>
          <Avatar src={userAvatar ?? ""} sx={{ width: 22, height: 22, mr: 1, fontSize: 12, background: `linear-gradient(135deg, #6c63ff, #00d2c8)` }}>
            {!userAvatar && userInitial}
          </Avatar>
          My Profile
        </MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)}>
          <SettingsIcon sx={{ mr: 1, fontSize: 20 }} /> Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
          <LogoutIcon sx={{ mr: 1, fontSize: 20 }} /> Logout
        </MenuItem>
      </Menu>
    </>
  );
}

export default Navbar;