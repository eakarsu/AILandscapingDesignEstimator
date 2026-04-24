const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TimeEntry = sequelize.define('TimeEntry', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  workerName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  projectName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  startTime: {
    type: DataTypes.STRING,
    allowNull: false
  },
  endTime: {
    type: DataTypes.STRING,
    allowNull: false
  },
  hoursWorked: {
    type: DataTypes.FLOAT
  },
  hourlyRate: {
    type: DataTypes.FLOAT
  },
  taskType: {
    type: DataTypes.STRING
  },
  breakMinutes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  overtime: {
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
  tableName: 'time_entries',
  timestamps: true
});

module.exports = TimeEntry;
