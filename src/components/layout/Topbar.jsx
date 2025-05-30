import React from 'react';
import { useAuth } from '../../context/AuthContext';
// import './Topbar.css'; // Assuming you have a CSS file for styling

const Topbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="topbar">
      <div className="topbar__user-info">
        <span>Welcome, {user ? user.username : 'Guest'}</span>
      </div>
      <button className="topbar__logout-button" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default Topbar;