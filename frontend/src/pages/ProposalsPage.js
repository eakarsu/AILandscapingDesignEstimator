import React from 'react';
import GenericListPage from '../components/GenericListPage';

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'clientName', label: 'Client' },
  { key: 'clientEmail', label: 'Email' },
  { key: 'estimatedBudget', label: 'Budget', render: (v) => v ? `$${v.toLocaleString()}` : '—' },
  { key: 'timeline', label: 'Timeline' },
  { key: 'status', label: 'Status', render: (v) => <span className={`status-badge status-${v}`}>{v}</span> },
];

const formFields = [
  { key: 'title', label: 'Proposal Title', required: true },
  { key: 'clientName', label: 'Client Name', required: true },
  { key: 'clientEmail', label: 'Client Email', type: 'email' },
  { key: 'projectScope', label: 'Project Scope', type: 'textarea', required: true },
  { key: 'estimatedBudget', label: 'Estimated Budget ($)', type: 'number' },
  { key: 'timeline', label: 'Timeline' },
];

function ProposalsPage() {
  return <GenericListPage title="Client Proposals" icon="📋" endpoint="/proposals" columns={columns} formFields={formFields} defaultValues={{ status: 'draft' }} />;
}

export default ProposalsPage;
