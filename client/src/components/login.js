import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import '../styles/loginSignUp.css';

function LogIn() {
  const navigate = useNavigate()
  const [form, setForm] = useState({});
  const [responseMessage, setResponseMessage] = useState('');

  function handleFormData(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const formData={
      ...form,
      page: "login"
    }
    try {
      const result = await axios.post('http://localhost:5000/api/login', formData);
      setResponseMessage(result.data.message);
      // alert(result.data.message);
      if(result.status === 200){
        localStorage.setItem('token', result.data.token);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error sending data:', error);
      alert('Login failed. please check your email and password');
    }
    console.log('Form data submitted:', form);
  }

  return (
    <div className="card-page">
      <div className="card-background"></div>
      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="form-header">
            Log In
          </div>
          <div className="form-body">
            <div>
            <span>Email: </span>
            <input
              type="email"
              name="email"
              onChange={handleFormData}
              value={form.email || ''}
            />
            </div>
            <div>
            <span>Password: </span>
            <input
              type="password"
              name="password"
              onChange={handleFormData}
              value={form.password || ''}
            />
            </div>
            <button className="form-submit">Log In</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LogIn;
