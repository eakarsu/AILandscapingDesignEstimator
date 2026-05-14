const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WeatherPlan = sequelize.define('WeatherPlan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  region: {
    type: DataTypes.STRING
  },
  season: {
    type: DataTypes.STRING
  },
  avgTemperature: {
    type: DataTypes.FLOAT
  },
  avgRainfall: {
    type: DataTypes.FLOAT
  },
  frostRisk: {
    type: DataTypes.STRING
  },
  windExposure: {
    type: DataTypes.STRING
  },
  recommendations: {
    type: DataTypes.TEXT
  },
  aiWeatherPlan: {
    type: DataTypes.TEXT
  },
  aiAnalysis: {
    type: DataTypes.JSONB,
    defaultValue: null,
    comment: 'Structured JSON AI analysis results'
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active'
  }
}, {
  tableName: 'weather_plans',
  timestamps: true
});

module.exports = WeatherPlan;
