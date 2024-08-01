

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
 // Import the new component
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddDailyReport from './components/AddDailyReport';
import LabourDetails from './components/LabourDetails';
import GenerateReceipt from './components/GenerateReceipt';
import ReceiptDetails from './components/ReceiptDetails';
import ReceiptsList from './components/ReceiptsList';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
// import AnimatedDots from './components/Loader';
import Profile from './pages/Profile';


function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-stone-100">
        <ToastContainer />
         <Navbar/>
        <main className="flex-grow mt-16">
          <Routes>
            <Route path="/home" element={<Dashboard/>} />
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/addreport/:id" element={<AddDailyReport token={token} />} />
            <Route path="/labour/:id" element={<LabourDetails token={token} />} />
            <Route path="/recipt-generate/:id" element={< GenerateReceipt token={token} />} />
            <Route path="/receipts" element={< ReceiptsList token={token} />} />
            <Route path="/receipt/:labourId/:receiptId" element={< ReceiptDetails token={token} />} />
          </Routes>
        </main>
       <Footer/>
      </div>
    </Router>
  );
}

export default App;
