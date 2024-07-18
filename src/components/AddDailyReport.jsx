import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addDailyReport } from '../api';

const AddDailyReport = ({ token }) => {
  const { id } = useParams(); // Get labour ID from URL params
  const [date, setDate] = useState('');
  const [numberofLabours, setNumberofLabours] = useState(1);
  
  const [workHours, setWorkHours] = useState('');
  const [rate, setRate] = useState('');
  const [description, setDescription] = useState('');
  const [dailyCharge, setDailyCharge] = useState('');
  const navigate = useNavigate();
  const submitHandler = async (e) => {
    e.preventDefault();
    const reportData = { date,numberofLabours, workHours, rate, description, dailyCharge };

    try {
      await addDailyReport(id, reportData, token);
      // Reset form data
      setDate('');
      setNumberofLabours(1);
      setWorkHours('');
      setRate('');
      setDescription('');
      setDailyCharge('');
      // Navigate to home page
      navigate('/home');
    } catch (error) {
      console.log('Failed to add daily report. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="md:text-2xl sm:text-xl text-xl font-bold mt-5 mb-4">Add Daily Report</h1>
      <form onSubmit={submitHandler} className="space-y-4">
        <div>
          <label className="block text-gray-700">Date</label>
          <input
            className="border p-2 w-full"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-gray-700">NumberOfLabours</label>
          <input
            className="border p-2 w-full"
            type="number"
            placeholder="TotalNumber Of Labours"
            value={numberofLabours}
            onChange={(e) => setNumberofLabours(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-gray-700">Work Hours</label>
          <input
            className="border p-2 w-full"
            type="number"
            placeholder="Work Hours"
            value={workHours}
            onChange={(e) => setWorkHours(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-gray-700">Rate</label>
          <input
            className="border p-2 w-full"
            type="number"
            placeholder="Rate"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-gray-700">Description</label>
          <input
            className="border p-2 w-full"
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-gray-700">Daily Charge</label>
          <input
            className="border p-2 w-full"
            type="number"
            placeholder="Daily Charge"
            value={dailyCharge}
            onChange={(e) => setDailyCharge(e.target.value)}
          />
        </div>
       <div>
       <button
          className="bg-[#DCB579] text-white p-2 rounded w-full"
          type="submit"
        >
          Add Report
        </button>
        
       </div>
      </form>
    </div>
  );
};

export default AddDailyReport;
