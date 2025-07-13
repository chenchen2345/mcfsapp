import React from "react";
import { Card, Box } from "@mui/material";
import ChatBot from "../components/ChatBot/ChatBot";

const Chat = () => (
  <Box
    sx={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      height: "calc(100vh - 64px)", // 假设顶栏高度64px
      marginLeft: "240px", // 假设侧边栏宽度240px
      background: "#f5f6fa",
      padding: 2,
    }}
  >
    <Card
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        boxShadow: 3,
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <ChatBot />
    </Card>
  </Box>
);

export default Chat; 