import axios from 'axios';

const CHAT_API_URL = 'https://api.example.com/chat'; // Replace with your chat API endpoint

export const sendMessageToChatAssistant = async (message) => {
  try {
    const response = await axios.post(CHAT_API_URL, { message });
    return response.data;
  } catch (error) {
    console.error('Error sending message to chat assistant:', error);
    throw error;
  }
};

export const getChatHistory = async () => {
  try {
    const response = await axios.get(CHAT_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
};

export const generateFraudReport = async (transactionId) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(
    `/api/fraud-reports/generate/${transactionId}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};