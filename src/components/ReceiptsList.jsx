import React, { useEffect, useState } from 'react';
import { getLabours } from '../api'; // Ensure this API call fetches labours with their receipts
import {  useNavigate } from 'react-router-dom';

const ReceiptsList = ({ token }) => {
  const [receipts, setReceipts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const labours = await getLabours(token);
        console.log(labours,"dataaaaaaaaa");
        const allReceipts = labours.labours.flatMap(labour => labour.receipts.map(receipt => ({
          ...receipt,
          labourId: labour._id
        })));
        setReceipts(allReceipts);
      } catch (error) {
        console.error('Failed to fetch receipts:', error);
      }
    };

    fetchReceipts();
  }, [token]);

  const handleReceiptClick = (labourId, receiptId) => {
    navigate(`/receipt/${labourId}/${receiptId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">All Receipts</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Labour Name</th>
              <th className="py-3 px-6 text-left">Number of Labours</th>
              <th className="py-3 px-6 text-left">Total Pay</th>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-left">Due</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {receipts.map(receipt => (
              <tr
                key={receipt._id}
                className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleReceiptClick(receipt.labourId, receipt._id)}
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">{receipt.labourName}</td>
                <td className="py-3 px-6 text-left">{receipt.numberofLabours}</td>
                <td className="py-3 px-6 text-left">{receipt.totalPay} Rs</td>
                <td className="py-3 px-6 text-left">{new Date(receipt.date).toLocaleDateString()}</td>
                <td className="py-3 px-6 text-left">{receipt.due} Rs</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReceiptsList;
