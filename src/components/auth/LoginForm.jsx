import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Modal from '../common/Modal';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(username, password);
      history.push('/dashboard');
    } catch (err) {
      // Map backend error messages to user-friendly text
      let msg = err?.message || err?.details || 'Invalid username or password';
      if (msg.includes('username error') || msg.includes('username has been existed')) {
        msg = 'The username is incorrect or already exists.';
      } else if (msg.includes('password error')) {
        msg = 'The password is incorrect.';
      } else if (msg.includes('Invalid Input')) {
        msg = 'Please check your input.';
      } else if (msg.includes('Invalid username or password')) {
        msg = 'Invalid username or password.';
      } else if (msg.includes('length must be between')) {
        msg = 'Username or password length is invalid.';
      }
      setError(msg);
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <Modal isOpen={showErrorModal} onClose={() => setShowErrorModal(false)} error={error} errorTitle="Login Error" top={true} />
      <div className="form-group">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>
      <div className="form-footer">
        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;