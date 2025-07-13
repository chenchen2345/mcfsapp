import React, { createContext, useContext, useState, useEffect } from 'react';
import { sendDirectChatMessage } from '../services/api';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // 从localStorage获取用户信息
  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('User data from localStorage:', userData);
      
      if (userData && userData.user_id) {
        const userWithId = {
          ...userData,
          id: userData.user_id
        };
        setUser(userWithId);
      } else if (userData && userData.token) {
        console.log('User has token but no ID, attempting to refresh user info...');
        refreshUserInfo();
      } else {
        console.warn('No valid user data found in localStorage');
        setUser(null);
      }
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      setUser(null);
    }
  }, []);

  // 刷新用户信息的函数
  const refreshUserInfo = async () => {
    try {
      const { getUserInfo } = await import('../services/api');
      const userInfo = await getUserInfo();
      
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUserData = {
        ...userData,
        ...userInfo,
        id: userInfo.user_id
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      setUser(updatedUserData);
    } catch (error) {
      console.error('Failed to refresh user info:', error);
      setUser(null);
    }
  };

  // 发送消息
  const sendMessage = async (content) => {
    if (!content.trim()) return;

    // 检查用户是否登录
    if (!user?.id) {
      console.error('User not logged in or missing user ID');
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'assistant',
        content: '请先登录后再使用聊天功能。',
        created_at: new Date().toISOString()
      }]);
      return;
    }

    try {
      setLoading(true);
      
      // 添加用户消息到本地状态
      const userMessage = {
        id: Date.now(),
        role: 'user',
        content: content,
        created_at: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, userMessage]);

      // 发送消息到LLM API
      console.log('Sending message to LLM:', content);
      const response = await sendDirectChatMessage(content);
      
      console.log('LLM response:', response);
      
      // 解析双层JSON结构
      let thought = '';
      let responseContent = '';
      
      try {
        if (response.reply) {
          // 解析reply字段中的JSON字符串
          const parsedReply = JSON.parse(response.reply);
          thought = parsedReply.thought || '';
          responseContent = parsedReply.response || response.reply;
        } else {
          responseContent = '抱歉，我没有收到有效的回复。';
        }
      } catch (parseError) {
        console.error('Failed to parse reply JSON:', parseError);
        // 如果解析失败，直接使用原始回复
        responseContent = response.reply || '抱歉，我没有收到有效的回复。';
      }
      
      // 创建AI消息对象
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: responseContent,
        thought: thought, // 保存思考过程
        created_at: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Failed to send message:', error);
      
      // 添加错误消息
      let errorMessage = '发送消息失败，请稍后再试。';
      if (error.message) {
        errorMessage = `发送消息失败: ${error.message}`;
      }
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'assistant',
        content: errorMessage,
        created_at: new Date().toISOString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  // 清空消息历史
  const clearMessages = () => {
    setMessages([]);
  };

  const value = {
    messages,
    loading,
    user,
    sendMessage,
    clearMessages
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};