import React from 'react';
import GenericListPage from '../components/GenericListPage';

const columns = [
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'city', label: 'City' },
  { key: 'propertyType', label: 'Property Type' },
  { key: 'status', label: 'Status', render: (v) => <span className={`status-badge status-${v}`}>{v}</span> },
];

const formFields = [
  { key: 'firstName', label: 'First Name', required: true },
  { key: 'lastName', label: 'Last Name', required: true },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'phone', label: 'Phone' },
  { key: 'address', label: 'Address' },
  { key: 'city', label: 'City' },
  { key: 'state', label: 'State' },
  { key: 'zipCode', label: 'Zip Code' },
  { key: 'propertyType', label: 'Property Type', type: 'select', options: ['Residential', 'Commercial', 'Municipal', 'HOA', 'Industrial'] },
  { key: 'propertySize', label: 'Property Size (sq ft)' },
  { key: 'source', label: 'Lead Source', type: 'select', options: ['Referral', 'Website', 'Social Media', 'Google Ads', 'Door-to-Door', 'Trade Show', 'Other'] },
  { key: 'preferredContact', label: 'Preferred Contact', type: 'select', options: ['email', 'phone', 'text'] },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

function ClientsPage() {
  return <GenericListPage title="Clients" icon="👥" endpoint="/clients" columns={columns} formFields={formFields} defaultValues={{ status: 'active', preferredContact: 'email' }} />;
}

export default ClientsPage;
