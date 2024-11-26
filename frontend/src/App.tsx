import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RideRequest from './components/RideRequest';
import RideHistory from './components/RideHistory';
import RideOptions from './components/RideOptions';

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