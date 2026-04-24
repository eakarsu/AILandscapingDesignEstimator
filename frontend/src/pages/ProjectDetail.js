import React from 'react';
import GenericDetailPage from '../components/GenericDetailPage';

const fields = [
  { key: 'title', label: 'Title' },
  { key: 'clientName', label: 'Client' },
  { key: 'address', label: 'Address' },
  { key: 'projectType', label: 'Project Type' },
  { key: 'startDate', label: 'Start Date', type: 'date' },
  { key: 'endDate', label: 'End Date', type: 'date' },
  { key: 'budget', label: 'Budget', type: 'number', render: (v) => v ? `$${v.toLocaleString()}` : '—' },
  { key: 'progress', label: 'Progress', type: 'number', render: (v) => `${v || 0}%` },
  { key: 'notes', label: 'Notes', type: 'textarea' },
  { key: 'status', label: 'Status', type: 'select', options: ['planning', 'in-progress', 'completed', 'on-hold'] },
];

function ProjectDetail() {
  return <GenericDetailPage title="Projects" icon="📊" endpoint="/projects" fields={fields} aiField="aiTimeline" aiEndpoint="timeline" aiButtonLabel="Generate AI Timeline" aiTitle="AI Project Timeline & Milestones" listPath="/projects" />;
}

export default ProjectDetail;
