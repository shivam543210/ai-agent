import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchPage from './pages/SearchPage';
import JobsPage from './pages/JobsPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar />
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/jobs" element={<JobsPage />} />
      </Routes>
    </div>
  );
}

export default App;
