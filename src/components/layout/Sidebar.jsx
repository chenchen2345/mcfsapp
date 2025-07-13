import React, { useRef, useEffect } from "react";
import { Drawer, Box } from "@mui/material";

const MIN_WIDTH = 180;
const MAX_WIDTH = 400;

const Sidebar = ({ sidebarWidth, setSidebarWidth, children }) => {
  const dragging = useRef(false);

  const handleMouseDown = (e) => {
    dragging.current = true;
    document.body.style.cursor = "col-resize";
  };

  const handleMouseMove = (e) => {
    if (!dragging.current) return;
    let newWidth = e.clientX;
    if (newWidth < MIN_WIDTH) newWidth = MIN_WIDTH;
    if (newWidth > MAX_WIDTH) newWidth = MAX_WIDTH;
    setSidebarWidth(newWidth);
  };

  const handleMouseUp = () => {
    dragging.current = false;
    document.body.style.cursor = "";
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  });

  return (
    <Drawer
      variant="permanent"
      PaperProps={{
        sx: { width: sidebarWidth, transition: "width 0.2s" }
      }}
    >
      <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
        {children}
        {/* 拖拽条 */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 6,
            height: "100%",
            cursor: "col-resize",
            zIndex: 10,
            background: "rgba(0,0,0,0.05)",
            "&:hover": { background: "rgba(0,0,0,0.15)" }
          }}
          onMouseDown={handleMouseDown}
        />
      </Box>
    </Drawer>
  );
};

export default Sidebar;