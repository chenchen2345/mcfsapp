import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Assuming you have a CSS file for styling


const Sidebar = ({ onViewChange, activeView }) => {
  return (
    <div className="sidebar">
      <h2>User Management</h2>
      <nav>
        <ul className="sidebar-menu">
          <li>
            <button 
              onClick={() => onViewChange(activeView === 'manageUsers' ? 'dashboard' : 'manageUsers')}
              className={activeView === 'manageUsers' ? 'active' : ''}
            >
              Manage Users
            </button>
          </li>
          <li>
            <button 
              onClick={() => onViewChange(activeView === 'transactionManagement' ? 'dashboard' : 'transactionManagement')}
              className={activeView === 'transactionManagement' ? 'active' : ''}
            >
              Transaction Management
            </button>
          </li>
          <li>
            <button 
              onClick={() => onViewChange(activeView === 'fraudReporting' ? 'dashboard' : 'fraudReporting')}
              className={activeView === 'fraudReporting' ? 'active' : ''}
            >
              Fraud Reporting
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;