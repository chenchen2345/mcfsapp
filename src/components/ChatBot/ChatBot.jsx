import React, { useState, useRef, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Box, 
  Typography, 
  Button, 
  Avatar, 
  CircularProgress,
  TextField,
  Alert,
  Paper
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';

const ChatBot = () => {
  const {
    messages,
    loading,
    sendMessage,
    clearMessages
  } = useChat();

  const { user } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  // 滚动到底部
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 发送消息
  const handleSendMessage = async () => {
    const content = inputValue.trim();
    if (!content) return;

    setInputValue('');
    await sendMessage(content);
  };

  // 回车发送
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSendMessage();
    }
  };

  return (
    <Box 
      sx={{ 
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        boxSizing: 'border-box'
      }}
    >
      <Card sx={{ 
        width: '100%', 
        maxWidth: 1000, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        boxShadow: 6, 
        borderRadius: 3,
        mx: 'auto'
      }}>
        {/* 聊天标题 */}
        <Box sx={{ 
          p: 2, 
          borderBottom: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          flexShrink: 0
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SmartToyIcon />
            <Typography variant="h6">AI 金融助手</Typography>
          </Box>
          <Button 
            variant="outlined" 
            size="small"
            onClick={clearMessages}
            sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
          >
            清空对话
          </Button>
        </Box>

        {/* 未登录提示 */}
        {!user && (
          <Alert severity="info" sx={{ m: 2, flexShrink: 0 }}>
            请先登录后再使用聊天功能
          </Alert>
        )}

        {/* 消息记录区 */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 3,
            background: '#f9f9f9',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            minHeight: 0 // 确保flex子元素可以收缩
          }}
        >
          {messages.length === 0 && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <SmartToyIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                欢迎使用AI金融助手
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                我可以帮你分析交易数据、识别欺诈风险、解释金融概念等
              </Typography>
              <Typography variant="body2" color="text.secondary">
                直接输入消息即可开始对话
              </Typography>
            </Box>
          )}
          
          {messages.map((msg, idx) => (
            <Box key={idx} display="flex" alignItems="flex-start" mb={2} flexDirection={msg.role === 'user' ? 'row-reverse' : 'row'}>
              <Avatar sx={{ 
                bgcolor: msg.role === 'user' ? 'primary.main' : 'grey.300', 
                ml: msg.role === 'user' ? 2 : 0, 
                mr: msg.role === 'user' ? 0 : 2,
                mt: 0.5,
                flexShrink: 0
              }}>
                {msg.role === 'user' ? <PersonIcon /> : <SmartToyIcon color="primary" />}
              </Avatar>
              <Box
                sx={{
                  maxWidth: '70%',
                  wordBreak: 'break-word',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                {/* 显示思考过程（如果有） */}
                {msg.role === 'assistant' && msg.thought && (
                  <Paper
                    sx={{
                      p: 1.5,
                      bgcolor: 'rgba(0,0,0,0.03)',
                      borderRadius: 1,
                      border: '1px solid rgba(0,0,0,0.1)',
                      maxWidth: '100%'
                    }}
                  >
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontWeight: 'bold', 
                        color: 'text.secondary',
                        display: 'block',
                        mb: 0.5
                      }}
                    >
                      思考过程:
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        whiteSpace: 'pre-wrap', 
                        lineHeight: 1.4, 
                        color: 'text.secondary',
                        fontSize: '0.875rem'
                      }}
                    >
                      {msg.thought}
                    </Typography>
                  </Paper>
                )}
                
                {/* 显示回复内容 */}
                <Box
                  sx={{
                    bgcolor: msg.role === 'user' ? 'primary.main' : 'white',
                    color: msg.role === 'user' ? 'white' : 'black',
                    px: 2,
                    py: 1.5,
                    borderRadius: 2,
                    border: msg.role === 'user' ? 'none' : '1px solid #e0e0e0',
                    boxShadow: msg.role === 'user' ? 'none' : '0 1px 3px rgba(0,0,0,0.1)',
                    wordBreak: 'break-word',
                    fontSize: '1rem',
                  }}
                >
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                    {msg.content}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
          
          {loading && (
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Avatar sx={{ bgcolor: 'grey.300', mr: 2 }}>
                <SmartToyIcon color="primary" />
              </Avatar>
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">助手正在输入…</Typography>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* 输入区 */}
        <Box sx={{ 
          p: 3, 
          display: 'flex', 
          gap: 1, 
          alignItems: 'center', 
          background: '#fafafa', 
          borderTop: '1px solid #eee',
          flexShrink: 0
        }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={user ? "请输入消息..." : "请先登录..."}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading || !user}
            size="small"
          />
          <Button 
            variant="contained" 
            onClick={handleSendMessage} 
            disabled={loading || !inputValue.trim() || !user}
          >
            发送
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default ChatBot; 