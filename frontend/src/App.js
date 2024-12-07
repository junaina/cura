import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import DoctorSignup from "./pages/DoctorSignup";
import "./styles/App.css";
import DoctorDashboard from "./pages/DoctorDashboard";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          {/* Signup page */}
          <Route path="/" element={<DoctorDashboard />} />

          
          {/* <Route path="/signup" element={<Signup />} />
           <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/doctorSignup" element={<DoctorSignup />} />
                    <Route path="*" element={<Signup />} />  */}

        </Routes>
      </div>
    </Router>
  );
};

export default App;
