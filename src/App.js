import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import EventList from './pages/EventList';
import AddEvent from './pages/AddEvent';
import EditEvent from './pages/EditEvent';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<EventList />} />
            <Route path="/add" element={<AddEvent />} />
            <Route path="/edit/:id" element={<EditEvent />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;