import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api'; // Make sure to import your login function
import logo from '../assets/smartGrowerLogo.png';
import './Login.css'; // Import the CSS file for animations

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const userData = { email, password };
    try {
      const data = await loginUser(userData);
      localStorage.setItem('token', data.token);
      navigate('/home');
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Invalid email or password. Please try again.');
    }
  };

  const navigateToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="flex flex-col items-center justify-center mt-28 bg-gray-100">
      <form
        onSubmit={submitHandler}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <img src={logo} alt="Logo" className="mb-4 animate-logo" />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <label className="w-full">
          <p className="mb-1 text-sm text-gray-700">
            Email Address <sup className="text-red-500">*</sup>
          </p>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            className="form-style w-full border rounded-lg p-2"
          />
        </label>
        <label className="relative w-full mt-4">
          <p className="mb-1 text-sm text-gray-700">
            Password <sup className="text-red-500">*</sup>
          </p>
          <input
            required
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            className="form-style w-full border rounded-lg p-2 pr-10"
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-16 z-10 cursor-pointer"
          >
            {showPassword ? (
              <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
            ) : (
              <AiOutlineEye fontSize={24} fill="#AFB2BF" />
            )}
          </span>
        </label>
        <button
          type="submit"
          className="mt-6 w-full bg-gradient-to-r from-gray-400 to-gray-800 text-white py-2 rounded-lg text-lg font-semibold"
        >
          Sign In
        </button>
        <button
          onClick={navigateToRegister}
          className="mt-4 w-full bg-gradient-to-r from-gray-800 to-gray-400 text-white py-2 rounded-lg text-lg font-semibold"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Login;
