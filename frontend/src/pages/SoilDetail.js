import React from 'react';
import GenericDetailPage from '../components/GenericDetailPage';

const fields = [
  { key: 'title', label: 'Title' },
  { key: 'location', label: 'Location' },
  { key: 'soilType', label: 'Soil Type' },
  { key: 'phLevel', label: 'pH Level', type: 'number' },
  { key: 'nitrogenLevel', label: 'Nitrogen' },
  { key: 'phosphorusLevel', label: 'Phosphorus' },
  { key: 'potassiumLevel', label: 'Potassium' },
  { key: 'organicMatter', label: 'Organic Matter' },
  { key: 'drainageRating', label: 'Drainage Rating' },
  { key: 'status', label: 'Status' },
];

function SoilDetail() {
  return <GenericDetailPage title="Soil Analysis" icon="🔬" endpoint="/soil" fields={fields} aiField="aiAnalysis" aiEndpoint="analyze" aiButtonLabel="AI Soil Analysis" aiTitle="AI Soil Analysis & Recommendations" listPath="/soil" />;
}

export default SoilDetail;
