import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ReportForm from './components/ReportForm';
import ReportsList from './components/ReportsList';
import Monitoring from './components/Monitoring';
import Rating from './components/Rating';
import Courses from './components/Courses';
import Classes from './components/Classes';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {user && <Navbar user={user} logout={logout} />}
        <Routes>
          <Route 
            path="/login" 
            element={!user ? <Login onLogin={login} /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/register" 
            element={!user ? <Register onLogin={login} /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/reports/new" 
            element={user ? <ReportForm user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/reports" 
            element={user ? <ReportsList user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/monitoring" 
            element={user ? <Monitoring user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/rating" 
            element={user ? <Rating user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/courses" 
            element={user ? <Courses user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/classes" 
            element={user ? <Classes user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/" 
            element={<Navigate to={user ? "/dashboard" : "/login"} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;