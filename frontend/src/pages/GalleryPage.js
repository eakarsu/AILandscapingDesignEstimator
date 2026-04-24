import React from 'react';
import GenericListPage from '../components/GenericListPage';

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'projectName', label: 'Project Name' },
  { key: 'category', label: 'Category' },
  { key: 'beforeAfter', label: 'Before/After' },
  { key: 'dateTaken', label: 'Date Taken' },
  { key: 'status', label: 'Status', render: (v) => <span className={`status-badge status-${v}`}>{v}</span> },
];

const formFields = [
  { key: 'title', label: 'Title', required: true },
  { key: 'projectName', label: 'Project Name' },
  { key: 'category', label: 'Category', type: 'select', options: ['Before/After', 'Design', 'Progress', 'Completed', 'Aerial'] },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'location', label: 'Location' },
  { key: 'dateTaken', label: 'Date Taken', type: 'date' },
  { key: 'beforeAfter', label: 'Before/After', type: 'select', options: ['Before', 'During', 'After'] },
  { key: 'tags', label: 'Tags' },
];

function GalleryPage() {
  return <GenericListPage title="Gallery" icon="📸" endpoint="/gallery" columns={columns} formFields={formFields} defaultValues={{ status: 'active' }} />;
}

export default GalleryPage;
