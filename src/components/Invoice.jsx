// src/components/Invoice.js

import React from 'react';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Invoice = ({ labour, totalDays, totalHours, totalCharges }) => {
  const componentRef = React.useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const generatePDF = () => {
    html2canvas(componentRef.current).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 208;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('invoice.pdf');
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div ref={componentRef}>
        <h1 className="text-3xl font-bold mb-6 text-center">{labour.name}'s Invoice</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-left">Work Hours</th>
                <th className="py-3 px-6 text-left">Rate</th>
                <th className="py-3 px-6 text-left">Description</th>
                <th className="py-3 px-6 text-left">Daily Charge</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {labour.dailyReports.map((report) => (
                <tr key={report._id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {new Date(report.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-6 text-left">{report.workHours}</td>
                  <td className="py-3 px-6 text-left">{report.rate}</td>
                  <td className="py-3 px-6 text-left">{report.description}</td>
                  <td className="py-3 px-6 text-left">{report.dailyCharge} Rs</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <td className="py-3 px-6 text-left font-bold">Total</td>
                <td className="py-3 px-6 text-left font-bold">{totalDays} Days</td>
                <td className="py-3 px-6 text-left font-bold">{totalHours} Hours</td>
                <td className="py-3 px-6 text-left font-bold"></td>
                <td className="py-3 px-6 text-left font-bold">{totalCharges} Rs</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handlePrint}
        >
          Print Invoice
        </button>
        <button
          className="ml-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={generatePDF}
        >
          Generate PDF
        </button>
      </div>
    </div>
  );
};

export default Invoice;
