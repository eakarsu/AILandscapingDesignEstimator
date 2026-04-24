import React from 'react';
import GenericDetailPage from '../components/GenericDetailPage';

const fields = [
  { key: 'name', label: 'Name' },
  { key: 'type', label: 'Type', type: 'select', options: ['Mower', 'Trimmer', 'Truck', 'Trailer', 'Chainsaw', 'Blower', 'Aerator', 'Excavator', 'Skid Steer', 'Sprayer'] },
  { key: 'serialNumber', label: 'Serial Number' },
  { key: 'purchaseDate', label: 'Purchase Date', type: 'date' },
  { key: 'purchasePrice', label: 'Purchase Price', type: 'number', render: (v) => v ? `$${v.toLocaleString()}` : '—' },
  { key: 'condition', label: 'Condition', type: 'select', options: ['Excellent', 'Good', 'Fair', 'Poor'] },
  { key: 'assignedTo', label: 'Assigned To' },
  { key: 'notes', label: 'Notes', type: 'textarea' },
  { key: 'status', label: 'Status' },
];

function EquipmentDetail() {
  return <GenericDetailPage title="Equipment" icon="🚜" endpoint="/equipment" fields={fields} aiField="aiMaintenancePlan" aiEndpoint="maintenance-plan" aiButtonLabel="Generate AI Maintenance Plan" aiTitle="AI-Generated Maintenance Plan" listPath="/equipment" />;
}

export default EquipmentDetail;
