import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import DoctorSignup from "./pages/DoctorSignup";

import "./styles/App.css";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          {/* Signup page */}
          <Route path="/signup" element={<Signup />} />

          {/* Dashboard (post-login redirection) */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/doctorSignup" element={<DoctorSignup />} />
          {/* Default route */}
          <Route path="*" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
