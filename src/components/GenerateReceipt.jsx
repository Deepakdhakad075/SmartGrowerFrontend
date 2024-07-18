import React, { useEffect, useState } from 'react';
import { getLabours, createReceipt } from '../api'; // Ensure these API calls are correct
import { useNavigate } from 'react-router-dom';

export const GenerateReceipt = ({ token }) => {
  const [labours, setLabours] = useState([]);
  const [selectedLabour, setSelectedLabour] = useState('');
  const [numberOfLabours, setNumberOfLabours] = useState(0);
  const [totalPay, setTotalPay] = useState(0);
  const [due, setDue] = useState(0);
  const [date, setDate] = useState(new Date());
const navigate = useNavigate();
  useEffect(() => {
    const fetchLabours = async () => {
      try {
        const data = await getLabours(token);
        setLabours(data);
      } catch (error) {
        console.error('Failed to fetch labours:', error);
      }
    };

    fetchLabours();
  }, [token]);

  useEffect(() => {
    if (selectedLabour) {
      const labour = labours.find(lab => lab._id === selectedLabour);
      if (labour) {
        const totalCharges = labour.dailyReports.reduce((acc, report) => acc + report.dailyCharge, 0);
        // setNumberOfLabours(labour.dailyReports.reduce((acc, report) => acc + (report.numberofLabours || 0), 0));
        setDue(totalCharges - totalPay);
      }
    }
  }, [selectedLabour, totalPay, labours]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const labour = labours.find(lab => lab._id === selectedLabour);
    if (!labour) return;
    const receipt = {
      labourName: labour.name,
      numberofLabours: numberOfLabours,
      totalPay,
      date,
      due
    };
    try {
      await createReceipt(token, selectedLabour, receipt);
      alert('Receipt created successfully');
      // Reset form
      setSelectedLabour('');
      setNumberOfLabours(0);
      setTotalPay(0);
      setDue(0);
      setDate(new Date());
      navigate('/receipts');
    } catch (error) {
      console.error('Failed to create receipt:', error);
      alert('Failed to create receipt');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Generate Receipt</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="labour">
            Labour Name
          </label>
          <select
            id="labour"
            value={selectedLabour}
            onChange={(e) => setSelectedLabour(e.target.value)}
            className="block w-full bg-white border border-gray-300 rounded-lg py-2 px-3 leading-tight focus:outline-none focus:border-gray-500"
            required
          >
            <option value="">Select Labour</option>
            {labours.map((labour) => (
              <option key={labour._id} value={labour._id}>
                {labour.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numberOfLabours">
            Number of Labours
          </label>
          <input
            id="numberOfLabours"
            type="number"
            value={numberOfLabours}
            onChange={(e) => setNumberOfLabours(e.target.value)}
            className="block w-full bg-gray-100 border border-gray-300 rounded-lg py-2 px-3 leading-tight focus:outline-none focus:border-gray-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="totalPay">
            Total Pay
          </label>
          <input
            id="totalPay"
            type="number"
            value={totalPay}
            onChange={(e) => setTotalPay(parseFloat(e.target.value) )}
            className="block w-full bg-white border border-gray-300 rounded-lg py-2 px-3 leading-tight focus:outline-none focus:border-gray-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="due">
            Due
          </label>
          <input
            id="due"
            type="number"
            value={due}
            readOnly
            className="block w-full bg-gray-100 border border-gray-300 rounded-lg py-2 px-3 leading-tight focus:outline-none focus:border-gray-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
            Date
          </label>
          <input
            id="date"
            type="date"
            value={date.toISOString().substr(0, 10)}
            onChange={(e) => setDate(new Date(e.target.value))}
            className="block w-full bg-white border border-gray-300 rounded-lg py-2 px-3 leading-tight focus:outline-none focus:border-gray-500"
            required
          />
        </div>
        <div className="text-center mt-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Generate Receipt
          </button>
        </div>
      </form>
    </div>
  );
};

export default GenerateReceipt;
