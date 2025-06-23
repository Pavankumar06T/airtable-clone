import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../index.css'; // Optional: for styling

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await axios.post('http://localhost:5001/api/auth/register', {
        name,
        email,
        password,
      });

      setMessage('✅ Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || '❌ Registration failed. Try again.';
      setError(errorMsg);
    }
  };

  return (
    <div className="centered-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        /><br />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        <button type="submit">Register</button>
      </form>

      {message && <p style={{ color: 'green' }}>{message}</p>}

      {error && (
        <div style={{ marginTop: '10px' }}>
          <p style={{ color: 'red' }}>{error}</p>
          {error.toLowerCase().includes('user already exists') && (
            <button
              onClick={() => navigate('/login')}
              style={{
                marginTop: '5px',
                padding: '8px 15px',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
              }}
            >
              Go to Login Page
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Register;