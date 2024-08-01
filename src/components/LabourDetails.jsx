import { FcPrint } from "react-icons/fc"; 
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getLabour, deleteDailyReport, editDailyReport } from '../api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';
import DepositForm from './DepositForm'; // Import DepositForm
import { FaEdit } from 'react-icons/fa';
import { MdDeleteOutline } from 'react-icons/md';
import { BsThreeDotsVertical } from 'react-icons/bs'; // Import three-dot icon
import EditReportModal from './EditReportModal'; 

const LabourDetails = ({ token }) => {
  const { id } = useParams();
  const [labour, setLabour] = useState(null);
  const [totalDays, setTotalDays] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [totalCharges, setTotalCharges] = useState(0);
  const [totalLabour, setTotalLabour] = useState(0);
  const [totalDeposits, setTotalDeposits] = useState(0); // Total deposits
  const [totalDue, setTotalDue] = useState(0); // Total due amount
  const [showEditModal, setShowEditModal] = useState(false); // State to control edit modal visibility
  const [editData, setEditData] = useState(null);
  const [showDepositEditModal, setShowDepositEditModal] = useState(false);
  const [showDepositDetails, setShowDepositDetails] = useState(false); // State to control deposit details visibility
  const [totalPaid, setTotalPaid] = useState('');
  const [date, setDate] = useState('');
  const [showActionsModal, setShowActionsModal] = useState(false); // State to control actions modal visibility
  const navigate = useNavigate();



  useEffect(() => {
    fetchLabour();
  }, [id, token,showDepositEditModal]);

  const fetchLabour = async () => {
    try {
      const data = await getLabour(id, token);
      setLabour(data.data.labour);
      setTotalDeposits(data.data.totalDepositAmount);
      setTotalDue(data.data.totalDueAmount);
      setTotalCharges(data.totalDailyCharges);

      if (data.data.labour && data.data.labour.dailyReports) {
        calculateTotals(data.data.labour.dailyReports);
      }
     
    } catch (error) {
      console.error('Failed to fetch labour details:', error);
    }
  };

  const calculateTotals = (dailyReports) => {
    if (!dailyReports || dailyReports.length === 0) return;

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

  const generateReceipt = () => {
    navigate(`/recipt-generate/${id}`);
  };

  const deleteReport = async (labourId, reportId) => {
    try {
      await deleteDailyReport(labourId, reportId, token);
      fetchLabour(); // Refetch the labour details after deleting a report
    } catch (error) {
      console.error('Failed to delete daily report:', error);
    }
  };

  const editReport = async (reportId, updatedData) => {
    try {
      await editDailyReport(labour._id, reportId, updatedData, token);
      fetchLabour(); // Refetch the labour details after editing a report
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

  const handleEditCancel = () => {
    setShowEditModal(false);
  };

  const handleDeposit = () => {
    setShowDepositEditModal(!showDepositEditModal);
  };

  const toggleDepositDetails = () => {
    setShowDepositDetails(!showDepositDetails);
  };

  const handleShowActionsModal = () => {
    setShowActionsModal(true);
  };

  const handleCloseActionsModal = () => {
    setShowActionsModal(false);
  };

  return (
    <div className="container mx-auto p-4 relative">
      {labour && (
        <>
         <div className="hidden md:block relative  ">
              <button onClick={handleShowActionsModal} className="absolute text-gray-600 top-3 right-2">
               
                <FcPrint onClick={printPDF} size={24} />
              </button>
          </div>
          <div className='flex items-center justify-center '>
         
          <div className="md:text-3xl sm:text-xl text-xl text-[#3E3236] font-bold my-2 text-center">{labour.name}'s Daily Reports</div>
          <div className="md:hidden relative ml-24">
              <button onClick={handleShowActionsModal} className="text-gray-600">
                <BsThreeDotsVertical size={24} />
              </button>
          </div>
        
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead>
                <tr className="bg-[#fde6c0] text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-2 md:px-6 text-left border border-gray-400">Date</th>
                  <th className="py-3 px-2 md:px-6 text-left border border-gray-400">Number of Labours</th>
                  <th className="py-3 px-2 md:px-6 text-left border border-gray-400">Rate</th>
                  <th className="py-3 px-2 md:px-6 text-left border border-gray-400">Work Hours</th>
                  <th className="py-3 px-2 md:px-6 text-left border border-gray-400">Description</th>
                  <th className="py-3 px-2 md:px-6 text-left border border-gray-400">Total Charge</th>
                  <th className="py-3 px-2 md:px-6 text-left border border-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {labour.dailyReports.map((report) => (
                  <tr key={report._id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-2 md:px-6 text-left whitespace-nowrap border border-gray-300">
                      {new Date(report.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2 md:px-6 text-left border border-gray-300">{report.numberofLabours}</td>
                    <td className="py-3 px-2 md:px-6 text-left border border-gray-300">{report.rate}</td>
                    <td className="py-3 px-2 md:px-6 text-left border border-gray-300">{report.workHours}</td>
                    <td className="py-3 px-2 md:px-6 text-left border border-gray-300">{report.description}</td>
                    <td className="py-3 px-2 md:px-6 text-left border border-gray-300">{report.dailyCharge} Rs</td>
                    <td className="py-3 px-2 md:px-6 text-left border border-gray-300">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => handleEdit(report._id, report)} className="text-blue-500 hover:text-blue-700">
                          <FaEdit />
                        </button>
                        <button onClick={() => deleteReport(labour._id, report._id)} className="text-red-500 hover:text-red-700">
                          <MdDeleteOutline />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                <tr className="border-b border-gray-200 font-bold bg-gray-50">
                  <td className="py-3 px-2 md:px-6 text-left">Total days {totalDays}</td>
                  <td className="py-3 px-2 md:px-6 text-left">{totalLabour}</td>
                  <td></td>
                  <td className="py-3 px-2 md:px-6 text-left">{totalHours}</td>
                  <td></td>
                  <td className="py-3 px-2 md:px-6 text-left">{totalCharges} Rs</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center mt-4">
            <div className="hidden md:block space-x-2 mb-2 md:mb-0 ">
              {/* <button
                className="bg-[#3E3236] hover:bg-[#685052] text-white py-2 px-4 rounded"
                onClick={printPDF}
              >
                Print PDF
              </button> */}
      <div className="flex flex-col gap-2 px-2">
      <button
                className="bg-[#3E3236] hover:bg-[#685052] text-white py-2 px-4 rounded"
                onClick={generateReceipt}
              >
                Generate Receipt
              </button>
              <button
                className="bg-[#3E3236] hover:bg-[#685052] text-white py-2 px-4 rounded"
                onClick={handleDeposit}
              >
                Deposit
              </button>
              <button
                className="bg-[#3E3236] hover:bg-[#685052] text-white py-2 px-4 rounded"
                onClick={toggleDepositDetails}
              >
                {showDepositDetails ? 'Hide Deposit Details' : 'Show Deposit Details'}
              </button>
      </div>
            </div>
           
            <div className="w-full mt-4">
  <table className="min-w-full bg-white shadow-md rounded-lg">
    <thead>
      <tr>
        <th className="py-2 px-4 bg-gray-200 border-b text-left text-sm font-bold text-gray-700">Description</th>
        <th className="py-2 px-4 bg-gray-200 border-b text-left text-sm font-bold text-gray-700">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="py-2 px-4 border-b text-sm font-medium text-gray-600">Total Charges</td>
        <td className="py-2 px-4 border-b text-sm font-medium text-gray-600">{totalCharges} Rs</td>
      </tr>
      <tr>
        <td className="py-2 px-4 border-b text-sm font-medium text-gray-600">Total Deposits</td>
        <td className="py-2 px-4 border-b text-sm font-medium text-gray-600">{totalDeposits} Rs</td>
      </tr>
      <tr>
        <td className="py-2 px-4 border-b text-sm font-medium text-gray-600">Total Due</td>
        <td className="py-2 px-4 border-b text-sm font-medium text-gray-600">{totalDue} Rs</td>
      </tr>
    </tbody>
  </table>
</div>

          </div>
          {showActionsModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded shadow-lg w-11/12 sm:w-96">
                <button
                  className="bg-[#3E3236] hover:bg-[#685052] text-white py-2 px-4 rounded mb-2 w-full"
                  onClick={() => {
                    printPDF();
                    handleCloseActionsModal();
                  }}
                >
                  Print PDF
                </button>
                <button
                  className="bg-[#3E3236] hover:bg-[#685052] text-white py-2 px-4 rounded mb-2 w-full"
                  onClick={() => {
                    generateReceipt();
                    handleCloseActionsModal();
                  }}
                >
                  Generate Receipt
                </button>
                <button
                  className="bg-[#3E3236] hover:bg-[#685052] text-white py-2 px-4 rounded mb-2 w-full"
                  onClick={() => {
                    handleDeposit();
                    handleCloseActionsModal();
                  }}
                >
                  Deposit
                </button>
                <button
                  className="bg-[#3E3236] hover:bg-[#685052] text-white py-2 px-4 rounded mb-2 w-full"
                  onClick={() => {
                    toggleDepositDetails();
                    handleCloseActionsModal();
                  }}
                >
                  {showDepositDetails ? 'Hide Deposit Details' : 'Show Deposit Details'}
                </button>
                <button
                  className="text-gray-600 mt-2 w-full"
                  onClick={handleCloseActionsModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {showDepositEditModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded shadow-lg w-11/12 sm:w-96">
                <DepositForm
                  labourId={labour._id}
                  token={token}
                  onClose={() => setShowDepositEditModal(false)}
                  onDepositSuccess={fetchLabour}
                />
              </div>
            </div>
          )}
          {showEditModal && (
            <EditReportModal
              report={editData}
              onSubmit={handleEditSubmit}
              onCancel={handleEditCancel}
            />
          )}
          {showDepositDetails && (
            <div className="overflow-x-auto mt-4">
              <h3 className="text-xl font-bold mb-2 text-center">Deposit Details</h3>
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                <thead>
                  <tr className="bg-[#fde6c0] text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-2 md:px-6 text-left border border-gray-400">Date</th>
                    <th className="py-3 px-2 md:px-6 text-left border border-gray-400">Total Paid</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {labour.paid.map((deposit) => (
                    <tr key={deposit._id} className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-3 px-2 md:px-6 text-left whitespace-nowrap border border-gray-300">
                        {new Date(deposit.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-2 md:px-6 text-left border border-gray-300">{deposit.totalPaid} Rs</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LabourDetails;
