import React from "react";
import { Card, Box } from "@mui/material";
import ChatBot from "../components/ChatBot/ChatBot";

const Chat = () => (
  <Box
    sx={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      height: "calc(100vh - 64px)", // Assume topbar height is 64px
      marginLeft: "240px", // Assume sidebar width is 240px
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