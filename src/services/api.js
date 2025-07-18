import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// 创建axios实例，添加请求拦截器来添加token
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：添加token到请求头
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：处理token过期
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      // Only redirect if not already on login or register page
      const path = window.location.pathname;
      if (!['/login', '/register'].includes(path)) {
        window.location.href = '/login';
      }
      // If on login/register, just reject so error modal can show
    }
    return Promise.reject(error);
  }
);

export const register = async (username, password, email) => {
  try {
    const response = await api.post('/auth/register', { username, password, email });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const login = async (username, password) => {
  try {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getUserInfo = async () => {
  try {
    const response = await api.get('/user/info');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const fetchUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};



export const reportFraud = async (fraudData) => {
  try {
    const response = await api.post('/fraud-reports', fraudData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Transaction APIs
export const fetchTransactions = async (params = {}) => {
  try {
    const response = await api.get('/transactions', { params });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getTransaction = async (id) => {
  try {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const createTransaction = async (transactionData) => {
  try {
    const response = await api.post('/transactions', transactionData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const updateTransaction = async (id, transactionData) => {
  try {
    const response = await api.put(`/transactions/${id}`, transactionData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteTransaction = async (id) => {
  try {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const importTransactions = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/transactions/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    // 提取详细的错误信息
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      let errorMessage = 'Import failed';
      
      if (errorData.details) {
        errorMessage += `: ${errorData.details}`;
      } else if (errorData.message) {
        errorMessage += `: ${errorData.message}`;
      }
      
      // 如果有错误代码，也显示出来
      if (errorData.code) {
        errorMessage += ` (Code: ${errorData.code})`;
      }
      
      throw new Error(errorMessage);
    } else if (error.message) {
      throw new Error(`Import failed: ${error.message}`);
    } else {
      throw new Error('Import failed: Unknown error occurred');
    }
  }
};

// Fraud Report APIs
export const fetchFraudReports = async (params = {}) => {
  try {
    const response = await api.get('/fraud-reports', { params });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getFraudReport = async (id) => {
  try {
    const response = await api.get(`/fraud-reports/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getFraudReportByTransaction = async (transactionId) => {
  try {
    const response = await api.get(`/fraud-reports/transaction/${transactionId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const createFraudReport = async (fraudReportData) => {
  try {
    const response = await api.post('/fraud-reports', fraudReportData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const updateFraudReport = async (id, fraudReportData) => {
  try {
    const response = await api.put(`/fraud-reports/${id}`, fraudReportData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteFraudReport = async (id) => {
  try {
    const response = await api.delete(`/fraud-reports/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const generateFraudReport = async (transactionId) => {
  try {
    const response = await api.post(`/fraud-reports/generate/${transactionId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Direct Chat API with LLM
export const sendDirectChatMessage = async (prompt, model = 'qwen-turbo') => {
  try {
    console.log('Sending direct chat message:', { prompt, model }); // 调试信息
    const response = await api.post('/chat', {
      prompt: prompt,
      model: model
    });
    console.log('Direct chat response:', response); // 调试信息
    return response.data;
  } catch (error) {
    console.error('Direct chat error:', error); // 调试信息
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      let errorMessage = '发送消息失败';
      
      if (errorData.details) {
        errorMessage += `: ${errorData.details}`;
      } else if (errorData.message) {
        errorMessage += `: ${errorData.message}`;
      }
      
      if (errorData.code) {
        errorMessage += ` (错误代码: ${errorData.code})`;
      }
      
      throw new Error(errorMessage);
    } else {
      throw new Error(`发送消息失败: ${error.message}`);
    }
  }
};