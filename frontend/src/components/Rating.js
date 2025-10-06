import React, { useState } from 'react';

const Rating = ({ user }) => {
  const [ratings, setRatings] = useState([
    { id: 1, course: 'Web Development', lecturer: 'Dr. Smith', rating: 4.5, reviews: 23 },
    { id: 2, course: 'Database Systems', lecturer: 'Prof. Johnson', rating: 4.2, reviews: 18 },
    { id: 3, course: 'Networking', lecturer: 'Dr. Brown', rating: 4.8, reviews: 31 },
    { id: 4, course: 'Programming', lecturer: 'Ms. Davis', rating: 4.1, reviews: 15 },
    { id: 5, course: 'System Analysis', lecturer: 'Mr. Wilson', rating: 4.6, reviews: 27 },
  ]);

  const [newRating, setNewRating] = useState({
    course: '',
    lecturer: '',
    rating: 5,
    comment: ''
  });

  const handleSubmitRating = (e) => {
    e.preventDefault();
    alert('Rating submitted successfully!');
    setNewRating({
      course: '',
      lecturer: '',
      rating: 5,
      comment: ''
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i
        key={index}
        className={`bi ${index < rating ? 'bi-star-fill text-warning' : 'bi-star'}`}
      ></i>
    ));
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow mb-4">
            <div className="card-header bg-white">
              <h4 className="mb-0">
                <i className="bi bi-star me-2"></i>
                Course and Lecturer Ratings
              </h4>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Course</th>
                      <th>Lecturer</th>
                      <th>Rating</th>
                      <th>Reviews</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ratings.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <strong>{item.course}</strong>
                        </td>
                        <td>{item.lecturer}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            {renderStars(Math.floor(item.rating))}
                            <span className="ms-2">{item.rating.toFixed(1)}</span>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-info">{item.reviews} reviews</span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary">
                            <i className="bi bi-chat-left-text me-1"></i>
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow">
            <div className="card-header bg-white">
              <h5 className="mb-0">
                <i className="bi bi-plus-circle me-2"></i>
                Submit New Rating
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmitRating}>
                <div className="mb-3">
                  <label className="form-label">Course</label>
                  <select 
                    className="form-select"
                    value={newRating.course}
                    onChange={(e) => setNewRating({...newRating, course: e.target.value})}
                    required
                  >
                    <option value="">Select Course</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Database Systems">Database Systems</option>
                    <option value="Networking">Networking</option>
                    <option value="Programming">Programming</option>
                    <option value="System Analysis">System Analysis</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Lecturer</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newRating.lecturer}
                    onChange={(e) => setNewRating({...newRating, lecturer: e.target.value})}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Rating</label>
                  <div className="d-flex align-items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="btn btn-link p-1"
                        onClick={() => setNewRating({...newRating, rating: star})}
                      >
                        <i
                          className={`bi ${
                            star <= newRating.rating 
                              ? 'bi-star-fill text-warning' 
                              : 'bi-star text-muted'
                          } fs-4`}
                        ></i>
                      </button>
                    ))}
                    <span className="ms-2">{newRating.rating}.0</span>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Comment</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={newRating.comment}
                    onChange={(e) => setNewRating({...newRating, comment: e.target.value})}
                    placeholder="Share your experience with this course..."
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  <i className="bi bi-check-circle me-2"></i>
                  Submit Rating
                </button>
              </form>
            </div>
          </div>

          {/* Rating Summary */}
          <div className="card shadow mt-4">
            <div className="card-body text-center">
              <h5>Overall Satisfaction</h5>
              <div className="display-4 text-primary fw-bold">4.4</div>
              <div className="mb-2">
                {renderStars(4)}
                <i className="bi bi-star-half text-warning"></i>
              </div>
              <p className="text-muted">Based on 114 reviews</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rating;