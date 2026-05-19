const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const IrrigationPlan = sequelize.define('IrrigationPlan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  propertyName: {
    type: DataTypes.STRING
  },
  zoneCount: {
    type: DataTypes.INTEGER
  },
  waterSource: {
    type: DataTypes.STRING
  },
  soilType: {
    type: DataTypes.STRING
  },
  squareFootage: {
    type: DataTypes.FLOAT
  },
  currentUsageGallons: {
    type: DataTypes.FLOAT
  },
  targetSavingsPercent: {
    type: DataTypes.FLOAT
  },
  aiOptimization: {
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
  tableName: 'irrigation_plans',
  timestamps: true
});

module.exports = IrrigationPlan;
