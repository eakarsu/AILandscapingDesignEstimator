const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Design = sequelize.define('Design', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  propertyType: {
    type: DataTypes.STRING
  },
  squareFootage: {
    type: DataTypes.FLOAT
  },
  style: {
    type: DataTypes.STRING
  },
  budget: {
    type: DataTypes.FLOAT
  },
  features: {
    type: DataTypes.TEXT
  },
  aiDesign: {
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
  tableName: 'designs',
  timestamps: true
});

module.exports = Design;
