import React from 'react';
import GenericListPage from '../components/GenericListPage';

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'propertyName', label: 'Property' },
  { key: 'season', label: 'Season' },
  { key: 'taskType', label: 'Task Type' },
  { key: 'frequency', label: 'Frequency' },
  { key: 'priority', label: 'Priority', render: (v) => <span className={`priority-${v}`}>{v}</span> },
  { key: 'status', label: 'Status', render: (v) => <span className={`status-badge status-${v}`}>{v}</span> },
];

const formFields = [
  { key: 'title', label: 'Schedule Title', required: true },
  { key: 'propertyName', label: 'Property Name', required: true },
  { key: 'season', label: 'Season', type: 'select', options: ['Spring', 'Summer', 'Fall', 'Winter'], required: true },
  { key: 'taskType', label: 'Task Type', type: 'select', options: ['Lawn Care', 'Irrigation', 'Cleanup', 'Pruning', 'Specialty Care', 'Trimming', 'Mulching', 'Pest Control', 'Fertilization', 'Inspection', 'Planting', 'Snow Removal', 'Weed Control', 'Drainage'] },
  { key: 'frequency', label: 'Frequency', type: 'select', options: ['Weekly', 'Bi-weekly', 'Monthly', 'Quarterly', 'Annually', 'As needed'] },
  { key: 'scheduledDate', label: 'Scheduled Date', type: 'date' },
  { key: 'priority', label: 'Priority', type: 'select', options: ['high', 'medium', 'low'] },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

function MaintenancePage() {
  return <GenericListPage title="Maintenance Schedules" icon="📅" endpoint="/maintenance" columns={columns} formFields={formFields} defaultValues={{ status: 'pending', priority: 'medium' }} />;
}

export default MaintenancePage;
