import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReportForm = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    faculty_name: 'Faculty of Information Communication Technology',
    class_name: '',
    week_of_reporting: '',
    date_of_lecture: '',
    course_name: '',
    course_code: '',
    lecturer_name: user.name,
    actual_students_present: '',
    total_registered_students: '',
    venue: '',
    scheduled_time: '',
    topic_taught: '',
    learning_outcomes: '',
    lecturer_recommendations: ''
  });

  useEffect(() => {
    // Set current week
    const currentDate = new Date();
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
    const days = Math.floor((currentDate - startOfYear) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil(days / 7);
    setFormData(prev => ({
      ...prev,
      week_of_reporting: `Week ${weekNumber}`,
      date_of_lecture: currentDate.toISOString().split('T')[0]
    }));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/reports', {
        ...formData,
        created_by: user.id
      });
      alert('Report submitted successfully!');
      navigate('/reports');
    } catch (error) {
      alert('Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">
                <i className="bi bi-journal-plus me-2"></i>
                Lecturer Reporting Form
              </h4>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Faculty Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="faculty_name"
                      value={formData.faculty_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Class Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="class_name"
                      value={formData.class_name}
                      onChange={handleChange}
                      placeholder="e.g., BIT-1A"
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Week of Reporting</label>
                    <input
                      type="text"
                      className="form-control"
                      name="week_of_reporting"
                      value={formData.week_of_reporting}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Date of Lecture</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date_of_lecture"
                      value={formData.date_of_lecture}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Course Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="course_name"
                      value={formData.course_name}
                      onChange={handleChange}
                      placeholder="e.g., Web Development"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Course Code</label>
                    <input
                      type="text"
                      className="form-control"
                      name="course_code"
                      value={formData.course_code}
                      onChange={handleChange}
                      placeholder="e.g., ICT101"
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Lecturer Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="lecturer_name"
                      value={formData.lecturer_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Actual Students Present</label>
                    <input
                      type="number"
                      className="form-control"
                      name="actual_students_present"
                      value={formData.actual_students_present}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Total Registered Students</label>
                    <input
                      type="number"
                      className="form-control"
                      name="total_registered_students"
                      value={formData.total_registered_students}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Venue</label>
                    <input
                      type="text"
                      className="form-control"
                      name="venue"
                      value={formData.venue}
                      onChange={handleChange}
                      placeholder="e.g., Room 101"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Scheduled Time</label>
                    <input
                      type="time"
                      className="form-control"
                      name="scheduled_time"
                      value={formData.scheduled_time}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Topic Taught</label>
                  <textarea
                    className="form-control"
                    name="topic_taught"
                    value={formData.topic_taught}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Describe the topics covered in this lecture..."
                    required
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label">Learning Outcomes</label>
                  <textarea
                    className="form-control"
                    name="learning_outcomes"
                    value={formData.learning_outcomes}
                    onChange={handleChange}
                    rows="3"
                    placeholder="What were the key learning outcomes from this lecture?"
                    required
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="form-label">Lecturer Recommendations</label>
                  <textarea
                    className="form-control"
                    name="lecturer_recommendations"
                    value={formData.lecturer_recommendations}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Any recommendations or follow-up actions..."
                  ></textarea>
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button
                    type="button"
                    className="btn btn-secondary me-md-2"
                    onClick={() => navigate('/dashboard')}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Submit Report
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportForm;