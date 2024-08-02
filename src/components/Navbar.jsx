import React, { useState, useEffect } from 'react';
import { FaSignOutAlt, FaBars, FaTimes, FaUser, FaReceipt } from 'react-icons/fa';
import toast from "react-hot-toast";
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.jpg';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openModal, setOpenModal] = useState(false);
  const [showLogoutButton, setShowLogoutButton] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
   const token1 = localStorage.getItem('token');


  const handleLogOut = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    setOpenModal(false);
    setShowLogoutButton(false);
    navigate('/');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && location.pathname !== '/') {
      setShowLogoutButton(true);
    } else {
      setShowLogoutButton(false);
    }
  }, [location.pathname, openModal]);

  const toggleModal = () => {
    setOpenModal(!openModal);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-gray-800 to-gray-600 p-4 flex z-40 fixed w-full justify-between items-center px-4">
      <div className="text-white text-xl font-bold z-40 opacity-100 flex flex-col items-center relative">
      <NavLink to={token1 ? "/home" : "/"}>
  <img src={logo} width={50} alt="Logo" className='rounded-md z-40 brightness-110 shadow-lg' />
      </NavLink>
      </div>

      {showLogoutButton && (
        <div className="flex items-center">
          <button className="text-white md:hidden" onClick={toggleMenu}>
            {menuOpen ? <FaTimes size={25}/> : <FaBars size={25}/>}
          </button>
          <button className="text-white hidden md:flex items-center" onClick={toggleModal}>
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>
      )}

      {menuOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end w-full h-full bg-black bg-opacity-50">
          <div className=" bg-gradient-to-r from-gray-500 to-gray-800  dark:bg-gray-700 h-full w-1/2 flex flex-col gap-4 p-6">
            <button
              type="button"
              className="self-end text-gray-100 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={toggleMenu}
            >
              <FaTimes size={25}/>
            </button>
            <NavLink to="/profile" className="flex items-center text-gray-100 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg p-2" onClick={toggleMenu}>
              <FaUser size={25} className="mr-2 text-xl" /> Profile
            </NavLink>
            <NavLink to="/receipts" className="flex items-center text-gray-100 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg p-2" onClick={toggleMenu}>
              <FaReceipt size={25} className="mr-2 text-xl" /> AllReceipts
            </NavLink>
            <button className="flex items-center text-gray-100 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg p-2" onClick={() => {
              toggleModal();
              toggleMenu();
            }}>
              <FaSignOutAlt size={25} className="mr-2 text-xl" /> Logout
            </button>
          </div>
        </div>
      )}

      {openModal && (
        <div id="popup-modal" className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow dark:bg-gray-700 relative p-4 w-full max-w-md">
            <button
              type="button"
              className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={toggleModal}
            >
              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6" />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="p-4 md:p-5 text-center">
              <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to log out?</h3>
              <button
                onClick={handleLogOut}
                type="button"
                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
              >
                Yes, I'm sure
              </button>
              <button
                type="button"
                className="py-2.5 px-5 ml-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                onClick={toggleModal}
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
