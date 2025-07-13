import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Box } from "@mui/material";

const MainLayout = ({ children }) => {
  const [sidebarWidth, setSidebarWidth] = useState(240);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar sidebarWidth={sidebarWidth} setSidebarWidth={setSidebarWidth} />
      <Box sx={{ flex: 1, ml: `${sidebarWidth}px`, display: "flex", flexDirection: "column" }}>
        <Topbar />
        <Box sx={{ flex: 1, overflow: "auto" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;