import { Box, Grid, Card, CardContent, Typography,LinearProgress } from "@mui/material";
import AIChatPanel from "../../components/ai/AIChatPanel";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { Fab } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import TaskIcon from "@mui/icons-material/Task";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import MailIcon from "@mui/icons-material/Mail";
import { useState } from "react";

const stats = [
  { title: "Team Members", value: 12, subtitle: "2 joined this month", icon: <GroupIcon />, color: "#4f8cff" },
  { title: "Active Tasks", value: 24, subtitle: "8 due this week", icon: <TaskIcon />, color: "#4caf50" },
  { title: "Team Activity", value: "87%", subtitle: "+12% from last week", icon: <TrendingUpIcon />, color: "#ff9800" },
  { title: "Unread Messages", value: 9, subtitle: "3 require attention", icon: <MailIcon />, color: "#f44336" }
];

const pieData = [
  { name: "Completed", value: 8 },
  { name: "In Progress", value: 12 },
  { name: "Planning", value: 5 }
];

const statusData = [
  { name: "Completed", value: 8, color: "#4caf50" },
  { name: "In Progress", value: 12, color: "#4f8cff" },
  { name: "Planning", value: 5, color: "#ff9800" }
];

const total = 28;

const pieColors = ["#4caf50", "#2196f3", "#ff9800"];

const lineData = [
  { name: "Mon", completed: 4, progress: 2 },
  { name: "Tue", completed: 6, progress: 3 },
  { name: "Wed", completed: 5, progress: 4 },
  { name: "Thu", completed: 8, progress: 5 },
  { name: "Fri", completed: 10, progress: 6 },
  { name: "Sat", completed: 12, progress: 7 },
  { name: "Sun", completed: 14, progress: 8 }
];



function Dashboard() {
  const [openAI, setOpenAI] = useState(false);
  return (
    <Box sx={{ 
        p: 3, 
        // bgcolor: "#f5f9ff",
         minHeight: "100vh" }}>
      
      {/* TITLE */}
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Team Dashboard
      </Typography>

      {/* TOP 4 CARDS */}
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 3,
                mb: 4
            }}
            >
            {stats.map((item, i) => (
                <Card
                key={i}
                sx={{
                    borderRadius: 3,
                    p: 2.5,
                    boxShadow:3,
                    // boxShadow: "0 4px 50px rgba(0,0,0,0.05)",
                    transition: "0.3s",
                    "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                    }
                }}
                >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                    <Typography variant="body2" color="text.secondary">
                        {item.title}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                        {item.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {item.subtitle}
                    </Typography>
                    </Box>

                    <Box
                    sx={{
                        width: 45,
                        height: 45,
                        borderRadius: "12px",
                        bgcolor: "#eaf2ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: item.color
                    }}
                    >
                    {item.icon}
                    </Box>
                </Box>
                </Card>
            ))}
            </Box>

      {/* CHART SECTION */}
      <Box
  sx={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 3
  }}
>
  {/* Project Analytics */}
  <Card sx={{ borderRadius: 3, p: 3, boxShadow: 3 }}>
    <Typography variant="h6" mb={2}>
      Project Analytics
    </Typography>

    <Box display="flex" gap={3}>
      <ResponsiveContainer width="50%" height={250}>
        <PieChart>
          <Pie data={pieData} innerRadius={70} outerRadius={100} dataKey="value">
            {pieData.map((e, i) => (
              <Cell key={i} fill={pieColors[i]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {/* Status Breakdown */}
        <Box sx={{ flex: 1 }}>
            {/* status breakdown */}
            <Box sx={{ width: "100%" }}>
            <Typography variant="subtitle1" fontWeight="600" mb={2}>
                Status Breakdown
            </Typography>

            {statusData.map((item, i) => {
                const percent = (item.value / total) * 100;

                return (
                <Box
                    key={i}
                    sx={{
                    mb: 2,
                    p: 2,
                    borderRadius: 2,
                    // bgcolor: "#f6fbff"
                    }}
                >
                    {/* Label Row */}
                    <Box display="flex" justifyContent="space-between" mb={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Box
                        sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            bgcolor: item.color
                        }}
                        />
                        <Typography fontWeight="500">{item.name}</Typography>
                    </Box>

                    <Typography fontWeight="600">{item.value}</Typography>
                    </Box>

                    {/* Progress Bar */}
                    <LinearProgress
                    variant="determinate"
                    value={percent}
                    sx={{
                        height: 8,
                        borderRadius: 5,
                        // backgroundColor: "#eaeef3",
                        "& .MuiLinearProgress-bar": {
                        backgroundColor: item.color,
                        borderRadius: 5
                        }
                    }}
                    />
                </Box>
                );
            })}
            </Box>
        </Box>
    </Box>
  </Card>

  {/* Trend Analysis */}
  <Card sx={{ borderRadius: 3, p: 3, boxShadow: 3 }}>
    <Typography variant="h6" mb={2}>
      Trend Analysis
    </Typography>

    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={lineData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line dataKey="completed" stroke="#7b6cff" strokeWidth={3} />
        <Line dataKey="progress" stroke="#4caf50" strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  </Card>
      </Box>

      {/* 🔥 AI Chat */}
      <AIChatPanel open={openAI} onClose={() => setOpenAI(false)} />

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          style={{position: "fixed",bottom: 25,right: 25, zIndex: 1500}}
        >
          <Fab
            color="primary"
            onClick={() => setOpenAI(!openAI)}
            sx={{width: 65,height: 65,boxShadow: "0px 8px 20px rgba(0,0,0,0.2)"}}
          >
            <SmartToyIcon sx={{ fontSize: 35 }} />
          </Fab>
        </motion.div>
    </Box>

    
    
  );
}

export default Dashboard;