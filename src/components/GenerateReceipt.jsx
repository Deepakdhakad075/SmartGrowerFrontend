import React, { useEffect, useState } from 'react';
import { getLabour, createReceipt, addDeposite } from '../api';
import { useNavigate, useParams } from 'react-router-dom';

export const GenerateReceipt = ({ token }) => {
  const { id } = useParams();
  const [labour, setLabour] = useState(null);
  const [numberofLabours, setNumberofLabours] = useState(0); 
  const [totalPay, setTotalPay] = useState(0);
  const [due, setDue] = useState(0);
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLabour = async () => {
      try {
        const data = await getLabour(id, token);
        setLabour(data.data.labour);
        setDue(data.data.totalDueAmount || 0); // Assuming this field is in the response and default to 0 if undefined
      } catch (error) {
        console.error('Failed to fetch labour:', error);
      }
    };
    fetchLabour();
  }, [id, token]);

 
const handleSubmit = async (event) => {
  event.preventDefault();
  if (!labour) return;

  const receipt = {
    labourName: labour.name,
    numberofLabours,
    totalPay,
    date,
    due
  };

  try {
    const receiptResponse = await createReceipt(token, id, receipt);
    
    const depositResponse = await addDeposite(token, id, totalPay, date); // Ensure this function is correct
   

    alert('Receipt created successfully');

    // Reset form
    setNumberofLabours(0);
    setTotalPay(0);
    setDue(0);
    setDate(new Date());

    navigate('/receipts');
  } catch (error) {
    console.error('Failed to create receipt:', error);
    navigate('/receipts');
  }
};

  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Generate Receipt</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="labourName">
            Labour Name
          </label>
          <input
            id="labourName"
            type="text"
            value={labour?.name || ''}
            readOnly
            className="block w-full bg-gray-100 border border-gray-300 rounded-lg py-2 px-3 leading-tight focus:outline-none focus:border-gray-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numberofLabours">
            Number of Labours
          </label>
          <input
            id="numberofLabours"
            type="number"
            value={numberofLabours}
            onChange={(e) => setNumberofLabours(parseInt(e.target.value))}
            className="block w-full bg-gray-100 border border-gray-300 rounded-lg py-2 px-3 leading-tight focus:outline-none focus:border-gray-500"
            required
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
            onChange={(e) => setTotalPay(parseFloat(e.target.value))}
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
