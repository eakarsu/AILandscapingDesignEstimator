import React from 'react';
import GenericDetailPage from '../components/GenericDetailPage';

const fields = [
  { key: 'title', label: 'Title' },
  { key: 'propertyName', label: 'Property Name' },
  { key: 'season', label: 'Season', type: 'select', options: ['Spring', 'Summer', 'Fall', 'Winter'] },
  { key: 'taskType', label: 'Task Type' },
  { key: 'frequency', label: 'Frequency' },
  { key: 'scheduledDate', label: 'Scheduled Date', type: 'date' },
  { key: 'priority', label: 'Priority', type: 'select', options: ['high', 'medium', 'low'], render: (v) => <span className={`priority-${v}`}>{v}</span> },
  { key: 'notes', label: 'Notes', type: 'textarea' },
  { key: 'status', label: 'Status' },
];

function MaintenanceDetail() {
  return <GenericDetailPage title="Maintenance" icon="📅" endpoint="/maintenance" fields={fields} aiField="aiRecommendation" aiEndpoint="generate" aiButtonLabel="Generate AI Schedule" aiTitle="AI Maintenance Recommendations" listPath="/maintenance" />;
}

export default MaintenanceDetail;
