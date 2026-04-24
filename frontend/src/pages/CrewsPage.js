import React from 'react';
import GenericListPage from '../components/GenericListPage';

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'crewLeader', label: 'Crew Leader' },
  { key: 'crewSize', label: 'Crew Size' },
  { key: 'projectName', label: 'Project Name' },
  { key: 'assignedDate', label: 'Assigned Date' },
  { key: 'status', label: 'Status', render: (v) => <span className={`status-badge status-${v}`}>{v}</span> },
];

const formFields = [
  { key: 'title', label: 'Title', required: true },
  { key: 'crewLeader', label: 'Crew Leader', required: true },
  { key: 'crewSize', label: 'Crew Size', type: 'number' },
  { key: 'projectName', label: 'Project Name' },
  { key: 'assignedDate', label: 'Assigned Date', type: 'date' },
  { key: 'startTime', label: 'Start Time' },
  { key: 'endTime', label: 'End Time' },
  { key: 'taskDescription', label: 'Task Description', type: 'textarea' },
  { key: 'skillsRequired', label: 'Skills Required' },
];

function CrewsPage() {
  return <GenericListPage title="Crews" icon="👷" endpoint="/crews" columns={columns} formFields={formFields} defaultValues={{ status: 'active' }} />;
}

export default CrewsPage;
