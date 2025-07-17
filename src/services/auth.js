import { login as apiLogin, register as apiRegister, getUserInfo } from './api';

export const loginUser = async (username, password) => {
  // Validate input
  if (!username || !password) {
    throw new Error('Username and password are required');
  }
  
  try {
    const response = await apiLogin(username, password);
    // 先存 token，保证后续请求能带上
    localStorage.setItem('user', JSON.stringify({ username, token: response.token }));
    // 登录成功后，获取完整的用户信息
    const userInfo = await getUserInfo();
    const userData = { 
      username, 
      token: response.token,
      ...userInfo  // 包含用户ID和其他信息
    };
    // 再次覆盖 user，存完整信息
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