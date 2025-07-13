import React, { useEffect, useState } from 'react';
import { getUserInfo } from '../services/api';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const UserManagement = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getUserInfo();
        setUserInfo(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch user info');
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, []);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : userInfo ? (
        <Card sx={{ minWidth: 320, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
              User Profile
            </Typography>
            <Typography variant="body1" color="text.primary" sx={{ mb: 1 }}>
              <strong>Username:</strong> {userInfo.username}
            </Typography>
            <Typography variant="body1" color="text.primary">
              <strong>Email:</strong> {userInfo.email}
            </Typography>
          </CardContent>
        </Card>
      ) : null}
    </Box>
  );
};

export default UserManagement;