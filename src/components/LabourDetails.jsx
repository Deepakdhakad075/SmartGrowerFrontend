import { AiOutlineEdit } from "react-icons/ai"; 
import { MdDeleteOutline } from "react-icons/md"; 
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { getLabour,deleteDailyReport,editDailyReport } from '../api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const LabourDetails = ({ token }) => {
  const { id } = useParams();
  const [labour, setLabour] = useState(null);
  const [totalDays, setTotalDays] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [totalCharges, setTotalCharges] = useState(0);
  const [totalLabour, setTotalLabour] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false); // State to control edit modal visibility
  const [editData, setEditData] = useState(null); 

  const navigate = useNavigate();
  useEffect(() => {
    const fetchLabour = async () => {
      try {
        const data = await getLabour(id, token);
        setLabour(data);
        calculateTotals(data.dailyReports);
      } catch (error) {
        console.error('Failed to fetch labour details:', error);
      }
    };

    fetchLabour();
  }, [id, token]);

  const calculateTotals = (dailyReports) => {
    let days = dailyReports.length;
    let hours = dailyReports.reduce((acc, report) => acc + report.workHours, 0);
    let charges = dailyReports.reduce((acc, report) => acc + report.dailyCharge, 0);
    let totalLabours = dailyReports.reduce((acc, report) => acc + (report.numberofLabours || 0), 0);
    
    setTotalDays(days);
    setTotalHours(hours);
    setTotalCharges(charges);
    setTotalLabour(totalLabours);
  };

  const printPDF = () => {
    if (!labour) return;
  
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    const doc = new jsPDF();
  
    // Main heading with current date and time
    doc.text(`${labour.name}'s Daily Reports`, 105, 15, { align: 'center' });
    doc.text(`Printed on: ${currentDate} ${currentTime}`, 105, 22, { align: 'center' });
  
    // Table headers
    const headers = [['Date', 'Number of Labours', 'Rate', 'Work Hours', 'Description', 'Daily Charge']];
  
    // Table rows
    const data = labour.dailyReports.map(report => [
      new Date(report.date).toLocaleDateString(),
      report.numberofLabours,
      report.rate,
      report.workHours,
      report.description,
      `${report.dailyCharge} Rs`
    ]);
  
    // Generate table
    doc.autoTable({
      head: headers,
      body: data,
      foot: [['Total days ' + totalDays, totalLabour, '', totalHours, '', `${totalCharges} Rs`]],
      startY: 30,
    });
  
    // Download the PDF
    doc.save(`${labour.name}_Labour_Details.pdf`);
  };

  const generateRecipt=()=>{
    navigate('/recipt-generate')
  }
   
  const deleteReport = async (labourId, reportId) => {
    try {
      await deleteDailyReport(labourId, reportId, token);
      const updatedLabour = await getLabour(id, token);
      setLabour(updatedLabour);
      calculateTotals(updatedLabour.dailyReports);
    } catch (error) {
      console.error('Failed to delete daily report:', error);
    }
  };

  const editReport = async (reportId, updatedData) => {
    try {
      await editDailyReport(labour._id, reportId, updatedData, token);
      const updatedLabour = await getLabour(id, token);
      setLabour(updatedLabour);
      calculateTotals(updatedLabour.dailyReports);
      setShowEditModal(false); // Close the edit modal after successful edit
    } catch (error) {
      console.error('Failed to edit daily report:', error);
    }
  };

  const handleEdit = (reportId, initialData) => {
    setEditData(initialData);
    setShowEditModal(true); // Show edit modal
  };

  const handleEditSubmit = (updatedData) => {
    editReport(editData._id, updatedData);
  };

