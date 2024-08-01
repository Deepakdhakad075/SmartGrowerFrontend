// src/components/Profile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaMoneyBillWave, FaMoneyBillAlt } from 'react-icons/fa'; // Importing icons
import profile from '../assets/profile.jpg'
import { getLabours } from '../api';
export const Profile = () => {
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [due,setDue]= useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming you store your JWT in localStorage
        if (!token) {
            navigate('/');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/users/profile`, config);
        const response = await  getLabours(token);
        console.log(response,"resssssssssssssssssss")
        setDue(response.
          totalDueAmountAllLabours);
          console.log(due,"dueee");
        setProfileData(data);
        setLoading(false);
      } catch (error) {
        setError(error.response ? error.response.data.message : error.message);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="flex items-center space-x-4">
        <img
          src={profile}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{profileData.name}</h1>
          <p className="text-gray-600">{profileData.email}</p>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        <div className="flex items-center space-x-2">
          <FaMoneyBillWave className="text-green-500" />
          <p className="text-lg font-medium text-gray-700">Total Paid: {profileData.totalPaid} ₹</p>
        </div>
        <div className="flex items-center space-x-2">
          <FaMoneyBillAlt className="text-red-500" />
          <p className="text-lg font-medium text-gray-700">Total Due: {due} ₹</p>
        </div>
        <div className="flex items-center space-x-2">
          <FaUser className="text-blue-500" />
          <p className="text-lg font-medium text-gray-700">Total Number of Laborers: {profileData.totalLabours}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
