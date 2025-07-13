import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  CircularProgress,
  Alert,
  Divider,
  Container,
  Button
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import { getUserInfo } from '../../services/api';

const AVATAR_CARD_WIDTH = 300;

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUserInfo();
        setUserInfo(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch user information');
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Card sx={{ minWidth: 320, maxWidth: 600, mx: 'auto', mt: 4 }}>
        <CardContent>
          <Alert severity="error">{error}</Alert>
        </CardContent>
      </Card>
    );
  }

  const handleLogout = () => {
    // 这里可以替换为实际的登出逻辑，如清除token、跳转登录页等
    // window.location.href = '/login';
    window.location.reload();
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 1200,
        mx: 'auto',
        mt: 3,
        mb: 3,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2, // 16px间距
      }}
    >
      {/* 头像卡片 */}
      <Card
        sx={{
          width: `${AVATAR_CARD_WIDTH}px`,
          minWidth: `${AVATAR_CARD_WIDTH}px`,
          maxWidth: `${AVATAR_CARD_WIDTH}px`,
          bgcolor: '#fff',
          boxShadow: 'none',
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 0,
        }}
      >
        <CardContent
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 0,
            pt: 6,
            pb: 6,
          }}
        >
          <Avatar
            sx={{
              width: 120,
              height: 120,
              bgcolor: 'primary.main',
              mb: 2,
              fontSize: '3rem',
            }}
          >
            <PersonIcon sx={{ fontSize: '3rem' }} />
          </Avatar>
          <Typography variant="h6" gutterBottom>
            {userInfo?.username || 'User'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {userInfo?.email || 'No email provided'}
          </Typography>
        </CardContent>
      </Card>
      {/* 信息卡片 */}
      <Card
        sx={{
          flex: 1,
          bgcolor: '#fff',
          boxShadow: 'none',
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          p: 0,
        }}
      >
        <CardContent
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            p: { xs: 2, sm: 4, md: 6 },
          }}
        >
          <Typography variant="h6" gutterBottom color="primary">
            User Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Username
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {userInfo?.username || 'Not available'}
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Email
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {userInfo?.email || 'Not available'}
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              User ID
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {userInfo?.id || 'Not available'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Account Status
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium', color: 'success.main' }}>
              Active
            </Typography>
          </Box>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" color="error" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
