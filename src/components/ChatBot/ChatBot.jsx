import React, { useState, useRef, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Box, 
  Typography, 
  Button, 
  Avatar, 
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Paper
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useChat } from '../../context/ChatContext';
import { format } from 'date-fns';

const ChatBot = () => {
  const {
    sessions,
    currentSession,
    messages,
    loading,
    createSession,
    selectSession,
    sendMessage,
    updateSessionTitle,
    removeSession,
    clearCurrentSession
  } = useChat();

  const [inputValue, setInputValue] = useState('');
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const [newSessionTitle, setNewSessionTitle] = useState('');
  const [editingSession, setEditingSession] = useState(null);
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

    // 如果没有当前会话，创建一个新会话
    if (!currentSession) {
      try {
        await createSession();
      } catch (error) {
        console.error('Failed to create session:', error);
        return;
      }
    }

    setInputValue('');
    await sendMessage(content);
  };

  // 回车发送
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSendMessage();
    }
  };

  // 创建新会话
  const handleCreateSession = async () => {
    try {
      await createSession(newSessionTitle || '新对话');
      setNewSessionTitle('');
      setShowSessionDialog(false);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  // 编辑会话标题
  const handleEditSession = async () => {
    if (!editingSession) return;
    try {
      await updateSessionTitle(editingSession.id, editingSession.title);
      setEditingSession(null);
    } catch (error) {
      console.error('Failed to update session title:', error);
    }
  };

  // 删除会话
  const handleDeleteSession = async (sessionId) => {
    if (window.confirm('确定要删除这个会话吗？')) {
      try {
        await removeSession(sessionId);
      } catch (error) {
        console.error('Failed to delete session:', error);
      }
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="90vh" p={2}>
      <Card sx={{ 
        width: '100%', 
        maxWidth: 1200, 
        height: '90vh', 
        display: 'flex', 
        flexDirection: 'row',
        boxShadow: 6, 
        borderRadius: 3 
      }}>
        {/* 左侧会话列表 */}
        <Box sx={{ 
          width: 300, 
          borderRight: '1px solid #eee',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* 会话列表标题 */}
          <Box sx={{ 
            p: 2, 
            borderBottom: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="h6">对话列表</Typography>
            <IconButton onClick={() => setShowSessionDialog(true)} size="small">
              <AddIcon />
            </IconButton>
          </Box>
          
          {/* 会话列表 */}
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            {sessions.length === 0 ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  暂无对话，点击上方按钮创建新对话
                </Typography>
              </Box>
            ) : (
              <List>
                {sessions.map((session) => (
                  <ListItem key={session.id} disablePadding>
                    <ListItemButton
                      selected={currentSession?.id === session.id}
                      onClick={() => selectSession(session.id)}
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <ListItemText
                          primary={session.title}
                          secondary={session.updated_at ? format(new Date(session.updated_at), 'MM-dd HH:mm') : ''}
                          primaryTypographyProps={{ noWrap: true }}
                          secondaryTypographyProps={{ noWrap: true }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingSession(session);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSession(session.id);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Box>

        {/* 右侧聊天区域 */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* 聊天标题 */}
          <Box sx={{ 
            p: 2, 
            borderBottom: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="h6">
              {currentSession?.title || '选择或创建新对话'}
            </Typography>
            {currentSession && (
              <Button 
                variant="outlined" 
                size="small"
                onClick={clearCurrentSession}
              >
                清空
              </Button>
            )}
          </Box>

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
            }}
          >
            {messages.length === 0 && !currentSession && (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <SmartToyIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  欢迎使用AI助手
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  直接输入消息即可开始新的对话
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  我可以帮你分析交易数据、识别欺诈风险、解释金融概念等
                </Typography>
              </Box>
            )}
            
            {messages.map((msg, idx) => (
              <Box key={idx} display="flex" alignItems="flex-end" mb={1} flexDirection={msg.role === 'user' ? 'row-reverse' : 'row'}>
                <Avatar sx={{ 
                  bgcolor: msg.role === 'user' ? 'primary.main' : 'grey.300', 
                  ml: msg.role === 'user' ? 2 : 0, 
                  mr: msg.role === 'user' ? 0 : 2 
                }}>
                  {msg.role === 'user' ? <PersonIcon /> : <SmartToyIcon color="primary" />}
                </Avatar>
                <Box
                  sx={{
                    bgcolor: msg.role === 'user' ? 'primary.main' : 'grey.200',
                    color: msg.role === 'user' ? 'white' : 'black',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    maxWidth: '70%',
                    wordBreak: 'break-word',
                    fontSize: '1rem',
                  }}
                >
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                    {msg.content}
                  </Typography>
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
            borderTop: '1px solid #eee'
          }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="请输入消息..."
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              size="small"
            />
            <Button 
              variant="contained" 
              onClick={handleSendMessage} 
              disabled={loading || !inputValue.trim()}
            >
              发送
            </Button>
          </Box>
        </Box>
      </Card>

      {/* 创建新会话对话框 */}
      <Dialog open={showSessionDialog} onClose={() => setShowSessionDialog(false)}>
        <DialogTitle>创建新对话</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="对话标题"
            fullWidth
            variant="outlined"
            value={newSessionTitle}
            onChange={e => setNewSessionTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreateSession()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSessionDialog(false)}>取消</Button>
          <Button onClick={handleCreateSession} variant="contained">创建</Button>
        </DialogActions>
      </Dialog>

      {/* 编辑会话标题对话框 */}
      <Dialog open={!!editingSession} onClose={() => setEditingSession(null)}>
        <DialogTitle>编辑对话标题</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="对话标题"
            fullWidth
            variant="outlined"
            value={editingSession?.title || ''}
            onChange={e => setEditingSession(prev => ({ ...prev, title: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && handleEditSession()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingSession(null)}>取消</Button>
          <Button onClick={handleEditSession} variant="contained">保存</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChatBot; 