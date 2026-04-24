const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Expense = sequelize.define('Expense', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  vendor: {
    type: DataTypes.STRING
  },
  paymentMethod: {
    type: DataTypes.STRING
  },
  receiptNumber: {
    type: DataTypes.STRING
  },
  projectName: {
    type: DataTypes.STRING
  },
  taxDeductible: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  reimbursable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  notes: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending'
  }
}, {
  tableName: 'expenses',
  timestamps: true
});

module.exports = Expense;
