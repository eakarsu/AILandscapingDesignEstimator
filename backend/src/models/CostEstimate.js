const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CostEstimate = sequelize.define('CostEstimate', {
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
  laborCost: {
    type: DataTypes.FLOAT
  },
  materialCost: {
    type: DataTypes.FLOAT
  },
  equipmentCost: {
    type: DataTypes.FLOAT
  },
  overheadPercent: {
    type: DataTypes.FLOAT
  },
  profitMarginPercent: {
    type: DataTypes.FLOAT
  },
  totalEstimate: {
    type: DataTypes.FLOAT
  },
  clientName: {
    type: DataTypes.STRING
  },
  aiBreakdown: {
    type: DataTypes.TEXT
  },
  aiAnalysis: {
    type: DataTypes.JSONB,
    defaultValue: null,
    comment: 'Structured JSON AI analysis results'
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'draft'
  }
}, {
  tableName: 'cost_estimates',
  timestamps: true
});

module.exports = CostEstimate;
