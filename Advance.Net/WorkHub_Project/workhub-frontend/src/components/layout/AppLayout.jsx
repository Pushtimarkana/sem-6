import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

function AppLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden"  }}>
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed}  />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" ,transition: "0.3s"}}>
        <Navbar />

        <Box sx={{flexGrow: 1, p: 3 ,overflowY: "auto",transition: "0.3s"}}>
          <Outlet/>
        </Box>
      </Box>
    </Box>
  );
}

export default AppLayout;
