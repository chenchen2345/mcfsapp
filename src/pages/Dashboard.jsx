import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import ChatBot from '../components/ChatBot/ChatBot';
import './Dashboard.css';
// import { Outlet } from 'react-router-dom';

const Dashboard = () => {
  const [activeView, setActiveView] = useState('dashboard'); // 添加状态管理

  // 处理视图切换的函数
  const handleViewChange = (view) => {
    setActiveView(view);
  };

  // 渲染不同的内容视图
  const renderContent = () => {
    switch (activeView) {
      case 'manageUsers':
        return (
          <div className="manage-users-view">
            <h2>Manage Users</h2>
            {/* 用户管理相关的内容 */}
          </div>
        );
      case 'transactionManagement':
        return (
          <div className="transaction-management-view">
            <h2>Transaction Management</h2>
            {/* 交易管理相关的内容 */}
          </div>
        );
      case 'fraudReporting':
        return (
          <div className="fraud-reporting-view">
            <h2>Fraud Reporting</h2>
            {/* 欺诈报告相关的内容 */}
          </div>
        );
      case 'dashboard':
      default:
        return (
          <>
            <h1>Welcome to the Dashboard!</h1>
            <div className="functional-displays">
              <div className="display-card">
                <h2>Display 1</h2>
                {/* Add your first display content */}
              </div>
              <div className="display-card">
                <h2>Display 2</h2>
                {/* Add your second display content */}
              </div>
              <div className="display-card">
                <h2>Display 3</h2>
                {/* Add your third display content */}
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="dashboard">
      <Topbar />
      <div className="dashboard-content">
        <Sidebar onViewChange={handleViewChange} activeView={activeView} />
        <main className="dashboard-main">
          {renderContent()}
        </main>
      </div>
      <ChatBot />
    </div>
  );
};

export default Dashboard;