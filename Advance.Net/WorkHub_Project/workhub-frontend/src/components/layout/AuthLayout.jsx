import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { Box } from "@mui/material";

function AuthLayout() {
  return (
    <Box sx={{ flexGrow: 1 }}>
        <Navbar />
        <Box sx={{ p: 3 }}>
         <Outlet />
        </Box>
      </Box>
  );
}

export default AuthLayout;
