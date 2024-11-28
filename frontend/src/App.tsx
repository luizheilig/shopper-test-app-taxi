// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RideRequest from './components/RideRequest';
import RideOptions from './components/RideOptions';
import RideHistory from './components/RideHistory';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RideRequest />} />
        <Route path="/options" element={<RideOptions />} />
        <Route path="/history" element={<RideHistory />} />
      </Routes>
    </Router>
  );
};

export default App;
