import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getLabour } from '../api'; // Ensure this API call fetches a specific labour with their receipts
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReceiptDetails = ({ token }) => {
  const { labourId, receiptId } = useParams();
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const labour = await getLabour(labourId, token);
        const foundReceipt = labour.receipts.find(rec => rec._id === receiptId);
        setReceipt(foundReceipt);
      } catch (error) {
        console.error('Failed to fetch receipt details:', error);
      }
    };

    fetchReceipt();
  }, [labourId, receiptId, token]);

  const printPDF = () => {
    if (!receipt) return;

    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    const doc = new jsPDF();

    // Main heading with current date and time
    doc.text(`${receipt.labourName}'s Receipt`, 105, 15, { align: 'center' });
    doc.text(`Printed on: ${currentDate} ${currentTime}`, 105, 22, { align: 'center' });

    // Table data
    const data = [
      ['Labour Name', receipt.labourName],
      ['Number of Labours', receipt.numberofLabours],
      ['Total Pay', `${receipt.totalPay} Rs`],
      ['Date', new Date(receipt.date).toLocaleDateString()],
      ['Due', `${receipt.due} Rs`]
    ];

    // Generate table
    doc.autoTable({
      body: data,
      startY: 30
    });

    // Download the PDF
    doc.save(`${receipt.labourName}_Receipt.pdf`);
  };

  if (!receipt) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">{receipt.labourName}'s Receipt</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <tbody className="text-gray-600 text-sm font-light">
            <tr className="border-b border-gray-200">
              <td className="py-3 px-6 text-left font-bold">Labour Name</td>
              <td className="py-3 px-6 text-left">{receipt.labourName}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-3 px-6 text-left font-bold">Number of Labours</td>
              <td className="py-3 px-6 text-left">{receipt.numberofLabours}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-3 px-6 text-left font-bold">Total Pay</td>
              <td className="py-3 px-6 text-left">{receipt.totalPay} Rs</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-3 px-6 text-left font-bold">Date</td>
              <td className="py-3 px-6 text-left">{new Date(receipt.date).toLocaleDateString()}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-3 px-6 text-left font-bold">Due</td>
              <td className="py-3 px-6 text-left">{receipt.due} Rs</td>
            </tr>
          </tbody>
        </table>
        <div className="text-center mt-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={printPDF}
          >
             Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptDetails;
