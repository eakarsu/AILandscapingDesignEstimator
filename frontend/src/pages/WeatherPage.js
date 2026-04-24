import React from 'react';
import GenericListPage from '../components/GenericListPage';

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'region', label: 'Region' },
  { key: 'season', label: 'Season' },
  { key: 'avgTemperature', label: 'Avg Temp', render: (v) => v ? `${v}°F` : '—' },
  { key: 'avgRainfall', label: 'Rainfall', render: (v) => v ? `${v} in/mo` : '—' },
  { key: 'frostRisk', label: 'Frost Risk' },
  { key: 'windExposure', label: 'Wind' },
  { key: 'status', label: 'Status', render: (v) => <span className={`status-badge status-${v}`}>{v}</span> },
];

const formFields = [
  { key: 'title', label: 'Plan Title', required: true },
  { key: 'region', label: 'Region', required: true },
  { key: 'season', label: 'Season', type: 'select', options: ['Spring', 'Summer', 'Fall', 'Winter'], required: true },
  { key: 'avgTemperature', label: 'Avg Temperature (°F)', type: 'number' },
  { key: 'avgRainfall', label: 'Avg Rainfall (inches/month)', type: 'number' },
  { key: 'frostRisk', label: 'Frost Risk', type: 'select', options: ['None', 'Low', 'Moderate', 'High', 'Severe'] },
  { key: 'windExposure', label: 'Wind Exposure', type: 'select', options: ['Low', 'Moderate', 'High', 'Very High', 'Extreme'] },
  { key: 'recommendations', label: 'Initial Recommendations', type: 'textarea' },
];

function WeatherPage() {
  return <GenericListPage title="Weather Plans" icon="🌤️" endpoint="/weather" columns={columns} formFields={formFields} defaultValues={{ status: 'active' }} />;
}

export default WeatherPage;
