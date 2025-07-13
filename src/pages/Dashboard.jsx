import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import PeopleIcon from '@mui/icons-material/People';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ChatIcon from '@mui/icons-material/Chat';
import ChatBot from '../components/ChatBot/ChatBot';
import Profile from '../components/Profile/Profile';
import Transaction from '../components/Transaction/Transaction';
import FraudReporting from './FraudReporting';

const drawerWidth = 220;

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { key: 'manageUsers', label: 'Profile', icon: <PeopleIcon /> },
  { key: 'transactionManagement', label: 'Transaction', icon: <AccountBalanceWalletIcon /> },
  { key: 'fraudReporting', label: 'Report', icon: <ReportProblemIcon /> },
  { key: 'chatbot', label: 'Chat', icon: <ChatIcon /> },
];

const Dashboard = () => {
  // 新增：侧边栏宽度和拖拽状态
  const [sidebarWidth, setSidebarWidth] = useState(drawerWidth);
  const [isResizing, setIsResizing] = useState(false);
  // 修复：补回 activeView 的 useState 定义
  const [activeView, setActiveView] = useState('dashboard');

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  const handleMouseDown = (e) => {
    setIsResizing(true);
  };

  const handleMouseMove = (e) => {
    if (!isResizing) return;
    const newWidth = e.clientX;
    if (newWidth > 150 && newWidth < 500) {
      setSidebarWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const renderContent = () => {
    switch (activeView) {
      case 'manageUsers':
        return <Profile />;
      case 'transactionManagement':
        return <Transaction />;
      case 'fraudReporting':
        return <FraudReporting />;
      case 'chatbot':
        return (
          <Box mt={4} display="flex" justifyContent="center">
            <ChatBot />
          </Box>
        );
      case 'dashboard':
      default:
        return (
          <Box mt={4}>
            <Typography variant="h4" gutterBottom align="center">Welcome to the Dashboard!</Typography>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} md={4}>
                <Card sx={{ boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6">Display 1</Typography>
                    <Typography color="text.secondary">Add your first display content</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6">Display 2</Typography>
                    <Typography color="text.secondary">Add your second display content</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6">Display 3</Typography>
                    <Typography color="text.secondary">Add your third display content</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #e0e7ff 0%, #f5f5f5 100%)' }}>
      <AppBar position="fixed" sx={{ zIndex: 1201, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Financial System Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: sidebarWidth, boxSizing: 'border-box', background: '#fff', position: 'relative' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.key} disablePadding>
                <ListItemButton selected={activeView === item.key} onClick={() => handleViewChange(item.key)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
        {/* 拖拽条 */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '6px',
            height: '100%',
            cursor: 'col-resize',
            zIndex: 1300,
            background: isResizing ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.05)',
            transition: 'background 0.2s',
            '&:hover': { background: 'rgba(0,0,0,0.15)' },
          }}
          onMouseDown={handleMouseDown}
        />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 0, pl: 1}}>
        <Toolbar />
        {renderContent()}
      </Box>
    </Box>
  );
};

export default Dashboard;