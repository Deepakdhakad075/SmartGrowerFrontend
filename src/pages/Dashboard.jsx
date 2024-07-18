import React, { useState, useEffect } from 'react';
import { BsPersonAdd } from "react-icons/bs";
import { ImAddressBook } from "react-icons/im";
import { CgAddR } from "react-icons/cg";
import { AiOutlineDelete } from "react-icons/ai";
import ReactPaginate from 'react-paginate';
import { getLabours, addLabour, deleteLabour } from '../api';
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [labours, setLabours] = useState([]);
  const [filteredLabours, setFilteredLabours] = useState([]);
  const [name, setName] = useState('');
  const [deleteLabourId, setDeleteLabourId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [laboursPerPage] = useState(5);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchLabours = async () => {
      const data = await getLabours(token);
      setLabours(data);
      setFilteredLabours(data);
    };
    fetchLabours();
  }, [token]);

  useEffect(() => {
    setFilteredLabours(
      labours.filter(labour =>
        labour.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, labours]);

  const addLabourHandler = async (e) => {
    e.preventDefault();
    const labourData = { name };
    const newLabour = await addLabour(labourData, token);
    setLabours([...labours, newLabour]);
    setName('');
  };

  const addDailyReportHandler = (labourId) => {
    navigate(`/addreport/${labourId}`);
  };

  const toggleModal = (labourId = null) => {
    setOpenModal(!openModal);
    setDeleteLabourId(labourId);
  };

  const viewDetailsHandler = (labourId) => {
    navigate(`/labour/${labourId}`);
  };

  const deleteLabourHandler = async () => {
    try {
      await deleteLabour(deleteLabourId, token);
      setLabours(labours.filter(labour => labour._id !== deleteLabourId));
      setDeleteLabourId(null);
      setOpenModal(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  const calculateTotals = (dailyReports) => {
    let totalWorkHours = 0;
    let totalCharge = 0;
    let totaldays = 0;

    dailyReports.forEach(report => {
      if(report.numberofLabours){
          totaldays += report.numberofLabours;
      }
      totalWorkHours += report.workHours || 0;
      totalCharge += report.dailyCharge || 0;
    });

    return { totalWorkHours, totalCharge, totaldays };
  };

  const calculateTotalAmount = () => {
    return filteredLabours.reduce((total, labour) => {
      const { totalCharge } = calculateTotals(labour.dailyReports);
      return total + totalCharge;
    }, 0);
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const displayLabours = filteredLabours.slice(
    currentPage * laboursPerPage,
    (currentPage + 1) * laboursPerPage
  );

  return (
    <div className="container mx-auto p-4 bg-stone-100">
      
      <form className="mb-4 mt-6" onSubmit={addLabourHandler}>
        <div className="flex space-x-4">
          <input
            className="border border-[#DCB579] rounded-md p-2 flex-grow"
            type="text"
            placeholder="Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            className="bg-[#DCB579] text-white p-2 rounded flex items-center"
            type="submit"
          >
            Add Labour
            <BsPersonAdd className="ml-2" />
          </button>
        </div>
      </form>

      <div className='flex w-full gap-3'>
      <div className="mb-4 w-full">
        <input
          className="border border-[#DCB579] rounded-md p-2 w-full"
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    
      </div>

      <div className="overflow-x-auto shadow-sm rounded-sm mb-4">
        <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#f9f5ef]">
              <th className="py-4 px-4 border-b border-gray-300">Name</th>
              <th className="py-4 px-4 border border-gray-200 ">Total Amount</th>
              <th className="py-4 px-4 border-b border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayLabours.map((labour) => {
              const { totalCharge } = calculateTotals(labour.dailyReports);

              return (
                <tr key={labour._id} className="bg-white mt-2 text-sm mb-4 shadow-md rounded-md hover:bg-gray-50 transition-all duration-300" onDoubleClick={() => viewDetailsHandler(labour._id)}>
                  <td className="py-4 px-4 text-center uppercase">{labour.name}</td>
                  <td className="py-4 px-4 text-center bg-[#fef4f4]">{totalCharge} Rs</td>
                  <td className="py-4 px-4 text-center flex items-center justify-center gap-4">
                    <button
                      className="text-green-500"
                      onClick={() => addDailyReportHandler(labour._id)}
                    >
                      <CgAddR size={24} />
                    </button>
                    <button
                      className="text-blue-400"
                      onClick={() => viewDetailsHandler(labour._id)}
                    >
                      <ImAddressBook size={24} />
                    </button>
                    <button
                      className="text-red-500"
                      onClick={() => toggleModal(labour._id)}
                    >
                      <AiOutlineDelete size={24} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col md:flex-row sm:flex-col justify-center items-center gap-5 mt-4">

  {filteredLabours.length > 10 && (
    <div className="flex justify-end w-full max-w-xs md:max-w-md">
      <ReactPaginate
        previousLabel={<button className="bg-gray-200 text-black py-2 px-4 rounded-md hover:bg-gray-300">Previous</button>}
        nextLabel={<button className="bg-gray-200 text-black py-2 px-4 rounded-md hover:bg-gray-300">Next</button>}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={Math.ceil(filteredLabours.length / laboursPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={'pagination flex space-x-2 justify-center'}
        activeClassName={'active'}
        pageClassName={'page-item'}
        pageLinkClassName={'page-link'}
        previousClassName={'page-item'}
        previousLinkClassName={'page-link'}
        nextClassName={'page-item'}
        nextLinkClassName={'page-link'}
        breakLinkClassName={'page-link'}
      />
      
    </div>
    
  )}
    <div className="p-1 bg-white shadow-md rounded-md  w-full h-9 text-center flex items-center justify-center">
    <h3 className="sm:text-[14px] text-[14px] md:text-xl text-red-500 font-semibold text-center md:text-left">
      Total Amount Paid to All Labours: {calculateTotalAmount()} Rs
    </h3>
  </div>
</div>
    { 
      openModal &&
        <div id="popup-modal" className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow dark:bg-gray-700 relative p-4 w-full max-w-md">
            <button
              type="button"
              className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => toggleModal(null)}
            >
              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l6 6m0 0l6 6M7 7l-6 6m6-6l6-6"/>
              </svg>
            </button>
            <div className="p-6 text-center">
              <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this labour?</h3>
              <button
                onClick={deleteLabourHandler}
                type="button"
                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
              >
                Yes, I'm sure
              </button>
              <button
                type="button"
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                onClick={() => toggleModal(null)}
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default Dashboard;
