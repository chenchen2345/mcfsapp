import React, { createContext, useState, useContext } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message) => {
    setLoading(true);
    // Simulate sending a message to a chat assistant
    setTimeout(() => {
      setMessages((prevMessages) => [...prevMessages, { text: message, sender: 'user' }]);
      setLoading(false);
    }, 1000);
  };

  const receiveMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, { text: message, sender: 'assistant' }]);
  };

  return (
    <ChatContext.Provider value={{ messages, loading, sendMessage, receiveMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  return useContext(ChatContext);
};