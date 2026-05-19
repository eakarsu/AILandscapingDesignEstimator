const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MaintenanceSchedule = sequelize.define('MaintenanceSchedule', {
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
  season: {
    type: DataTypes.STRING
  },
  taskType: {
    type: DataTypes.STRING
  },
  frequency: {
    type: DataTypes.STRING
  },
  scheduledDate: {
    type: DataTypes.DATEONLY
  },
  priority: {
    type: DataTypes.STRING,
    defaultValue: 'medium'
  },
  notes: {
    type: DataTypes.TEXT
  },
  aiRecommendation: {
    type: DataTypes.TEXT
  },
  aiAnalysis: {
    type: DataTypes.JSONB,
    defaultValue: null,
    comment: 'Structured JSON AI analysis results'
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending'
  }
}, {
  tableName: 'maintenance_schedules',
  timestamps: true
});

module.exports = MaintenanceSchedule;