const handleEditCancel= ()=>{
    setShowEditModal(false);
}
  return (
    <div className="container mx-auto p-4">
      {labour && (
        <>
          <div className="md:text-3xl sm:text-xl text-xl text-[#3E3236] font-bold my-2 text-center">{labour.name}'s Daily Reports</div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead>
                <tr className="bg-[#fde6c0] text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left border border-gray-400">Date</th>
                  <th className="py-3 px-6 text-left border border-gray-400">Number of Labours</th>
                  <th className="py-3 px-6 text-left border border-gray-400">Rate</th>
                  <th className="py-3 px-6 text-left border border-gray-400">Work Hours</th>
                  <th className="py-3 px-6 text-left border border-gray-400">Description</th>
                  <th className="py-3 px-6 text-left border border-gray-400">total Charge</th>
                  <th className="py-3 px-6 text-left border border-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {labour.dailyReports.map((report) => (
                  <tr key={report._id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap border border-gray-300">
                      {new Date(report.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-6 text-left border border-gray-300">{report.numberofLabours}</td>
                    <td className="py-3 px-6 text-left border border-gray-300">{report.rate}</td>
                    <td className="py-3 px-6 text-left border border-gray-300">{report.workHours}</td>
                    <td className="py-3 px-6 text-left border border-gray-300">{report.description}</td>
                    <td className="py-3 px-6 text-left border border-gray-300">{report.dailyCharge} Rs</td>

                    <td className="py-3 px-6 text-left flex border border-gray-300">
                      <button
                        className="text-red-500  px-4 py-2 rounded-lg shadow-sm hover:bg-red-600 focus:outline-none focus:ring-1 focus:ring-red-500 mr-4"
                        onClick={() => deleteReport(labour._id, report._id)}
                      >
                        <MdDeleteOutline size={20}/>
                      </button>
                      <button
                        className="text-green-500  px-4 py-2 rounded-lg shadow-sm hover:bg-green-600 focus:outline-none focus:ring-1 focus:ring-green-500"
                        onClick={() => handleEdit(report._id, report)} // Pass initial data to edit function
                      >
                        <AiOutlineEdit size={20}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-[#fde6c0] text-gray-600 uppercase text-sm leading-normal">
                  <td className="py-3 px-6 text-left font-bold">Total {totalDays} Days</td>
                  <td className="py-3 px-6 text-left font-bold">{totalLabour}</td>
                  <td className="py-3 px-6 text-left font-bold"></td>
                  <td className="py-3 px-6 text-left font-bold">{totalHours} Hours</td>
                  <td className="py-3 px-6 text-left font-bold"></td>
                  <td className="py-3 px-6 text-left font-bold">{totalCharges} Rs</td>
                  <td className="py-3 px-6 text-left font-bold"></td>
                </tr>
              </tfoot>
            </table>
            <div className="text-center mt-4">
              <button
                className="bg-gray-700 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-4"
                onClick={printPDF}
              >
                Download PDF
              </button>
              <button
                className="bg-[#3E3236] text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-4"
                onClick={generateRecipt}
              >
               Generate recipt
              </button>
            </div>
          </div>
        </>
      )}
       {showEditModal && editData && (
  <div className="fixed inset-0 z-10 overflow-y-auto">
    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Daily Report</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleEditSubmit(editData);
              }}>
                <div className="mt-2">
                  <label htmlFor="workHours" className="block text-sm font-medium text-gray-700">Work Hours</label>
                  <input
                    type="text"
                    name="workHours"
                    id="workHours"
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    defaultValue={editData.workHours}
                    onChange={(e) => setEditData({ ...editData, workHours: e.target.value })}
                    required
                  />
                </div>
                <div className="mt-2">
                  <label htmlFor="numberofLabours" className="block text-sm font-medium text-gray-700">Number of Labours</label>
                  <input
                    type="text"
                    name="numberofLabours"
                    id="numberofLabours"
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    defaultValue={editData.numberofLabours}
                    onChange={(e) => setEditData({ ...editData, numberofLabours: e.target.value })}
                    required
                  />
                </div>
                <div className="mt-2">
                  <label htmlFor="rate" className="block text-sm font-medium text-gray-700">Rate</label>
                  <input
                    type="text"
                    name="rate"
                    id="rate"
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    defaultValue={editData.rate}
                    onChange={(e) => setEditData({ ...editData, rate: e.target.value })}
                    required
                  />
                </div>
                <div className="mt-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    type="text"
                    name="description"
                    id="description"
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    defaultValue={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    required
                  />
                </div>
                <div className="mt-2">
                  <label htmlFor="dailyCharge" className="block text-sm font-medium text-gray-700">Daily Charge</label>
                  <input
                    type="text"
                    name="dailyCharge"
                    id="dailyCharge"
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    defaultValue={editData.dailyCharge}
                    onChange={(e) => setEditData({ ...editData, dailyCharge: e.target.value })}
                    required
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <button
                    type="submit"
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleEditCancel}
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm ml-4"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default LabourDetails;
