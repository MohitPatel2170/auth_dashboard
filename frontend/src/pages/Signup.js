import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', form);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.msg || err.response?.data?.errors?.join(', ') || 'Error signing up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-md-6 offset-md-3">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input 
          className="form-control mb-2" 
          name="name" 
          placeholder="Name" 
          onChange={handleChange} 
          required 
        />
        <input 
          className="form-control mb-2" 
          name="email" 
          type="email" 
          placeholder="Email" 
          onChange={handleChange} 
          required 
        />
        <input 
          className="form-control mb-2" 
          name="password" 
          type="password" 
          placeholder="Password (min 6 characters)" 
          onChange={handleChange} 
          required 
          minLength={6}
        />
        <button className="btn btn-success" disabled={loading}>
          {loading ? 'Signing up...' : 'Signup'}
        </button>
      </form>
    </div>
  );
}

export default Signup;