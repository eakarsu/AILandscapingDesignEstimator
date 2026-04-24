import React from 'react';
import GenericDetailPage from '../components/GenericDetailPage';

const fields = [
  { key: 'title', label: 'Title' },
  { key: 'crewLeader', label: 'Crew Leader' },
  { key: 'crewSize', label: 'Crew Size', type: 'number' },
  { key: 'projectName', label: 'Project Name' },
  { key: 'assignedDate', label: 'Assigned Date', type: 'date' },
  { key: 'startTime', label: 'Start Time' },
  { key: 'endTime', label: 'End Time' },
  { key: 'taskDescription', label: 'Task Description', type: 'textarea' },
  { key: 'skillsRequired', label: 'Skills Required' },
  { key: 'status', label: 'Status' },
];

function CrewDetail() {
  return <GenericDetailPage title="Crews" icon="👷" endpoint="/crews" fields={fields} aiField="aiScheduleOptimization" aiEndpoint="optimize" aiButtonLabel="Optimize Crew Schedule" aiTitle="AI-Optimized Crew Schedule" listPath="/crews" />;
}

export default CrewDetail;
