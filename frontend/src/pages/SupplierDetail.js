import React from 'react';
import GenericDetailPage from '../components/GenericDetailPage';

const fields = [
  { key: 'name', label: 'Name' },
  { key: 'contactPerson', label: 'Contact Person' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'address', label: 'Address' },
  { key: 'specialty', label: 'Specialty', type: 'select', options: ['Stone', 'Lumber', 'Plants', 'Soil', 'Irrigation', 'Lighting', 'Tools', 'Chemicals', 'Mulch', 'Fencing'] },
  { key: 'rating', label: 'Rating', type: 'number' },
  { key: 'deliveryTime', label: 'Delivery Time' },
  { key: 'paymentTerms', label: 'Payment Terms' },
  { key: 'notes', label: 'Notes', type: 'textarea' },
  { key: 'status', label: 'Status' },
];

function SupplierDetail() {
  return <GenericDetailPage title="Suppliers" icon="🏪" endpoint="/suppliers" fields={fields} aiField="aiSupplierAnalysis" aiEndpoint="analyze" aiButtonLabel="AI Supplier Analysis" aiTitle="AI Supplier Analysis" listPath="/suppliers" />;
}

export default SupplierDetail;
