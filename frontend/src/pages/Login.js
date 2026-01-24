import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setToken }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token); 
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.msg || 'Error logging in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-md-6 offset-md-3">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
          placeholder="Password" 
          onChange={handleChange} 
          required 
        />
        <button className="btn btn-primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default Login;