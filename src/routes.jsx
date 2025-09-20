import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StorePage from './pages/StorePage';
import AdminDashboard from './components/AdminDashboard';

// Router component
const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StorePage />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        {/* Add more routes here as needed */}
      </Routes>
    </Router>
  );
};

export default AppRouter;
