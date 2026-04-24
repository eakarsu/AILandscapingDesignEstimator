import React from 'react';
import GenericDetailPage from '../components/GenericDetailPage';

const fields = [
  { key: 'title', label: 'Title' },
  { key: 'projectName', label: 'Project Name' },
  { key: 'category', label: 'Category', type: 'select', options: ['Before/After', 'Design', 'Progress', 'Completed', 'Aerial'] },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'location', label: 'Location' },
  { key: 'dateTaken', label: 'Date Taken', type: 'date' },
  { key: 'beforeAfter', label: 'Before/After', type: 'select', options: ['Before', 'During', 'After'] },
  { key: 'tags', label: 'Tags' },
  { key: 'status', label: 'Status' },
];

function GalleryDetail() {
  return <GenericDetailPage title="Gallery" icon="📸" endpoint="/gallery" fields={fields} aiField="aiAnalysis" aiEndpoint="analyze" aiButtonLabel="AI Photo Analysis" aiTitle="AI Photo Analysis" listPath="/gallery" />;
}

export default GalleryDetail;
