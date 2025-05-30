import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { username, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const logout = async () => {
  try {
    await axios.post(`${API_URL}/auth/logout`);
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const fetchTransactions = async () => {
  try {
    const response = await axios.get(`${API_URL}/transactions`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const reportFraud = async (fraudData) => {
  try {
    const response = await axios.post(`${API_URL}/fraud/report`, fraudData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};