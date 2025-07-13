import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';
import './Login.css';  // 复用登录页面的样式

const Register = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <h1>Create Account</h1>
          <p className="subtitle">Please fill in the details to register</p>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Register; 