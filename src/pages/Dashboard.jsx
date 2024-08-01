import React, { useState, useEffect } from 'react';
import { BsPersonAdd } from "react-icons/bs";
import { ImAddressBook } from "react-icons/im";
import { CgAddR } from "react-icons/cg";
import { AiOutlineDelete } from "react-icons/ai";
import ReactPaginate from 'react-paginate';
import { getLabours, addLabour, deleteLabour } from '../api';
import { useNavigate } from "react-router-dom";
import AnimatedDots from '../components/Loader';

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
  const [loader, setLoader] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchLabours = async () => {
      setLoader(true);
      try {
        const data = await getLabours(token);
        console.log(data, "all Labour data obj");
        setLabours(data.labours || []);
        setTotalAmount(data.totalDueAmountAllLabours);
        console.log(totalAmount, "totallllll");
        setFilteredLabours(data.labours || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoader(false);
      }
    };
    fetchLabours();
  }, [token]);

  useEffect(() => {
    setLoader(true);
    const timeoutId = setTimeout(() => {
      setFilteredLabours(
        labours.filter(labour =>
          labour.name && labour.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setLoader(false);
    }, 300); // Debounce search filter
    return () => clearTimeout(timeoutId);
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
      if (report.numberofLabours) {
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
        {
          loader ? (
            <div>
              <AnimatedDots />
            </div>
          ) : (
            <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-[#f9f5ef]">
                  <th className="py-4 px-4 border-b border-gray-300">Name</th>
                  <th className="py-4 px-4 border border-gray-200 ">Total Amount</th>
                  <th className="py-4 px-4 border-b border-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayLabours && displayLabours.map((labour) => {
                  // const { totalCharge } = calculateTotals(labour.dailyReports);

                  return (
                    <tr key={labour._id} className="bg-white mt-2 text-sm mb-4 shadow-md rounded-md hover:bg-gray-50 transition-all duration-300" onDoubleClick={() => viewDetailsHandler(labour._id)}>
                      <td className="py-4 px-4 text-center uppercase">{labour.name}</td>
                      <td className="py-4 px-4 text-center bg-[#fef4f4]">{labour.totalDueAmount} Rs</td>
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
          )
        }
      </div>
      <div className="flex flex-col md:flex-row sm:flex-col justify-center items-center gap-5 mt-4">
        {filteredLabours.length > 5 && (
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
        <div className="p-4 mt-4 bg-[#fef4f4] shadow-md text-xl text-black font-bold rounded-md w-full md:w-fit text-center">
          Total Amount: <span className="text-gray-600">{totalAmount} Rs</span>
        </div>
      </div>

      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this labour?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded mr-2"
                onClick={deleteLabourHandler}
              >
                Delete
              </button>
              <button
                className="bg-gray-300 py-2 px-4 rounded"
                onClick={() => toggleModal()}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
