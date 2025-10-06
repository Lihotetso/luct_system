import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = ({ user }) => {
  const getRoleBasedContent = () => {
    switch (user.role) {
      case 'student':
        return {
          title: 'Student Dashboard',
          description: 'Monitor your classes and view reports',
          cards: [
            {
              title: 'View Reports',
              description: 'Access all lecture reports',
              icon: 'bi-list-ul',
              link: '/reports',
              color: 'primary'
            },
            {
              title: 'Monitoring',
              description: 'Track class performance',
              icon: 'bi-graph-up',
              link: '/monitoring',
              color: 'success'
            },
            {
              title: 'Rating',
              description: 'Rate lectures and courses',
              icon: 'bi-star',
              link: '/rating',
              color: 'warning'
            }
          ]
        };
      
      case 'lecturer':
        return {
          title: 'Lecturer Dashboard',
          description: 'Manage your classes and create reports',
          cards: [
            {
              title: 'Create Report',
              description: 'Submit new lecture report',
              icon: 'bi-plus-circle',
              link: '/reports/new',
              color: 'primary'
            },
            {
              title: 'My Reports',
              description: 'View and manage your reports',
              icon: 'bi-journal-text',
              link: '/reports',
              color: 'info'
            },
            {
              title: 'Classes',
              description: 'Manage your classes',
              icon: 'bi-people',
              link: '/classes',
              color: 'secondary'
            },
            {
              title: 'Monitoring',
              description: 'Monitor class attendance',
              icon: 'bi-graph-up',
              link: '/monitoring',
              color: 'success'
            },
            {
              title: 'Rating',
              description: 'View student ratings',
              icon: 'bi-star',
              link: '/rating',
              color: 'warning'
            }
          ]
        };
      
      case 'principal_lecturer':
        return {
          title: 'Principal Lecturer Dashboard',
          description: 'Oversee courses, review reports, and provide feedback',
          cards: [
            {
              title: 'Courses & Lectures',
              description: 'View all courses and lectures under your stream',
              icon: 'bi-book',
              link: '/courses',
              color: 'primary'
            },
            {
              title: 'Review Reports',
              description: 'View lecture reports and add feedback',
              icon: 'bi-journal-text',
              link: '/reports',
              color: 'info'
            },
            {
              title: 'Monitoring',
              description: 'Monitor faculty performance',
              icon: 'bi-graph-up',
              link: '/monitoring',
              color: 'success'
            },
            {
              title: 'Rating',
              description: 'View and manage ratings',
              icon: 'bi-star',
              link: '/rating',
              color: 'warning'
            },
            {
              title: 'Classes',
              description: 'View class information',
              icon: 'bi-people',
              link: '/classes',
              color: 'secondary'
            }
          ]
        };
      
      case 'program_leader':
        return {
          title: 'Program Leader Dashboard',
          description: 'Manage programs and assign modules',
          cards: [
            {
              title: 'Courses',
              description: 'Add and assign lecture modules',
              icon: 'bi-book',
              link: '/courses',
              color: 'primary'
            },
            {
              title: 'Reports',
              description: 'View reports from PRL',
              icon: 'bi-journal-text',
              link: '/reports',
              color: 'info'
            },
            {
              title: 'Monitoring',
              description: 'Monitor program performance',
              icon: 'bi-graph-up',
              link: '/monitoring',
              color: 'success'
            },
            {
              title: 'Classes',
              description: 'Manage class information',
              icon: 'bi-people',
              link: '/classes',
              color: 'secondary'
            },
            {
              title: 'Rating',
              description: 'View course ratings',
              icon: 'bi-star',
              link: '/rating',
              color: 'warning'
            }
          ]
        };
      
      default:
        return { title: 'Dashboard', description: '', cards: [] };
    }
  };

  const content = getRoleBasedContent();

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h3 mb-1">{content.title}</h1>
              <p className="text-muted mb-0">{content.description}</p>
            </div>
            <div className="text-end">
              <p className="mb-1">Welcome back, <strong>{user.name}</strong></p>
              <small className="text-muted">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </small>
            </div>
          </div>

          {/* Role-specific alerts */}
          {user.role === 'principal_lecturer' && (
            <div className="alert alert-info mb-4">
              <i className="bi bi-info-circle me-2"></i>
              <strong>Principal Lecturer Access:</strong> You can review all course lectures, provide feedback on reports, 
              and monitor teaching quality in your stream.
            </div>
          )}

          <div className="row">
            {content.cards.map((card, index) => (
              <div key={index} className="col-xl-3 col-md-6 mb-4">
                <Link to={card.link} className="text-decoration-none">
                  <div className={`card border-${card.color} shadow h-100 py-3`}>
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className={`text-xs font-weight-bold text-${card.color} text-uppercase mb-1`}>
                            {card.title}
                          </div>
                          <div className="h6 mb-0 text-gray-800">
                            {card.description}
                          </div>
                        </div>
                        <div className="col-auto">
                          <i className={`${card.icon} fa-2x text-${card.color}`}></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    <i className="bi bi-speedometer2 me-2"></i>
                    Quick Statistics
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row text-center">
                    <div className="col-md-3 mb-3">
                      <div className="stat-card card text-white bg-primary">
                        <div className="card-body">
                          <i className="bi bi-journal-text display-4"></i>
                          <h4 className="mt-2">24</h4>
                          <p className="mb-0">Total Reports</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 mb-3">
                      <div className="stat-card card text-white bg-success">
                        <div className="card-body">
                          <i className="bi bi-people display-4"></i>
                          <h4 className="mt-2">156</h4>
                          <p className="mb-0">Students</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 mb-3">
                      <div className="stat-card card text-white bg-warning">
                        <div className="card-body">
                          <i className="bi bi-person-badge display-4"></i>
                          <h4 className="mt-2">12</h4>
                          <p className="mb-0">Lecturers</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 mb-3">
                      <div className="stat-card card text-white bg-info">
                        <div className="card-body">
                          <i className="bi bi-book display-4"></i>
                          <h4 className="mt-2">8</h4>
                          <p className="mb-0">Courses</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Principal Lecturer Specific Content */}
          {user.role === 'principal_lecturer' && (
            <div className="row mt-4">
              <div className="col-12">
                <div className="card">
                  <div className="card-header bg-primary text-white">
                    <h5 className="card-title mb-0">
                      <i className="bi bi-star me-2"></i>
                      Principal Lecturer Responsibilities
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <h6>Course Oversight</h6>
                        <ul>
                          <li>Monitor all courses in your assigned stream</li>
                          <li>Review lecture delivery and content quality</li>
                          <li>Track course performance metrics</li>
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <h6>Report Review & Feedback</h6>
                        <ul>
                          <li>Provide constructive feedback on lecture reports</li>
                          <li>Monitor attendance and teaching effectiveness</li>
                          <li>Identify areas for improvement</li>
                        </ul>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-md-6">
                        <h6>Quality Assurance</h6>
                        <ul>
                          <li>Ensure teaching standards are maintained</li>
                          <li>Monitor learning outcomes achievement</li>
                          <li>Review lecturer recommendations</li>
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <h6>Performance Monitoring</h6>
                        <ul>
                          <li>Track class attendance trends</li>
                          <li>Monitor student engagement</li>
                          <li>Evaluate teaching methodologies</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;