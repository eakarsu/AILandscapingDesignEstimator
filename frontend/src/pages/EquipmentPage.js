import React from 'react';
import GenericListPage from '../components/GenericListPage';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'type', label: 'Type' },
  { key: 'condition', label: 'Condition' },
  { key: 'assignedTo', label: 'Assigned To' },
  { key: 'purchasePrice', label: 'Purchase Price', render: (v) => v ? `$${v.toLocaleString()}` : '—' },
  { key: 'status', label: 'Status', render: (v) => <span className={`status-badge status-${v}`}>{v}</span> },
];

const formFields = [
  { key: 'name', label: 'Name', required: true },
  { key: 'type', label: 'Type', type: 'select', options: ['Mower', 'Trimmer', 'Truck', 'Trailer', 'Chainsaw', 'Blower', 'Aerator', 'Excavator', 'Skid Steer', 'Sprayer'], required: true },
  { key: 'serialNumber', label: 'Serial Number' },
  { key: 'purchaseDate', label: 'Purchase Date', type: 'date' },
  { key: 'purchasePrice', label: 'Purchase Price ($)', type: 'number' },
  { key: 'condition', label: 'Condition', type: 'select', options: ['Excellent', 'Good', 'Fair', 'Poor'] },
  { key: 'assignedTo', label: 'Assigned To' },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

function EquipmentPage() {
  return <GenericListPage title="Equipment" icon="🚜" endpoint="/equipment" columns={columns} formFields={formFields} defaultValues={{ status: 'active' }} />;
}

export default EquipmentPage;
