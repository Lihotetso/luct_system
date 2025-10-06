import React from 'react';

const Monitoring = ({ user }) => {
  const monitoringData = [
    { course: 'Web Development', class: 'BIT-1A', attendance: 85, performance: 92, issues: 2 },
    { course: 'Database Systems', class: 'BIT-1B', attendance: 78, performance: 88, issues: 1 },
    { course: 'Networking', class: 'BIT-2A', attendance: 92, performance: 95, issues: 0 },
    { course: 'Programming', class: 'BIT-2B', attendance: 81, performance: 86, issues: 3 },
    { course: 'System Analysis', class: 'BIT-3A', attendance: 88, performance: 90, issues: 1 },
  ];

  const getPerformanceColor = (percentage) => {
    if (percentage >= 90) return 'success';
    if (percentage >= 80) return 'warning';
    return 'danger';
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="card shadow mb-4">
            <div className="card-header bg-white">
              <h4 className="mb-0">
                <i className="bi bi-graph-up me-2"></i>
                Course Monitoring Dashboard
              </h4>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Course</th>
                      <th>Class</th>
                      <th>Attendance Rate</th>
                      <th>Performance</th>
                      <th>Issues Reported</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monitoringData.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <strong>{item.course}</strong>
                        </td>
                        <td>{item.class}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="progress flex-grow-1 me-2" style={{ height: '8px' }}>
                              <div 
                                className={`progress-bar bg-${getPerformanceColor(item.attendance)}`}
                                style={{ width: `${item.attendance}%` }}
                              ></div>
                            </div>
                            <span>{item.attendance}%</span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge bg-${getPerformanceColor(item.performance)}`}>
                            {item.performance}%
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${item.issues > 0 ? 'bg-danger' : 'bg-success'}`}>
                            {item.issues} {item.issues === 1 ? 'issue' : 'issues'}
                          </span>
                        </td>
                        <td>
                          {item.performance >= 85 ? (
                            <span className="badge bg-success">
                              <i className="bi bi-check-circle me-1"></i>
                              On Track
                            </span>
                          ) : (
                            <span className="badge bg-warning">
                              <i className="bi bi-exclamation-triangle me-1"></i>
                              Needs Attention
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card shadow">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    <i className="bi bi-bar-chart me-2"></i>
                    Attendance Overview
                  </h5>
                </div>
                <div className="card-body">
                  <div className="text-center py-4">
                    <i className="bi bi-pie-chart display-1 text-primary"></i>
                    <p className="text-muted mt-3">
                      Attendance visualization chart would be displayed here
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card shadow">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    <i className="bi bi-activity me-2"></i>
                    Performance Trends
                  </h5>
                </div>
                <div className="card-body">
                  <div className="text-center py-4">
                    <i className="bi bi-graph-up-arrow display-1 text-success"></i>
                    <p className="text-muted mt-3">
                      Performance trends chart would be displayed here
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Monitoring;