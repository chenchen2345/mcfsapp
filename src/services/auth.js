import { login as apiLogin, register as apiRegister, getUserInfo } from './api';

export const loginUser = async (username, password) => {
  // Validate input
  if (!username || !password) {
    throw new Error('Username and password are required');
  }
  
  try {
    const response = await apiLogin(username, password);
    const userData = { 
      username, 
      token: response.token,
      ...response 
    };
  localStorage.setItem('user', JSON.stringify(userData));
  return userData;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (username, password, email) => {
  // Validate input
  if (!username || !password || !email) {
    throw new Error('Username, password and email are required');
  }
  
  try {
    const response = await apiRegister(username, password, email);
    return response;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem('user');
};

export const isAuthenticated = () => {
  const user = localStorage.getItem('user');
  return user !== null;
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};