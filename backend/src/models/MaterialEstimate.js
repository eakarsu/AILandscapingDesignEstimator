const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MaterialEstimate = sequelize.define('MaterialEstimate', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  projectType: {
    type: DataTypes.STRING
  },
  area: {
    type: DataTypes.FLOAT
  },
  materialType: {
    type: DataTypes.STRING
  },
  quantity: {
    type: DataTypes.FLOAT
  },
  unit: {
    type: DataTypes.STRING
  },
  unitPrice: {
    type: DataTypes.FLOAT
  },
  totalCost: {
    type: DataTypes.FLOAT
  },
  supplier: {
    type: DataTypes.STRING
  },
  aiEstimate: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'estimated'
  }
}, {
  tableName: 'material_estimates',
  timestamps: true
});

module.exports = MaterialEstimate;
