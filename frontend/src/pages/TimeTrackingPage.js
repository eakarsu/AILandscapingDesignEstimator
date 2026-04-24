import React from 'react';
import GenericListPage from '../components/GenericListPage';

const columns = [
  { key: 'date', label: 'Date' },
  { key: 'workerName', label: 'Worker' },
  { key: 'projectName', label: 'Project' },
  { key: 'startTime', label: 'Start' },
  { key: 'endTime', label: 'End' },
  { key: 'hoursWorked', label: 'Hours', render: (v) => v ? `${v}h` : '—' },
  { key: 'taskType', label: 'Task' },
  { key: 'status', label: 'Status', render: (v) => <span className={`status-badge status-${v}`}>{v}</span> },
];

const formFields = [
  { key: 'workerName', label: 'Worker Name', required: true },
  { key: 'projectName', label: 'Project Name', required: true },
  { key: 'date', label: 'Date', type: 'date', required: true },
  { key: 'startTime', label: 'Start Time', type: 'time', required: true },
  { key: 'endTime', label: 'End Time', type: 'time', required: true },
  { key: 'taskType', label: 'Task Type', type: 'select', options: ['Mowing', 'Planting', 'Trimming', 'Mulching', 'Irrigation', 'Hardscaping', 'Cleanup', 'Design', 'Consultation', 'Travel', 'Equipment Maintenance', 'Other'] },
  { key: 'hourlyRate', label: 'Hourly Rate ($)', type: 'number' },
  { key: 'breakMinutes', label: 'Break (minutes)', type: 'number' },
  { key: 'overtime', label: 'Overtime', type: 'select', options: ['false', 'true'] },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

function TimeTrackingPage() {
  return <GenericListPage title="Time Tracking" icon="⏱️" endpoint="/time-entries" columns={columns} formFields={formFields} defaultValues={{ status: 'pending', date: new Date().toISOString().split('T')[0], breakMinutes: 0 }} />;
}

export default TimeTrackingPage;
