import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ClientRegistration from './pages/ClientRegistration';
import ClientSearch from './pages/ClientSearch';
import TransactionHistory from './pages/TransactionHistory';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/registro" element={<ClientRegistration />} />
            <Route path="/buscar" element={<ClientSearch />} />
            <Route path="/historial/:clienteId" element={<TransactionHistory />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;