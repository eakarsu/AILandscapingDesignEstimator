const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  invoiceNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  clientName: {
    type: DataTypes.STRING
  },
  clientEmail: {
    type: DataTypes.STRING
  },
  projectName: {
    type: DataTypes.STRING
  },
  services: {
    type: DataTypes.TEXT
  },
  laborTotal: {
    type: DataTypes.FLOAT
  },
  materialTotal: {
    type: DataTypes.FLOAT
  },
  taxRate: {
    type: DataTypes.FLOAT
  },
  totalAmount: {
    type: DataTypes.FLOAT
  },
  dueDate: {
    type: DataTypes.DATEONLY
  },
  paidDate: {
    type: DataTypes.DATEONLY
  },
  aiInvoiceReview: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending'
  }
}, {
  tableName: 'invoices',
  timestamps: true
});

module.exports = Invoice;
