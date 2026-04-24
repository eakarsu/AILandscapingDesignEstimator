import React from 'react';
import GenericListPage from '../components/GenericListPage';

const columns = [
  { key: 'invoiceNumber', label: 'Invoice Number' },
  { key: 'clientName', label: 'Client Name' },
  { key: 'projectName', label: 'Project Name' },
  { key: 'totalAmount', label: 'Total Amount', render: (v) => v ? `$${v.toLocaleString()}` : '—' },
  { key: 'dueDate', label: 'Due Date' },
  { key: 'status', label: 'Status', render: (v) => <span className={`status-badge status-${v}`}>{v}</span> },
];

const formFields = [
  { key: 'invoiceNumber', label: 'Invoice Number', required: true },
  { key: 'clientName', label: 'Client Name', required: true },
  { key: 'clientEmail', label: 'Client Email', type: 'email' },
  { key: 'projectName', label: 'Project Name' },
  { key: 'services', label: 'Services', type: 'textarea' },
  { key: 'laborTotal', label: 'Labor Total ($)', type: 'number' },
  { key: 'materialTotal', label: 'Material Total ($)', type: 'number' },
  { key: 'taxRate', label: 'Tax Rate (%)', type: 'number' },
  { key: 'totalAmount', label: 'Total Amount ($)', type: 'number' },
  { key: 'dueDate', label: 'Due Date', type: 'date' },
];

function InvoicesPage() {
  return <GenericListPage title="Invoices" icon="🧾" endpoint="/invoices" columns={columns} formFields={formFields} defaultValues={{ status: 'draft' }} />;
}

export default InvoicesPage;
