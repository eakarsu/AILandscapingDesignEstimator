import React from 'react';
import GenericListPage from '../components/GenericListPage';

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'clientName', label: 'Client' },
  { key: 'projectType', label: 'Type' },
  { key: 'startDate', label: 'Start' },
  { key: 'endDate', label: 'End' },
  { key: 'budget', label: 'Budget', render: (v) => v ? `$${v.toLocaleString()}` : '—' },
  { key: 'progress', label: 'Progress', render: (v) => <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 60, height: 6, borderRadius: 3, background: '#e8f0e8' }}><div style={{ width: `${v || 0}%`, height: '100%', borderRadius: 3, background: '#40916c' }}></div></div><span style={{ fontSize: 12 }}>{v || 0}%</span></div> },
  { key: 'status', label: 'Status', render: (v) => <span className={`status-badge status-${(v || '').replace(/\s+/g, '-')}`}>{v}</span> },
];

const formFields = [
  { key: 'title', label: 'Project Title', required: true },
  { key: 'clientName', label: 'Client Name', required: true },
  { key: 'address', label: 'Address' },
  { key: 'projectType', label: 'Project Type', type: 'select', options: ['Full Renovation', 'Curb Appeal', 'Annual Maintenance', 'HOA Common Area', 'Pool Landscaping', 'Commercial Garden', 'Erosion Control', 'Xeriscape Conversion', 'Estate Design', 'Educational', 'Healing Garden', 'Multi-Unit Residential', 'Fire Mitigation', 'Event Venue', 'Stormwater Management'] },
  { key: 'startDate', label: 'Start Date', type: 'date' },
  { key: 'endDate', label: 'End Date', type: 'date' },
  { key: 'budget', label: 'Budget ($)', type: 'number' },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

function ProjectsPage() {
  return <GenericListPage title="Projects" icon="📊" endpoint="/projects" columns={columns} formFields={formFields} defaultValues={{ status: 'planning', progress: 0 }} />;
}

export default ProjectsPage;
