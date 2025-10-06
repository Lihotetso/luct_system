import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ user, logout }) => {
  const location = useLocation();

  const getRoleDisplayName = (role) => {
    const roleMap = {
      student: 'Student',
      lecturer: 'Lecturer',
      principal_lecturer: 'Principal Lecturer',
      program_leader: 'Program Leader'
    };
    return roleMap[role] || role;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/dashboard">
          <i className="bi bi-journal-text me-2"></i>
          LUCT Reporting System
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`} 
                to="/dashboard"
              >
                <i className="bi bi-speedometer2 me-1"></i>
                Dashboard
              </Link>
            </li>
            
            {/* Student & Lecturer Modules */}
            {(user.role === 'student' || user.role === 'lecturer') && (
              <>
                {user.role === 'lecturer' && (
                  <li className="nav-item">
                    <Link 
                      className={`nav-link ${location.pathname === '/reports/new' ? 'active' : ''}`} 
                      to="/reports/new"
                    >
                      <i className="bi bi-plus-circle me-1"></i>
                      New Report
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${location.pathname === '/reports' ? 'active' : ''}`} 
                    to="/reports"
                  >
                    <i className="bi bi-list-ul me-1"></i>
                    Reports
                  </Link>
                </li>
              </>
            )}

            {/* Principal Lecturer Modules */}
            {user.role === 'principal_lecturer' && (
              <>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${location.pathname === '/courses' ? 'active' : ''}`} 
                    to="/courses"
                  >
                    <i className="bi bi-book me-1"></i>
                    Courses
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${location.pathname === '/reports' ? 'active' : ''}`} 
                    to="/reports"
                  >
                    <i className="bi bi-journal-text me-1"></i>
                    Reports
                  </Link>
                </li>
              </>
            )}

            {/* Program Leader Modules */}
            {user.role === 'program_leader' && (
              <>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${location.pathname === '/courses' ? 'active' : ''}`} 
                    to="/courses"
                  >
                    <i className="bi bi-book me-1"></i>
                    Courses
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${location.pathname === '/reports' ? 'active' : ''}`} 
                    to="/reports"
                  >
                    <i className="bi bi-journal-text me-1"></i>
                    Reports
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${location.pathname === '/classes' ? 'active' : ''}`} 
                    to="/classes"
                  >
                    <i className="bi bi-people me-1"></i>
                    Classes
                  </Link>
                </li>
              </>
            )}

            {/* Common Modules for All Roles */}
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/monitoring' ? 'active' : ''}`} 
                to="/monitoring"
              >
                <i className="bi bi-graph-up me-1"></i>
                Monitoring
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/rating' ? 'active' : ''}`} 
                to="/rating"
              >
                <i className="bi bi-star me-1"></i>
                Rating
              </Link>
            </li>

            {/* Additional Modules for Lecturer & Principal Lecturer */}
            {(user.role === 'lecturer' || user.role === 'principal_lecturer') && (
              <li className="nav-item">
                <Link 
                  className={`nav-link ${location.pathname === '/classes' ? 'active' : ''}`} 
                  to="/classes"
                >
                  <i className="bi bi-people me-1"></i>
                  Classes
                </Link>
              </li>
            )}
          </ul>
          
          <div className="navbar-nav">
            <span className="navbar-text me-3">
              <i className="bi bi-person-circle me-1"></i>
              {user.name} ({getRoleDisplayName(user.role)})
            </span>
            <button className="btn btn-outline-light btn-sm" onClick={logout}>
              <i className="bi bi-box-arrow-right me-1"></i>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;