import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FeedbackSystem = ({ report, user, onFeedbackAdded }) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (report && report.id) {
      fetchFeedbacks();
    }
  }, [report]);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/feedback/report/${report.id}`);
      setFeedbacks(response.data);
    } catch (error) {
      console.error('Failed to fetch feedbacks:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/feedback', {
        report_id: report.id,
        principal_lecturer_id: user.id,
        feedback_text: feedbackText
      });

      if (response.data.feedback) {
        setFeedbacks(prev => [response.data.feedback, ...prev]);
      } else {
        // Refetch all feedbacks if the response doesn't include the new feedback
        await fetchFeedbacks();
      }

      setFeedbackText('');
      setShowForm(false);
      if (onFeedbackAdded) {
        onFeedbackAdded();
      }
      alert('Feedback added successfully!');
    } catch (error) {
      alert('Failed to add feedback: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const canAddFeedback = user.role === 'principal_lecturer' || user.role === 'program_leader';

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>
          <i className="bi bi-chat-left-text me-2"></i>
          Feedback ({feedbacks.length})
        </h5>
        {canAddFeedback && (
          <button 
            className={`btn btn-sm ${showForm ? 'btn-secondary' : 'btn-primary'}`}
            onClick={() => setShowForm(!showForm)}
            disabled={loading}
          >
            {showForm ? (
              <>
                <i className="bi bi-x-circle me-1"></i>
                Cancel
              </>
            ) : (
              <>
                <i className="bi bi-plus-circle me-1"></i>
                Add Feedback
              </>
            )}
          </button>
        )}
      </div>

      {showForm && (
        <div className="card mb-3">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">
                  <strong>Your Feedback</strong>
                </label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Provide constructive feedback about this report..."
                  required
                />
              </div>
              <div className="d-flex gap-2">
                <button 
                  type="submit" 
                  className="btn btn-success"
                  disabled={loading || !feedbackText.trim()}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      Submit Feedback
                    </>
                  )}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowForm(false);
                    setFeedbackText('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {feedbacks.length === 0 ? (
        <div className="text-center py-4">
          <i className="bi bi-chat-left-text display-4 text-muted"></i>
          <p className="text-muted mt-2">No feedback yet</p>
          {canAddFeedback && !showForm && (
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => setShowForm(true)}
            >
              Be the first to add feedback
            </button>
          )}
        </div>
      ) : (
        <div className="feedback-list">
          {feedbacks.map((feedback) => (
            <div key={feedback.id} className="card mb-2">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <strong>{feedback.principal_lecturer_name}</strong>
                    {feedback.role && (
                      <span className="badge bg-info ms-2">
                        {feedback.role.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                  <small className="text-muted">
                    {new Date(feedback.created_at).toLocaleString()}
                  </small>
                </div>
                <p className="mb-0">{feedback.feedback_text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackSystem;