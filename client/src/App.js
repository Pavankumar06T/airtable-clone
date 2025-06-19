import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import CreateTable from './components/CreateTable';
import ViewTable from './pages/ViewTable';
import AddRecord from './pages/AddRecord';

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/tables/create" element={<CreateTable />} />
      <Route path="/tables/:tableId" element={<ViewTable />} />
      <Route path="/tables/:tableId/add-record" element={<AddRecord />} />
      <Route path="/" element={<Register />} />
    </Routes>
  );
}

export default App;