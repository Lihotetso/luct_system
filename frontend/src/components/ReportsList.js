import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FeedbackSystem from './FeedbackSystem';

const ReportsList = ({ user }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [filterStream, setFilterStream] = useState(user.stream || '');

  useEffect(() => {
    fetchReports();
  }, [user, filterStream]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/reports', {
        params: {
          userRole: user.role,
          userId: user.id,
          stream: user.role === 'principal_lecturer' ? filterStream : undefined
        }
      });
      setReports(response.data);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      alert('Failed to load reports: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchReportDetails = async (reportId) => {
    try {
      setDetailLoading(true);
      const response = await axios.get(`http://localhost:5000/api/reports/${reportId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch report details:', error);
      throw error;
    } finally {
      setDetailLoading(false);
    }
  };

  const viewReportDetails = async (report) => {
    try {
      setDetailLoading(true);
      const reportDetails = await fetchReportDetails(report.id);
      setSelectedReport(reportDetails);
      setShowDetails(true);
    } catch (error) {
      alert('Failed to load report details: ' + (error.response?.data?.error || error.message));
    } finally {
      setDetailLoading(false);
    }
  };

  const handleFeedbackAdded = () => {
    fetchReports();
  };

  const filteredReports = reports.filter(report =>
    report.course_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.lecturer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.class_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.course_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAttendanceColor = (present, total) => {
    const percentage = (present / total) * 100;
    if (percentage >= 80) return 'bg-success';
    if (percentage >= 60) return 'bg-warning';
    return 'bg-danger';
  };

  const getFeedbackCount = (report) => {
    // This would ideally come from the API, but for now we'll show a placeholder
    return report.feedback_count || 0;
  };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-center align-items-center" style={{minHeight: '50vh'}}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" style={{width: '3rem', height: '3rem'}} role="status">
              <span className="visually-hidden">Loading reports...</span>
            </div>
            <h5 className="text-muted">Loading Reports...</h5>
          </div>
        </div>
      </div>
    );
  }

  if (showDetails && selectedReport) {
    return (
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <button 
                className="btn btn-outline-secondary"
                onClick={() => setShowDetails(false)}
                disabled={detailLoading}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Back to Reports List
              </button>
              <h4 className="mb-0 text-primary">
                {user.role === 'principal_lecturer' ? 'Review Report & Add Feedback' : 'Report Details'}
              </h4>
              <div></div>
            </div>

            {detailLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Loading report details...</span>
                </div>
                <p className="text-muted">Loading report details...</p>
              </div>
            ) : (
              <div className="card shadow-lg">
                <div className="card-header bg-primary text-white">
                  <div className="row align-items-center">
                    <div className="col">
                      <h5 className="mb-1">
                        <i className="bi bi-journal-text me-2"></i>
                        {selectedReport.course_name} - {selectedReport.class_name}
                      </h5>
                      <p className="mb-0 opacity-75">
                        {selectedReport.course_code} • {selectedReport.lecturer_name}
                      </p>
                    </div>
                    <div className="col-auto">
                      <span className="badge bg-light text-dark fs-6">
                        {selectedReport.week_of_reporting}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="card-body">
                  {/* Report Summary */}
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <strong className="text-primary">Lecturer:</strong>
                        <p className="mb-0 fs-5">{selectedReport.lecturer_name}</p>
                      </div>
                      <div className="mb-3">
                        <strong className="text-primary">Date of Lecture:</strong>
                        <p className="mb-0">
                          {new Date(selectedReport.date_of_lecture).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="mb-3">
                        <strong className="text-primary">Faculty:</strong>
                        <p className="mb-0">{selectedReport.faculty_name}</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <strong className="text-primary">Attendance:</strong>
                        <p className="mb-0 fs-5">
                          {selectedReport.actual_students_present} / {selectedReport.total_registered_students}
                          <span className={`badge ${getAttendanceColor(selectedReport.actual_students_present, selectedReport.total_registered_students)} ms-2`}>
                            {Math.round((selectedReport.actual_students_present / selectedReport.total_registered_students) * 100)}%
                          </span>
                        </p>
                      </div>
                      <div className="mb-3">
                        <strong className="text-primary">Venue & Time:</strong>
                        <p className="mb-0">
                          {selectedReport.venue} at {selectedReport.scheduled_time}
                        </p>
                      </div>
                      <div className="mb-3">
                        <strong className="text-primary">Report Created:</strong>
                        <p className="mb-0">
                          {new Date(selectedReport.created_at).toLocaleDateString()} by {selectedReport.creator_name}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Teaching Content */}
                  <div className="row">
                    <div className="col-12">
                      <div className="card mb-4">
                        <div className="card-header bg-light">
                          <h6 className="mb-0">
                            <i className="bi bi-book me-2 text-primary"></i>
                            Teaching Content
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="mb-4">
                            <h6 className="text-primary">Topic Taught</h6>
                            <p className="mb-0" style={{whiteSpace: 'pre-wrap'}}>
                              {selectedReport.topic_taught}
                            </p>
                          </div>
                          
                          <div className="mb-4">
                            <h6 className="text-primary">Learning Outcomes</h6>
                            <p className="mb-0" style={{whiteSpace: 'pre-wrap'}}>
                              {selectedReport.learning_outcomes}
                            </p>
                          </div>
                          
                          {selectedReport.lecturer_recommendations && (
                            <div>
                              <h6 className="text-primary">Lecturer Recommendations</h6>
                              <p className="mb-0" style={{whiteSpace: 'pre-wrap'}}>
                                {selectedReport.lecturer_recommendations}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Feedback System - Highlighted for Principal Lecturer */}
                  {user.role === 'principal_lecturer' && (
                    <div className="alert alert-info">
                      <i className="bi bi-info-circle me-2"></i>
                      <strong>Principal Lecturer Access:</strong> You can provide feedback on this report to help improve teaching quality.
                    </div>
                  )}
                  
                  <FeedbackSystem 
                    report={selectedReport} 
                    user={user}
                    onFeedbackAdded={handleFeedbackAdded}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
              <div>
                <h4 className="mb-0 text-primary">
                  <i className="bi bi-journal-text me-2"></i>
                  {user.role === 'principal_lecturer' ? 'All Lecture Reports - Review & Feedback' : 'Lecture Reports'}
                </h4>
                <p className="text-muted mb-0 mt-1">
                  {filteredReports.length} report(s) found
                  {user.role === 'principal_lecturer' && ` in ${filterStream} stream`}
                </p>
              </div>
              
              <div className="d-flex gap-3">
                {user.role === 'principal_lecturer' && (
                  <select 
                    className="form-select"
                    value={filterStream}
                    onChange={(e) => setFilterStream(e.target.value)}
                    style={{width: '200px'}}
                  >
                    <option value="BIT">BIT Stream</option>
                    <option value="BSc">BSc Stream</option>
                    <option value="Diploma">Diploma Stream</option>
                  </select>
                )}
                
                <div className="search-box">
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-search text-muted"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search reports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button 
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setSearchTerm('')}
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card-body">
              {filteredReports.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-inbox display-1 text-muted mb-3"></i>
                  <h5 className="text-muted">No reports found</h5>
                  <p className="text-muted">
                    {searchTerm ? 'Try adjusting your search terms' : 'No reports have been submitted yet'}
                  </p>
                  {user.role === 'lecturer' && (
                    <a href="/reports/new" className="btn btn-primary mt-2">
                      <i className="bi bi-plus-circle me-2"></i>
                      Create Your First Report
                    </a>
                  )}
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover table-striped">
                    <thead className="table-light">
                      <tr>
                        <th>Course & Code</th>
                        <th>Class</th>
                        <th>Lecturer</th>
                        <th>Date & Week</th>
                        <th>Attendance</th>
                        <th>Venue</th>
                        {user.role === 'principal_lecturer' && <th>Your Feedback</th>}
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReports.map((report) => (
                        <tr key={report.id}>
                          <td>
                            <div>
                              <strong className="d-block">{report.course_name}</strong>
                              <small className="text-muted">{report.course_code}</small>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-info">{report.class_name}</span>
                          </td>
                          <td>
                            <div>
                              <strong>{report.lecturer_name}</strong>
                              {report.created_by === user.id && (
                                <span className="badge bg-success ms-1" title="You created this report">
                                  <i className="bi bi-person-check"></i>
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            <div>
                              <strong>{new Date(report.date_of_lecture).toLocaleDateString()}</strong>
                              <br />
                              <small className="text-muted">{report.week_of_reporting}</small>
                            </div>
                          </td>
                          <td>
                            <div>
                              {report.actual_students_present}/{report.total_registered_students}
                              <span className={`badge ${getAttendanceColor(report.actual_students_present, report.total_registered_students)} ms-1`}>
                                {Math.round((report.actual_students_present / report.total_registered_students) * 100)}%
                              </span>
                            </div>
                          </td>
                          <td>
                            <small>{report.venue}</small>
                            <br />
                            <small className="text-muted">{report.scheduled_time}</small>
                          </td>
                          {user.role === 'principal_lecturer' && (
                            <td>
                              {getFeedbackCount(report) > 0 ? (
                                <span className="badge bg-success">
                                  <i className="bi bi-check-circle me-1"></i>
                                  Feedback Provided
                                </span>
                              ) : (
                                <span className="badge bg-warning">
                                  <i className="bi bi-exclamation-circle me-1"></i>
                                  Needs Review
                                </span>
                              )}
                            </td>
                          )}
                          <td>
                            <button 
                              className="btn btn-primary btn-sm"
                              onClick={() => viewReportDetails(report)}
                              title={user.role === 'principal_lecturer' ? "Review report and add feedback" : "View report details"}
                            >
                              <i className="bi bi-eye me-1"></i> 
                              {user.role === 'principal_lecturer' ? 'Review' : 'View'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Principal Lecturer Statistics */}
          {user.role === 'principal_lecturer' && filteredReports.length > 0 && (
            <div className="row mt-4">
              <div className="col-md-3">
                <div className="card text-white bg-primary">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{filteredReports.length}</h4>
                        <p className="mb-0">Total Reports</p>
                      </div>
                      <i className="bi bi-journal-text display-6 opacity-75"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-white bg-success">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">
                          {Array.from(new Set(filteredReports.map(r => r.lecturer_name))).length}
                        </h4>
                        <p className="mb-0">Lecturers</p>
                      </div>
                      <i className="bi bi-people display-6 opacity-75"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-white bg-warning">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">
                          {Array.from(new Set(filteredReports.map(r => r.course_name))).length}
                        </h4>
                        <p className="mb-0">Courses</p>
                      </div>
                      <i className="bi bi-book display-6 opacity-75"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-white bg-info">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">
                          {Math.round(filteredReports.reduce((acc, report) => 
                            acc + (report.actual_students_present / report.total_registered_students), 0) / filteredReports.length * 100)}%
                        </h4>
                        <p className="mb-0">Avg Attendance</p>
                      </div>
                      <i className="bi bi-graph-up display-6 opacity-75"></i>
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

export default ReportsList;