import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import './Login.css';  // 我们需要创建这个CSS文件

const Login = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <h1>Welcome Back</h1>
          <p className="subtitle">Please sign in to continue</p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;