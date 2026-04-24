import React from 'react';
import GenericDetailPage from '../components/GenericDetailPage';

const fields = [
  { key: 'invoiceNumber', label: 'Invoice Number' },
  { key: 'clientName', label: 'Client Name' },
  { key: 'clientEmail', label: 'Client Email', type: 'email' },
  { key: 'projectName', label: 'Project Name' },
  { key: 'services', label: 'Services', type: 'textarea' },
  { key: 'laborTotal', label: 'Labor Total', type: 'number', render: (v) => v ? `$${v.toLocaleString()}` : '—' },
  { key: 'materialTotal', label: 'Material Total', type: 'number', render: (v) => v ? `$${v.toLocaleString()}` : '—' },
  { key: 'taxRate', label: 'Tax Rate', type: 'number' },
  { key: 'totalAmount', label: 'Total Amount', type: 'number', render: (v) => v ? `$${v.toLocaleString()}` : '—' },
  { key: 'dueDate', label: 'Due Date', type: 'date' },
  { key: 'status', label: 'Status' },
];

function InvoiceDetail() {
  return <GenericDetailPage title="Invoices" icon="🧾" endpoint="/invoices" fields={fields} aiField="aiInvoiceReview" aiEndpoint="review" aiButtonLabel="AI Invoice Review" aiTitle="AI Invoice Review" listPath="/invoices" />;
}

export default InvoiceDetail;
