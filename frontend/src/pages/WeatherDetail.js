import React from 'react';
import GenericDetailPage from '../components/GenericDetailPage';

const fields = [
  { key: 'title', label: 'Title' },
  { key: 'region', label: 'Region' },
  { key: 'season', label: 'Season', type: 'select', options: ['Spring', 'Summer', 'Fall', 'Winter'] },
  { key: 'avgTemperature', label: 'Avg Temperature', type: 'number', render: (v) => v ? `${v}°F` : '—' },
  { key: 'avgRainfall', label: 'Avg Rainfall', type: 'number', render: (v) => v ? `${v} in/mo` : '—' },
  { key: 'frostRisk', label: 'Frost Risk' },
  { key: 'windExposure', label: 'Wind Exposure' },
  { key: 'recommendations', label: 'Recommendations', type: 'textarea' },
  { key: 'status', label: 'Status' },
];

function WeatherDetail() {
  return <GenericDetailPage title="Weather Plans" icon="🌤️" endpoint="/weather" fields={fields} aiField="aiWeatherPlan" aiEndpoint="plan" aiButtonLabel="Generate AI Weather Plan" aiTitle="AI Weather-Adapted Landscaping Plan" listPath="/weather" />;
}

export default WeatherDetail;
