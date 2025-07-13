import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import TransactionManagement from './pages/TransactionManagement';
import FraudReporting from './pages/FraudReporting';
import ProtectedRoute from './components/auth/ProtectedRoute';

function AppRoutes() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/user-management" component={UserManagement} />
      <ProtectedRoute path="/transaction-management" component={TransactionManagement} />
      <ProtectedRoute path="/fraud-reporting" component={FraudReporting} />
      <Route path="/" exact>
        <Redirect to="/login" />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;