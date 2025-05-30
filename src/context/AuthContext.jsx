import React, { createContext, useState, useContext } from 'react';
import { loginUser, logoutUser } from '../services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (username, password) => {
    // 这里直接设置用户为任意输入
    const userData = { username, token: 'dummy-token' };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    // 不抛出异常，始终成功
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};