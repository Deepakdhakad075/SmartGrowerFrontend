import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const userData = { name, email, password };
    try {
      await registerUser(userData);
      navigate('/');
    } catch (error) {
      console.error('Error registering:', error);
      setError('Failed to register. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={submitHandler}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <label className="w-full">
          <p className="mb-1 text-sm text-gray-700">
            Name <sup className="text-red-500">*</sup>
          </p>
          <input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            className="form-style w-full border rounded-lg p-2"
          />
        </label>
        <label className="w-full mt-4">
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
        <label className="w-full mt-4">
          <p className="mb-1 text-sm text-gray-700">
            Password <sup className="text-red-500">*</sup>
          </p>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            className="form-style w-full border rounded-lg p-2"
          />
        </label>
        <button
          type="submit"
          className="mt-6 w-full bg-yellow-500 text-white py-2 rounded-lg"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
