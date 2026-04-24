const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Supplier = sequelize.define('Supplier', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contactPerson: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING
  },
  phone: {
    type: DataTypes.STRING
  },
  address: {
    type: DataTypes.STRING
  },
  specialty: {
    type: DataTypes.STRING
  },
  rating: {
    type: DataTypes.FLOAT
  },
  deliveryTime: {
    type: DataTypes.STRING
  },
  paymentTerms: {
    type: DataTypes.STRING
  },
  notes: {
    type: DataTypes.TEXT
  },
  aiSupplierAnalysis: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active'
  }
}, {
  tableName: 'suppliers',
  timestamps: true
});

module.exports = Supplier;
