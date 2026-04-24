import React from 'react';
import GenericListPage from '../components/GenericListPage';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'specialty', label: 'Specialty' },
  { key: 'contactPerson', label: 'Contact Person' },
  { key: 'rating', label: 'Rating' },
  { key: 'deliveryTime', label: 'Delivery Time' },
  { key: 'status', label: 'Status', render: (v) => <span className={`status-badge status-${v}`}>{v}</span> },
];

const formFields = [
  { key: 'name', label: 'Name', required: true },
  { key: 'contactPerson', label: 'Contact Person' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'address', label: 'Address' },
  { key: 'specialty', label: 'Specialty', type: 'select', options: ['Stone', 'Lumber', 'Plants', 'Soil', 'Irrigation', 'Lighting', 'Tools', 'Chemicals', 'Mulch', 'Fencing'] },
  { key: 'rating', label: 'Rating', type: 'number' },
  { key: 'deliveryTime', label: 'Delivery Time' },
  { key: 'paymentTerms', label: 'Payment Terms' },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

function SuppliersPage() {
  return <GenericListPage title="Suppliers" icon="🏪" endpoint="/suppliers" columns={columns} formFields={formFields} defaultValues={{ status: 'active' }} />;
}

export default SuppliersPage;
