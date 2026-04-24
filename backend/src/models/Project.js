const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  clientName: {
    type: DataTypes.STRING
  },
  address: {
    type: DataTypes.STRING
  },
  projectType: {
    type: DataTypes.STRING
  },
  startDate: {
    type: DataTypes.DATEONLY
  },
  endDate: {
    type: DataTypes.DATEONLY
  },
  budget: {
    type: DataTypes.FLOAT
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  notes: {
    type: DataTypes.TEXT
  },
  aiTimeline: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'planning'
  }
}, {
  tableName: 'projects',
  timestamps: true
});

module.exports = Project;
