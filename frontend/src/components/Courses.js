import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Courses = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [reports, setReports] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showLectures, setShowLectures] = useState(false);
  const [formData, setFormData] = useState({
    course_name: '',
    course_code: '',
    stream: user.stream || 'BIT',
    assigned_lecturer_id: ''
  });

  useEffect(() => {
    fetchCourses();
    if (user.role === 'program_leader') {
      fetchLecturers();
    }
    if (user.role === 'principal_lecturer') {
      fetchReports();
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/courses', {
        params: { stream: user.stream, userRole: user.role }
      });
      setCourses(response.data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      alert('Failed to load courses: ' + (error.response?.data?.error || error.message));
    }
  };

  const fetchLecturers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/lecturers');
      setLecturers(response.data);
    } catch (error) {
      console.error('Failed to fetch lecturers:', error);
    }
  };

  const fetchReports = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reports', {
        params: { userRole: user.role, userId: user.id, stream: user.stream }
      });
      setReports(response.data);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/courses', {
        ...formData,
        created_by: user.id
      });
      alert('Course created successfully!');
      setShowForm(false);
      setFormData({
        course_name: '',
        course_code: '',
        stream: user.stream || 'BIT',
        assigned_lecturer_id: ''
      });
      fetchCourses();
    } catch (error) {
      alert('Failed to create course: ' + (error.response?.data?.error || error.message));
    }
  };

  const viewCourseLectures = (course) => {
    setSelectedCourse(course);
    setShowLectures(true);
  };

  const getCourseReports = (courseCode) => {
    return reports.filter(report => report.course_code === courseCode);
  };

  const getLecturerReports = (lecturerName) => {
    return reports.filter(report => report.lecturer_name === lecturerName);
  };

  if (showLectures && selectedCourse) {
    const courseReports = getCourseReports(selectedCourse.course_code);
    
    return (
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <button 
                className="btn btn-outline-secondary"
                onClick={() => setShowLectures(false)}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Back to Courses
              </button>
              <h4 className="mb-0">Lectures for {selectedCourse.course_name}</h4>
              <div></div>
            </div>

            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  <i className="bi bi-book me-2"></i>
                  {selectedCourse.course_name} ({selectedCourse.course_code})
                </h5>
              </div>
              <div className="card-body">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <p><strong>Course Code:</strong> {selectedCourse.course_code}</p>
                    <p><strong>Stream:</strong> {selectedCourse.stream}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Assigned Lecturer:</strong> {selectedCourse.lecturer_name || 'Not assigned'}</p>
                    <p><strong>Total Lectures:</strong> {courseReports.length}</p>
                  </div>
                </div>

                {courseReports.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-journal-x display-1 text-muted"></i>
                    <h5 className="mt-3">No lectures found</h5>
                    <p className="text-muted">No reports have been submitted for this course yet.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Class</th>
                          <th>Lecturer</th>
                          <th>Date</th>
                          <th>Week</th>
                          <th>Attendance</th>
                          <th>Topic</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {courseReports.map((report) => (
                          <tr key={report.id}>
                            <td>
                              <span className="badge bg-info">{report.class_name}</span>
                            </td>
                            <td>{report.lecturer_name}</td>
                            <td>{new Date(report.date_of_lecture).toLocaleDateString()}</td>
                            <td>{report.week_of_reporting}</td>
                            <td>
                              {report.actual_students_present}/{report.total_registered_students}
                              <span className={`badge ${(report.actual_students_present / report.total_registered_students) > 0.7 ? 'bg-success' : 'bg-warning'} ms-1`}>
                                {Math.round((report.actual_students_present / report.total_registered_students) * 100)}%
                              </span>
                            </td>
                            <td>
                              <small className="text-truncate d-inline-block" style={{maxWidth: '200px'}}>
                                {report.topic_taught}
                              </small>
                            </td>
                            <td>
                              <button 
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => window.location.href = `/reports`}
                              >
                                View Details
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

            {/* Lecturer Performance Summary */}
            {courseReports.length > 0 && (
              <div className="card shadow mt-4">
                <div className="card-header bg-light">
                  <h6 className="mb-0">
                    <i className="bi bi-graph-up me-2"></i>
                    Lecturer Performance Summary
                  </h6>
                </div>
                <div className="card-body">
                  <div className="row">
                    {Array.from(new Set(courseReports.map(r => r.lecturer_name))).map(lecturer => {
                      const lecturerReports = getLecturerReports(lecturer);
                      const avgAttendance = lecturerReports.reduce((acc, report) => 
                        acc + (report.actual_students_present / report.total_registered_students), 0) / lecturerReports.length;
                      
                      return (
                        <div key={lecturer} className="col-md-6 mb-3">
                          <div className="card">
                            <div className="card-body">
                              <h6 className="card-title">{lecturer}</h6>
                              <div className="row text-center">
                                <div className="col-4">
                                  <div className="text-primary fw-bold">{lecturerReports.length}</div>
                                  <small className="text-muted">Lectures</small>
                                </div>
                                <div className="col-4">
                                  <div className={`fw-bold ${avgAttendance > 0.7 ? 'text-success' : 'text-warning'}`}>
                                    {Math.round(avgAttendance * 100)}%
                                  </div>
                                  <small className="text-muted">Avg Attendance</small>
                                </div>
                                <div className="col-4">
                                  <div className="text-info fw-bold">
                                    {Array.from(new Set(lecturerReports.map(r => r.class_name))).length}
                                  </div>
                                  <small className="text-muted">Classes</small>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                <i className="bi bi-book me-2"></i>
                {user.role === 'principal_lecturer' ? 'Courses & Lectures Overview' : 'Courses Management'}
              </h4>
              {user.role === 'program_leader' && (
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowForm(!showForm)}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Add Course
                </button>
              )}
            </div>

            {user.role === 'program_leader' && showForm && (
              <div className="card-body border-bottom">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Course Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.course_name}
                        onChange={(e) => setFormData({...formData, course_name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Course Code</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.course_code}
                        onChange={(e) => setFormData({...formData, course_code: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Stream</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.stream}
                        onChange={(e) => setFormData({...formData, stream: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-2 mb-3">
                      <label className="form-label">Assign Lecturer</label>
                      <select
                        className="form-select"
                        value={formData.assigned_lecturer_id}
                        onChange={(e) => setFormData({...formData, assigned_lecturer_id: e.target.value})}
                      >
                        <option value="">Select Lecturer</option>
                        {lecturers.map(lecturer => (
                          <option key={lecturer.id} value={lecturer.id}>
                            {lecturer.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-success">
                      Create Course
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="card-body">
              {courses.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-book display-1 text-muted"></i>
                  <h5 className="mt-3">No courses found</h5>
                  <p className="text-muted">
                    {user.role === 'program_leader' 
                      ? 'Create your first course to get started' 
                      : 'No courses available in your stream'
                    }
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Course Code</th>
                        <th>Course Name</th>
                        <th>Stream</th>
                        <th>Assigned Lecturer</th>
                        {user.role === 'principal_lecturer' && (
                          <>
                            <th>Total Lectures</th>
                            <th>Actions</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map(course => {
                        const courseReports = getCourseReports(course.course_code);
                        
                        return (
                          <tr key={course.id}>
                            <td>
                              <strong>{course.course_code}</strong>
                            </td>
                            <td>{course.course_name}</td>
                            <td>
                              <span className="badge bg-info">{course.stream}</span>
                            </td>
                            <td>
                              {course.lecturer_name || 'Not assigned'}
                            </td>
                            {user.role === 'principal_lecturer' && (
                              <>
                                <td>
                                  <span className="badge bg-primary">{courseReports.length}</span>
                                </td>
                                <td>
                                  <button 
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => viewCourseLectures(course)}
                                    disabled={courseReports.length === 0}
                                  >
                                    <i className="bi bi-eye me-1"></i>
                                    View Lectures
                                  </button>
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;