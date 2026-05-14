import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import DesignsPage from './pages/DesignsPage';
import DesignDetail from './pages/DesignDetail';
import MaintenancePage from './pages/MaintenancePage';
import MaintenanceDetail from './pages/MaintenanceDetail';
import IrrigationPage from './pages/IrrigationPage';
import IrrigationDetail from './pages/IrrigationDetail';
import MaterialsPage from './pages/MaterialsPage';
import MaterialDetail from './pages/MaterialDetail';
import ProposalsPage from './pages/ProposalsPage';
import ProposalDetail from './pages/ProposalDetail';
import PlantsPage from './pages/PlantsPage';
import PlantDetail from './pages/PlantDetail';
import CostsPage from './pages/CostsPage';
import CostDetail from './pages/CostDetail';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetail from './pages/ProjectDetail';
import SoilPage from './pages/SoilPage';
import SoilDetail from './pages/SoilDetail';
import WeatherPage from './pages/WeatherPage';
import WeatherDetail from './pages/WeatherDetail';
import EquipmentPage from './pages/EquipmentPage';
import EquipmentDetail from './pages/EquipmentDetail';
import CrewsPage from './pages/CrewsPage';
import CrewDetail from './pages/CrewDetail';
import GalleryPage from './pages/GalleryPage';
import GalleryDetail from './pages/GalleryDetail';
import InvoicesPage from './pages/InvoicesPage';
import InvoiceDetail from './pages/InvoiceDetail';
import SuppliersPage from './pages/SuppliersPage';
import SupplierDetail from './pages/SupplierDetail';
import ClientsPage from './pages/ClientsPage';
import ClientDetail from './pages/ClientDetail';
import ExpensesPage from './pages/ExpensesPage';
import ExpenseDetail from './pages/ExpenseDetail';
import TimeTrackingPage from './pages/TimeTrackingPage';
import TimeEntryDetail from './pages/TimeEntryDetail';
import CalculatorPage from './pages/CalculatorPage';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';
import AIToolsPage from './pages/AIToolsPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsAuthenticated(true);
  }, []);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <>
        <Login onLogin={handleLogin} />
        <ToastContainer position="top-right" autoClose={3000} />
      </>
    );
  }

  return (
    <Router>
      <Layout onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/designs" element={<DesignsPage />} />
          <Route path="/designs/:id" element={<DesignDetail />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/maintenance/:id" element={<MaintenanceDetail />} />
          <Route path="/irrigation" element={<IrrigationPage />} />
          <Route path="/irrigation/:id" element={<IrrigationDetail />} />
          <Route path="/materials" element={<MaterialsPage />} />
          <Route path="/materials/:id" element={<MaterialDetail />} />
          <Route path="/proposals" element={<ProposalsPage />} />
          <Route path="/proposals/:id" element={<ProposalDetail />} />
          <Route path="/plants" element={<PlantsPage />} />
          <Route path="/plants/:id" element={<PlantDetail />} />
          <Route path="/costs" element={<CostsPage />} />
          <Route path="/costs/:id" element={<CostDetail />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/soil" element={<SoilPage />} />
          <Route path="/soil/:id" element={<SoilDetail />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/weather/:id" element={<WeatherDetail />} />
          <Route path="/equipment" element={<EquipmentPage />} />
          <Route path="/equipment/:id" element={<EquipmentDetail />} />
          <Route path="/crews" element={<CrewsPage />} />
          <Route path="/crews/:id" element={<CrewDetail />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/gallery/:id" element={<GalleryDetail />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/invoices/:id" element={<InvoiceDetail />} />
          <Route path="/suppliers" element={<SuppliersPage />} />
          <Route path="/suppliers/:id" element={<SupplierDetail />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/clients/:id" element={<ClientDetail />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/expenses/:id" element={<ExpenseDetail />} />
          <Route path="/time-tracking" element={<TimeTrackingPage />} />
          <Route path="/time-entries/:id" element={<TimeEntryDetail />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/ai-tools" element={<AIToolsPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
