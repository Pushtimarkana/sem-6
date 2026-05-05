import { useState ,useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { motion, AnimatePresence } from "framer-motion";
import AddIcon from "@mui/icons-material/Add";
import api from "../../api/axios";

function AIChatPanel({ open, onClose }) {

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const sendMessage = async () => {
    if (!input) return;

    const newMessages = [
      ...messages,
      { role: "user", text: input }
    ];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("question", input);

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const res = await api.post("/ai/chat-with-file", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setMessages([
        ...newMessages,
        { role: "ai", text: res.data.answer }
      ]);

      setSelectedFile(null);
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "ai", text: "AI error occurred." }
      ]);
    }

    setLoading(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed",
            right: 20,
            bottom: 90,
            zIndex: 1400
          }}
        >
          <Paper
            sx={{
              width: 360,
              height: 500,
              display: "flex",
              flexDirection: "column",
              borderRadius: 4,
              boxShadow: 6,
              overflow: "hidden"
            }}
          >

            {/* Header */}
            <Box
              sx={{
                p: 2,
                bgcolor: "primary.main",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <SmartToyIcon />
                <Typography fontWeight="bold">
                  AI Assistant
                </Typography>
              </Box>

              <IconButton onClick={onClose} sx={{ color: "white" }}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Messages */}
            <Box sx={{ flex: 1, p: 2, overflowY: "auto" }}>
              {messages.map((msg, i) => (
                <Box
                  key={i}
                  sx={{
                    mb: 2,
                    textAlign: msg.role === "user" ? "right" : "left"
                  }}
                >
                  <Typography
                    sx={{
                      display: "inline-block",
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor:
                        msg.role === "user"
                          ? "primary.light"
                          : "grey.200"
                    }}
                  >
                    {msg.text}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Input */}
            {/* <Box sx={{ p: 1, display: "flex", gap: 1 }}>
              <input
                type="file"
                accept=".txt,.pdf,.docx"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />

              <TextField
                fullWidth
                size="small"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about project..."
              />

              <IconButton onClick={sendMessage} disabled={loading}>
                <SendIcon />
              </IconButton>
            </Box> */}

            <Box sx={{ p: 1, display: "flex", alignItems: "center", gap: 1 }}>

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept=".txt,.pdf,.docx"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />

              {/* + Button */}
              <IconButton
                onClick={() => fileInputRef.current.click()}
                sx={{
                  bgcolor: "grey.200",
                  "&:hover": { bgcolor: "grey.300" }
                }}
              >
                <AddIcon />
              </IconButton>

              {/* Text Field */}
              <TextField
                fullWidth
                size="small"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about project..."
              />

              {/* Send Button */}
              <IconButton onClick={sendMessage} disabled={loading}>
                <SendIcon />
              </IconButton>

            </Box>

          </Paper>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AIChatPanel;