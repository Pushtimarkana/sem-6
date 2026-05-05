import { useState } from "react";
import { Box, Typography, IconButton ,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "./stackedCards.css";
import { suggestAssignee } from "../../services/aiService";
// import TaskIcon from "@mui/icons-material/Task";
// import GroupIcon from "@mui/icons-material/Group";
import CategoryIcon from "@mui/icons-material/Category";   // for Labels
import PsychologyIcon from "@mui/icons-material/Psychology"; // for Skills
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { useTheme } from "@mui/material/styles";


const cards = [
  {
    id: 1,
    title: "Skills",
    description: "Manage all skills",
    navigateTo: "/skills",
    color: "#E3F2FD",
    icon:<PsychologyIcon  sx={{fontSize: 60 }} />
  },
  {
    id: 2,
    title: "Labels",
    description: "Task labels",
    navigateTo: "/labels",
    color: "#E8F5E9",
    icon: <CategoryIcon sx={{ fontSize: 60 }} />
  },
  {
    id: 3,
    title: "AI Helper",
    description: "Break down work",
    // navigateTo: "/aiHelper",
    color: "#FFF3E0",
    isAI: true,
    icon: <SmartToyIcon sx={{ fontSize: 60 }} />
  },
  {
    id: 4,
    title: "Performance",
    description: "Track progress",
    navigateTo: "/performance",
    color: "#FCE4EC",
    icon: <TrendingUpIcon sx={{ fontSize: 60 }} />
  }
];

function StackedCardsCarousel() {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [aiOpen, setAiOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);


  const prev = () =>
    setActive((prev) => (prev === 0 ? cards.length - 1 : prev - 1));

  const next = () =>
    setActive((prev) => (prev === cards.length - 1 ? 0 : prev + 1));

  const getPosition = (index) => {
    const diff = index - active;
    if (diff === 0) return "center";
    if (diff === -1 || diff === cards.length - 1) return "left";
    if (diff === 1 || diff === -(cards.length - 1)) return "right";
    return "hidden";
  };
  const handleAISubmit = async () => {
    if (!taskTitle) {
      alert("Please enter task title");
      return;
    }

    try {
      setLoading(true);
      const res = await suggestAssignee(taskTitle);
      setAiResult(res.data);
    } catch (err) {
      console.error(err);
      alert("AI failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="carousel-container">
      <IconButton className="nav-btn left" onClick={prev}>
        <ArrowBackIos />
      </IconButton>

      <Box className="cards-wrapper">
        {cards.map((card, index) => {
          const position = getPosition(index);

          return (
            <Box
              key={card.id}
              className={`card ${position}`}
              // sx={{ backgroundColor: card.color }}
              sx={{
                backgroundColor: isDark ? "#1e293b" : card.color,
                color: isDark ? "#fff" : "#000",
                boxShadow: isDark
                  ? "0 0 15px rgba(0,255,255,0.3)"
                  : "0 0 15px rgba(0,0,0,0.1)",
                backdropFilter: "blur(10px)",
              }}
              // onClick={() => navigate(card.navigateTo)}
              onClick={() => {
                if (card.isAI) {
                  setAiOpen(true);
                } else {
                  navigate(card.navigateTo);
                }
              }}
            >
              <Box sx={{ mb: 2 }}>
                {card.icon}
              </Box>
              <Typography variant="h5" fontWeight="bold">
                {card.title}
              </Typography>
              <Typography variant="body2">
                {card.description}
              </Typography>
            </Box>
            
          );
        })}
      </Box>
      <Dialog
        open={aiOpen}
        onClose={() => {
          setAiOpen(false);
          setAiResult(null);
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>🤖 AI Task Helper</DialogTitle>

        <DialogContent>
          <TextField
            label="Enter Task Title"
            fullWidth
            margin="normal"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleAISubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Analyze Task"}
          </Button>

          {aiResult && (
            <Box mt={3} p={2} sx={{ bgcolor: "#f5f5f5", borderRadius: 2 }}>
              <Typography variant="h6">
                Suggested User: {aiResult.suggestedUser}
              </Typography>

              <Typography mt={1}>
                Estimated Time: {aiResult.estimatedTime}
              </Typography>

              <Typography mt={1} color="text.secondary">
                {aiResult.reason}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setAiOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <IconButton className="nav-btn right" onClick={next}>
        <ArrowForwardIos />
      </IconButton>
    </Box>
    
  );
}

export default StackedCardsCarousel;
