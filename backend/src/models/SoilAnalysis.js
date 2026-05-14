const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SoilAnalysis = sequelize.define('SoilAnalysis', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING
  },
  soilType: {
    type: DataTypes.STRING
  },
  phLevel: {
    type: DataTypes.FLOAT
  },
  nitrogenLevel: {
    type: DataTypes.STRING
  },
  phosphorusLevel: {
    type: DataTypes.STRING
  },
  potassiumLevel: {
    type: DataTypes.STRING
  },
  organicMatter: {
    type: DataTypes.STRING
  },
  drainageRating: {
    type: DataTypes.STRING
  },
  aiAnalysis: {
    type: DataTypes.TEXT
  },
  aiAnalysisJson: {
    type: DataTypes.JSONB,
    defaultValue: null,
    comment: 'Structured JSON AI analysis results'
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending'
  }
}, {
  tableName: 'soil_analyses',
  timestamps: true
});

module.exports = SoilAnalysis;
