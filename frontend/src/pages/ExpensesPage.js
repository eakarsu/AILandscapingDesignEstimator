import React from 'react';
import GenericListPage from '../components/GenericListPage';

const columns = [
  { key: 'date', label: 'Date' },
  { key: 'description', label: 'Description' },
  { key: 'category', label: 'Category' },
  { key: 'amount', label: 'Amount', render: (v) => v ? `$${v.toLocaleString()}` : '—' },
  { key: 'vendor', label: 'Vendor' },
  { key: 'projectName', label: 'Project' },
  { key: 'status', label: 'Status', render: (v) => <span className={`status-badge status-${v}`}>{v}</span> },
];

const formFields = [
  { key: 'description', label: 'Description', required: true },
  { key: 'amount', label: 'Amount ($)', type: 'number', required: true },
  { key: 'category', label: 'Category', type: 'select', options: ['Fuel', 'Equipment', 'Materials', 'Labor', 'Insurance', 'Vehicle', 'Office', 'Marketing', 'Subcontractor', 'Utilities', 'Rent', 'Maintenance', 'Other'], required: true },
  { key: 'date', label: 'Date', type: 'date', required: true },
  { key: 'vendor', label: 'Vendor' },
  { key: 'paymentMethod', label: 'Payment Method', type: 'select', options: ['Cash', 'Credit Card', 'Debit Card', 'Check', 'Bank Transfer', 'Other'] },
  { key: 'receiptNumber', label: 'Receipt Number' },
  { key: 'projectName', label: 'Project Name' },
  { key: 'taxDeductible', label: 'Tax Deductible', type: 'select', options: ['true', 'false'] },
  { key: 'reimbursable', label: 'Reimbursable', type: 'select', options: ['true', 'false'] },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

function ExpensesPage() {
  return <GenericListPage title="Expenses" icon="💵" endpoint="/expenses" columns={columns} formFields={formFields} defaultValues={{ status: 'pending', date: new Date().toISOString().split('T')[0] }} />;
}

export default ExpensesPage;
