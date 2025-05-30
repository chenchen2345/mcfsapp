import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import TransactionManagement from './pages/TransactionManagement';
import FraudReporting from './pages/FraudReporting';
import ProtectedRoute from './components/auth/ProtectedRoute';

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <ProtectedRoute path="/dashboard" component={Dashboard} />
        <ProtectedRoute path="/user-management" component={UserManagement} />
        <ProtectedRoute path="/transaction-management" component={TransactionManagement} />
        <ProtectedRoute path="/fraud-reporting" component={FraudReporting} />
        <Route path="/" exact component={Login} />
      </Switch>
    </Router>
  );
};

export default Routes;