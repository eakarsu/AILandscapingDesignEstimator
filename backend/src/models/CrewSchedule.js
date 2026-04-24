const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CrewSchedule = sequelize.define('CrewSchedule', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  crewLeader: {
    type: DataTypes.STRING
  },
  crewSize: {
    type: DataTypes.INTEGER
  },
  projectName: {
    type: DataTypes.STRING
  },
  assignedDate: {
    type: DataTypes.DATEONLY
  },
  startTime: {
    type: DataTypes.STRING
  },
  endTime: {
    type: DataTypes.STRING
  },
  taskDescription: {
    type: DataTypes.TEXT
  },
  skillsRequired: {
    type: DataTypes.STRING
  },
  aiScheduleOptimization: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'scheduled'
  }
}, {
  tableName: 'crew_schedules',
  timestamps: true
});

module.exports = CrewSchedule;
