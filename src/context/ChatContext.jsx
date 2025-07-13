import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createChatSession, 
  getUserChatSessions, 
  getChatSessionMessages, 
  sendChatMessage,
  updateChatSessionTitle,
  deleteChatSession
} from '../services/api';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // 从localStorage获取用户信息
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (userData.id) {
      setUser(userData);
      loadUserSessions(userData.id);
    }
  }, []);

  // 加载用户会话列表
  const loadUserSessions = async (userId) => {
    try {
      setLoading(true);
      const response = await getUserChatSessions(userId);
      setSessions(response.data || []);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  // 创建新会话
  const createSession = async (title = '新对话') => {
    if (!user?.id) return null;
    
    try {
      setLoading(true);
      const response = await createChatSession({
        user_id: user.id,
        title: title
      });
      
      const newSession = response.data;
      setSessions(prev => [newSession, ...prev]);
      setCurrentSession(newSession);
      setMessages([]);
      return newSession;
    } catch (error) {
      console.error('Failed to create session:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 选择会话
  const selectSession = async (sessionId) => {
    try {
      setLoading(true);
      const session = sessions.find(s => s.id === sessionId);
      if (session) {
        setCurrentSession(session);
        await loadSessionMessages(sessionId);
      }
    } catch (error) {
      console.error('Failed to select session:', error);
    } finally {
      setLoading(false);
    }
  };

  // 加载会话消息
  const loadSessionMessages = async (sessionId) => {
    try {
      const response = await getChatSessionMessages(sessionId);
      setMessages(response.data || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
      setMessages([]);
    }
  };

  // 发送消息
  const sendMessage = async (content) => {
    if (!content.trim()) return;

    try {
      setLoading(true);
      
      let sessionToUse = currentSession;
      
      // 如果没有当前会话，创建一个新会话
      if (!sessionToUse) {
        const newSession = await createSession();
        if (!newSession) {
          throw new Error('Failed to create session');
        }
        sessionToUse = newSession;
      }
      
      // 添加用户消息到本地状态
      const userMessage = {
        id: Date.now(),
        session_id: sessionToUse.id,
        role: 'user',
        content: content,
        created_at: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, userMessage]);

      // 发送消息到服务器
      const response = await sendChatMessage(sessionToUse.id, {
        session_id: sessionToUse.id,
        content: content
      });

      // 添加AI回复到本地状态
      const aiMessage = response.data;
      setMessages(prev => [...prev, aiMessage]);

      // 如果会话标题是默认的，尝试更新为新的标题
      if (sessionToUse.title === '新对话' && aiMessage) {
        // 重新加载会话列表以获取更新的标题
        await loadUserSessions(user.id);
      }

      // 更新会话列表中的最后更新时间
      setSessions(prev => 
        prev.map(s => 
          s.id === sessionToUse.id 
            ? { ...s, updated_at: aiMessage.created_at }
            : s
        )
      );

    } catch (error) {
      console.error('Failed to send message:', error);
      // 添加错误消息
      setMessages(prev => [...prev, {
        id: Date.now(),
        session_id: currentSession?.id || 0,
        role: 'assistant',
        content: '抱歉，发送消息失败，请稍后再试。',
        created_at: new Date().toISOString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  // 更新会话标题
  const updateSessionTitle = async (sessionId, title) => {
    try {
      await updateChatSessionTitle(sessionId, { title });
      setSessions(prev => 
        prev.map(s => 
          s.id === sessionId 
            ? { ...s, title }
            : s
        )
      );
      if (currentSession?.id === sessionId) {
        setCurrentSession(prev => ({ ...prev, title }));
      }
    } catch (error) {
      console.error('Failed to update session title:', error);
      throw error;
    }
  };

  // 删除会话
  const removeSession = async (sessionId) => {
    try {
      await deleteChatSession(sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      
      if (currentSession?.id === sessionId) {
        setCurrentSession(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
      throw error;
    }
  };

  // 清空当前会话
  const clearCurrentSession = () => {
    setCurrentSession(null);
    setMessages([]);
  };

  const value = {
    sessions,
    currentSession,
    messages,
    loading,
    user,
    createSession,
    selectSession,
    sendMessage,
    updateSessionTitle,
    removeSession,
    clearCurrentSession,
    loadUserSessions
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};