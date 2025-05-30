import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <Topbar />
      <div className="layout-content">
        <Sidebar />
        <main>{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;