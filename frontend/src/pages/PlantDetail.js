import React from 'react';
import GenericDetailPage from '../components/GenericDetailPage';

const fields = [
  { key: 'name', label: 'Plant Name' },
  { key: 'scientificName', label: 'Scientific Name' },
  { key: 'category', label: 'Category' },
  { key: 'sunRequirement', label: 'Sun Requirement' },
  { key: 'waterNeeds', label: 'Water Needs' },
  { key: 'hardinessZone', label: 'Hardiness Zone' },
  { key: 'matureHeight', label: 'Mature Height' },
  { key: 'bloomSeason', label: 'Bloom Season' },
  { key: 'price', label: 'Price', type: 'number', render: (v) => v ? `$${Number(v).toFixed(2)}` : '—' },
  { key: 'status', label: 'Status' },
];

function PlantDetail() {
  return <GenericDetailPage title="Plants" icon="🌿" endpoint="/plants" fields={fields} aiField="aiCareGuide" aiEndpoint="care-guide" aiButtonLabel="Generate AI Care Guide" aiTitle="AI Plant Care Guide" listPath="/plants" />;
}

export default PlantDetail;
