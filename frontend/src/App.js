import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";

import DoctorSignup from "./pages/DoctorSignup";
import AdminDashboard from './pages/AdminDashboard'; 

import "./styles/App.css";
import './index.css';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          {/* Signup page */}
          <Route path="/signup" element={<Signup />} />

          {/* Dashboard (post-login redirection) */}
        
          <Route path="/doctorSignup" element={<DoctorSignup />} />
          {/* Default route */}
        {/*  <Route path="*" element={<Signup />} /> */}     // default route as of admin to check my shit 
          <Route path="*" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
};
export default App;


