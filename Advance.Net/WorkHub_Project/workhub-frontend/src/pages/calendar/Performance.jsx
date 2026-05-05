import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  LinearProgress
} from "@mui/material";
import {
  TrendingUp
} from "@mui/icons-material";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";

/* -------------------- DATA -------------------- */

const productivityData = [
  { name: "Mon", value: 75 },
  { name: "Tue", value: 88 },
  { name: "Wed", value: 65 },
  { name: "Thu", value: 82 },
  { name: "Fri", value: 78 },
  { name: "Sat", value: 92 },
  { name: "Sun", value: 95 }
];

const qualityScoreData = [
  { month: "Jan", score: 85 },
  { month: "Feb", score: 87 },
  { month: "Mar", score: 89 },
  { month: "Apr", score: 88 },
  { month: "May", score: 90 },
  { month: "Jun", score: 91 }
];

const taskCategories = [
  { name: "Development", percentage: 60, color: "#3b82f6" },
  { name: "Design", percentage: 40, color: "#a855f7" },
  { name: "Marketing", percentage: 25, color: "#ec4899" },
  { name: "Planning", percentage: 85, color: "#f97316" }
];

const timeAllocationData = [
  { name: "Dev", value: 45, color: "#60a5fa" },
  { name: "Meetings", value: 30, color: "#93c5fd" },
  { name: "Planning", value: 25, color: "#fbbf24" }
];

const kpiData = [
  { title: "PRODUCTIVITY INDEX", value: "87%", target: "85%", change: "+5.2", positive: true },
  { title: "QUALITY SCORE", value: "92%", target: "90%", change: "+2.8", positive: true },
  { title: "TASK COMPLETION", value: "78%", target: "80%", change: "-1.5", positive: false },
  { title: "TEAM SATISFACTION", value: "4.2/5", target: "4/5", change: "+0.3", positive: true }
];

/* -------------------- COMPONENT -------------------- */

function Performance() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", py: 4 }}>
      <Container maxWidth="xl">

        {/* PAGE TITLE */}
        <Typography variant="h4" fontWeight="bold" mb={4}>
          Performance Metrics
        </Typography>

        {/* ================= TOP METRICS (4 EQUAL CARDS) ================= */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 3,
            mb: 4
          }}
        >

          {/* Team Productivity */}
          <Paper sx={cardStyle}>
            <Typography variant="body2" color="text.secondary">
              Team Productivity
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              87%
            </Typography>

            <Box display="flex" alignItems="center" gap={0.5} mb={2}>
              <TrendingUp sx={{ fontSize: 16, color: "#10b981" }} />
              <Typography color="#10b981" fontWeight={600}>
                +12% this week
              </Typography>
            </Box>

            <Box sx={{ mt: "auto" }}>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={productivityData}>
                  <Bar dataKey="value" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>

          {/* Tasks Completed */}
          <Paper sx={cardStyle}>
            <Typography variant="body2" color="text.secondary">
              Tasks Completed
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              42
            </Typography>

            <Box sx={{ mt: 2 }}>
              {taskCategories.map((c, i) => (
                <Box key={i} mb={1.5}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography fontSize={13}>{c.name}</Typography>
                    <Typography fontSize={13} fontWeight={600}>
                      {c.percentage}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={c.percentage}
                    sx={{
                      height: 6,
                      borderRadius: 2,
                      bgcolor: "#e5e7eb",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: c.color
                      }
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Time Allocation */}
          <Paper sx={cardStyle}>
            <Typography variant="body2" color="text.secondary">
              Time Allocation
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              160 hrs
            </Typography>

            <Box sx={{ mt: "auto", height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={timeAllocationData}
                    innerRadius={55}
                    outerRadius={75}
                    dataKey="value"
                  >
                    {timeAllocationData.map((e, i) => (
                      <Cell key={i} fill={e.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>

          {/* Quality Score */}
          <Paper sx={cardStyle}>
            <Typography variant="body2" color="text.secondary">
              Quality Score
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              92%
            </Typography>

            <Box sx={{ mt: "auto" }}>
              <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={qualityScoreData}>
                  <defs>
                    <linearGradient id="quality" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    dataKey="score"
                    stroke="#3b82f6"
                    fill="url(#quality)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>

        {/* ================= KPI SCORECARD ================= */}
        <Typography variant="h5" fontWeight="bold" mb={3}>
          KPI Scorecard
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 3
          }}
        >
          {kpiData.map((kpi, i) => (
            <Paper
              key={i}
              sx={{
                p: 3,
                borderRadius: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
              }}
            >
              <Typography fontSize={11} color="text.secondary" fontWeight={700}>
                {kpi.title}
              </Typography>

              <Typography variant="h5" fontWeight="bold">
                {kpi.value}
              </Typography>

              <Box display="flex" justifyContent="space-between">
                <Typography fontSize={13}>
                  Target: <strong>{kpi.target}</strong>
                </Typography>
                <Typography
                  fontWeight={700}
                  color={kpi.positive ? "#10b981" : "#ef4444"}
                >
                  {kpi.change}
                </Typography>
              </Box>
            </Paper>
          ))}
        </Box>

      </Container>
    </Box>
  );
}

/* -------------------- COMMON CARD STYLE -------------------- */

const cardStyle = {
  p: 3,
  borderRadius: 3,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
};

export default Performance;