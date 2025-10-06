import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Classes = ({ user }) => {
  const [classes, setClasses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    class_name: '',
    stream: user.stream || 'BIT',
    total_students: ''
  });

  useEffect(() => {
    fetchClasses();
  }, [user]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/classes', {
        params: { stream: user.stream }
      });
      setClasses(response.data);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/classes', {
        ...formData,
        created_by: user.id
      });
      alert('Class created successfully!');
      setShowForm(false);
      setFormData({
        class_name: '',
        stream: user.stream || 'BIT',
        total_students: ''
      });
      fetchClasses();
    } catch (error) {
      alert('Failed to create class');
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                <i className="bi bi-people me-2"></i>
                Classes Management
              </h4>
              {(user.role === 'program_leader' || user.role === 'lecturer') && (
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowForm(!showForm)}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Add Class
                </button>
              )}
            </div>

            {(user.role === 'program_leader' || user.role === 'lecturer') && showForm && (
              <div className="card-body border-bottom">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Class Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.class_name}
                        onChange={(e) => setFormData({...formData, class_name: e.target.value})}
                        placeholder="e.g., BIT-1A"
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Stream</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.stream}
                        onChange={(e) => setFormData({...formData, stream: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Total Students</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.total_students}
                        onChange={(e) => setFormData({...formData, total_students: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-success">
                      Create Class
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
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Class Name</th>
                      <th>Stream</th>
                      <th>Total Students</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classes.map(cls => (
                      <tr key={cls.id}>
                        <td>
                          <strong>{cls.class_name}</strong>
                        </td>
                        <td>
                          <span className="badge bg-info">{cls.stream}</span>
                        </td>
                        <td>{cls.total_students}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-2">
                            View Details
                          </button>
                          {user.role === 'lecturer' && (
                            <button className="btn btn-sm btn-outline-success">
                              Create Report
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classes;