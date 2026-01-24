import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/profile', config);
      setProfile(res.data.user);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching profile:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const handleChange = e => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleUpdate = async e => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:5000/api/profile', profile, config);
      alert('Profile updated successfully!');
      setEditMode(false);
      fetchProfile();
    } catch (err) {
      alert(err.response?.data?.msg || 'Error updating profile');
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title mb-4">My Profile</h2>
              
              {!editMode ? (
                <>
                  <div className="mb-3">
                    <strong>Name:</strong> {profile.name}
                  </div>
                  <div className="mb-3">
                    <strong>Email:</strong> {profile.email}
                  </div>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => setEditMode(true)}
                  >
                    Edit Profile
                  </button>
                </>
              ) : (
                <form onSubmit={handleUpdate}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-success me-2">
                    Save Changes
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setEditMode(false);
                      fetchProfile();
                    }}
                  >
                    Cancel
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;