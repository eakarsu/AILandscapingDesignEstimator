const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Client = sequelize.define('Client', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
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
  city: {
    type: DataTypes.STRING
  },
  state: {
    type: DataTypes.STRING
  },
  zipCode: {
    type: DataTypes.STRING
  },
  propertyType: {
    type: DataTypes.STRING
  },
  propertySize: {
    type: DataTypes.STRING
  },
  preferredContact: {
    type: DataTypes.STRING,
    defaultValue: 'email'
  },
  notes: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active'
  },
  source: {
    type: DataTypes.STRING
  },
  totalSpent: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  }
}, {
  tableName: 'clients',
  timestamps: true
});

module.exports = Client;
