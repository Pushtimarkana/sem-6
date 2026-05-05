import { Box, Typography, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import LockIcon from "@mui/icons-material/Lock";
import BlockIcon from "@mui/icons-material/Block";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { motion } from "framer-motion";

function ErrorPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // const storedStatus = localStorage.getItem("errorStatus");
  // const status = storedStatus ? Number(storedStatus) : 404;
  const query = new URLSearchParams(location.search);
  const status = Number(query.get("code")) || 404;

  // clear after reading
  if (query) {
    localStorage.removeItem("errorStatus");
  }

  let title = "";
  let message = "";
  let icon = null;
  let primaryButtonText = "";
  let primaryAction = () => {};

  switch (status) {
    case 401:
      title = "401 - Unauthorized";
      message = "Your session has expired or you are not logged in.";
      icon = <LockIcon sx={{ fontSize: 100, color: "warning.main" }} />;
      primaryButtonText = "Go to Login";
      primaryAction = () => navigate("/login");
      break;

    case 403:
      title = "403 - Forbidden";
      message = "You do not have permission to access this page.";
      icon = <BlockIcon sx={{ fontSize: 100, color: "error.main" }} />;
      primaryButtonText = "Go to Dashboard";
      primaryAction = () => navigate("/dashboard");
      break;

    case 500:
      title = "500 - Server Error";
      message = "Something went wrong on the server.";
      icon = <ReportProblemIcon sx={{ fontSize: 100, color: "error.dark" }} />;
      primaryButtonText = "Reload Page";
      primaryAction = () => window.location.reload();
      break;

    default:
      title = "404 - Page Not Found";
      message = "The page you are looking for does not exist.";
      icon = <ErrorOutlineIcon sx={{ fontSize: 100, color: "error.main" }} />;
      primaryButtonText = "Go to Dashboard";
      primaryAction = () => navigate("/dashboard");
  }

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        px: 2
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.div>

      <Typography variant="h3" fontWeight="bold" mt={3}>
        {title}
      </Typography>

      <Typography color="text.secondary" mt={2}>
        {message}
      </Typography>

      <Box mt={4} display="flex" gap={2}>
        {/* Back button only for 404 */}
        {status === 404 && (
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        )}

        <Button variant="contained" onClick={primaryAction}>
          {primaryButtonText}
        </Button>
      </Box>
    </Box>
  );
}

export default ErrorPage;