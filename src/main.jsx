import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import CapaianLO from './pages/lo/Capaian';
import MonitoringLO from './pages/lo/Monitoring';
import UploadForm from './pages/lo/UploadForm';
import AI from './pages/AI';
import ODOI from './pages/ODOI';
import SL from './pages/SL';
import Leaderboard from './pages/Leaderboard';
import FormUploadAset from './pages/FormUploadAset';
import FormUploadSelfLearning from './pages/FormUploadSL';
import FormUploadODOI from './pages/FormUploadODOI';
import Home from './pages/home';
import Login from './pages/admin-pages/Login';
import Dashboard from './pages/home-pages/Dashboard';

//admin
import AdminLogin from './pages/admin-pages/Login';
import AdminLayout from './pages/admin-pages/AdminLayout';
import Pegawai from './pages/admin-pages/Pegawai';
import AdminCapaian from './pages/admin-pages/CapaianLO';
import AdminLeaderboardForm from './pages/admin-pages/AdminLeaderboard';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/lo/capaian" element={<CapaianLO />} />
      <Route path="/lo/monitoring" element={<MonitoringLO />} />
      <Route path="/upload" element={<UploadForm />} />
      <Route path="/ai" element={<AI />} />
      <Route path="/odoi" element={<ODOI />} />
      <Route path="/sl" element={<SL />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/ai/upload" element={<FormUploadAset />} />
      <Route path="/ai/edit/:id" element={<FormUploadAset isEdit />} />
      <Route path="/sl/upload" element={<FormUploadSelfLearning />} />
      <Route path="/sl/edit/:id" element={<FormUploadSelfLearning isEdit />} />
      <Route path="/odoi/upload" element={<FormUploadODOI />} />
      <Route path="/odoi/edit/:id" element={<FormUploadODOI isEdit />} />

{/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="pegawai" element={<Pegawai />} />
        <Route path="capaian" element={<AdminCapaian />} />
        <Route path="leaderboard" element={<AdminLeaderboardForm />} />
      </Route>

    </Routes>
  </BrowserRouter>
);
