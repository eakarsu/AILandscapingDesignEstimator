import React from 'react';
import GenericDetailPage from '../components/GenericDetailPage';

const fields = [
  { key: 'title', label: 'Title' },
  { key: 'clientName', label: 'Client Name' },
  { key: 'clientEmail', label: 'Client Email' },
  { key: 'projectScope', label: 'Project Scope', type: 'textarea' },
  { key: 'estimatedBudget', label: 'Estimated Budget', type: 'number', render: (v) => v ? `$${v.toLocaleString()}` : '—' },
  { key: 'timeline', label: 'Timeline' },
  { key: 'status', label: 'Status' },
];

function ProposalDetail() {
  return <GenericDetailPage title="Proposals" icon="📋" endpoint="/proposals" fields={fields} aiField="aiProposal" aiEndpoint="generate" aiButtonLabel="Generate AI Proposal" aiTitle="AI-Generated Professional Proposal" listPath="/proposals" />;
}

export default ProposalDetail;
