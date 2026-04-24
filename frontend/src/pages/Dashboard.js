import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const features = [
  { key: 'designs', path: '/designs', icon: '🎨', title: 'Design Generation', desc: 'AI-powered landscaping designs from property descriptions with plant selections and layout recommendations' },
  { key: 'maintenance', path: '/maintenance', icon: '📅', title: 'Seasonal Maintenance', desc: 'Smart maintenance scheduling with AI-optimized task planning and seasonal recommendations' },
  { key: 'irrigation', path: '/irrigation', icon: '💧', title: 'Irrigation Optimization', desc: 'AI-driven irrigation plans that reduce water usage with zone-by-zone optimization' },
  { key: 'materials', path: '/materials', icon: '🧱', title: 'Material Estimation', desc: 'Accurate material quantity estimates with waste factors, cost breakdowns, and supplier options' },
  { key: 'proposals', path: '/proposals', icon: '📋', title: 'Client Proposals', desc: 'Generate professional client proposals with AI-crafted scope, pricing, and presentation' },
  { key: 'plants', path: '/plants', icon: '🌿', title: 'Plant Database', desc: 'Comprehensive plant library with AI-generated care guides and growing recommendations' },
  { key: 'costs', path: '/costs', icon: '💰', title: 'Cost Calculator', desc: 'Detailed project cost analysis with labor, materials, overhead, and profit optimization' },
  { key: 'projects', path: '/projects', icon: '📊', title: 'Project Management', desc: 'Track landscaping projects with AI-generated timelines and milestone planning' },
  { key: 'soil', path: '/soil', icon: '🔬', title: 'Soil Analysis', desc: 'AI interpretation of soil tests with amendment recommendations and planting guidelines' },
  { key: 'weather', path: '/weather', icon: '🌤️', title: 'Weather Planning', desc: 'Climate-adapted landscaping plans with seasonal preparation and plant protection strategies' },
  { key: 'equipment', path: '/equipment', icon: '🚜', title: 'Equipment Tracking', desc: 'Track equipment inventory, maintenance schedules, and AI-powered maintenance planning' },
  { key: 'crews', path: '/crews', icon: '👷', title: 'Crew Scheduling', desc: 'Manage crew assignments, optimize schedules, and track field team productivity' },
  { key: 'gallery', path: '/gallery', icon: '📸', title: 'Photo Gallery', desc: 'Document project progress with before/after photos and AI-powered photo analysis' },
  { key: 'invoices', path: '/invoices', icon: '🧾', title: 'Invoice Management', desc: 'Create and manage client invoices with AI-powered review and optimization' },
  { key: 'suppliers', path: '/suppliers', icon: '🏪', title: 'Supplier Directory', desc: 'Manage supplier relationships, compare vendors, and get AI procurement recommendations' },
  { key: 'clients', path: '/clients', icon: '👥', title: 'Client Management', desc: 'Track customers, contact information, property details, and client relationships' },
  { key: 'expenses', path: '/expenses', icon: '💵', title: 'Expense Tracking', desc: 'Track business expenses by category, vendor, and project with tax deduction tracking' },
  { key: 'timeEntries', path: '/time-tracking', icon: '⏱️', title: 'Time Tracking', desc: 'Log crew hours, calculate labor costs, and track time by worker and project' },
  { key: 'calculator', path: '/calculator', icon: '🧮', title: 'Measurement Calculator', desc: 'Calculate area, mulch, sod, gravel, fence, and paver quantities with cost estimates' },
  { key: 'reports', path: '/reports', icon: '📊', title: 'Business Reports', desc: 'View revenue, expenses, profit, hours worked, and breakdowns by category and worker' },
  { key: 'profile', path: '/profile', icon: '⚙️', title: 'Profile & Settings', desc: 'Manage your account information, company details, and change password' },
];

function Dashboard() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const endpoints = {
      designs: '/designs',
      maintenance: '/maintenance',
      irrigation: '/irrigation',
      materials: '/materials',
      proposals: '/proposals',
      plants: '/plants',
      costs: '/costs',
      projects: '/projects',
      soil: '/soil',
      weather: '/weather',
      equipment: '/equipment',
      crews: '/crews',
      gallery: '/gallery',
      invoices: '/invoices',
      suppliers: '/suppliers',
      clients: '/clients',
      expenses: '/expenses',
      timeEntries: '/time-entries',
    };

    Object.entries(endpoints).forEach(async ([key, endpoint]) => {
      try {
        const res = await api.get(endpoint);
        setCounts(prev => ({ ...prev, [key]: res.data.length }));
      } catch {
        setCounts(prev => ({ ...prev, [key]: 0 }));
      }
    });
  }, []);

  return (
    <div>
      <div className="dashboard-header">
        <h1>AI Landscaping Command Center</h1>
        <p>Manage your landscaping business with AI-powered tools for design, estimation, and project management</p>
      </div>
      <div className="feature-grid">
        {features.map((f) => (
          <div key={f.key} className="feature-card" onClick={() => navigate(f.path)}>
            <div className="card-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
            <span className="card-count">{counts[f.key] ?? '...'} items</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
