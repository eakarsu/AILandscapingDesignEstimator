const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Equipment = sequelize.define('Equipment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING
  },
  serialNumber: {
    type: DataTypes.STRING
  },
  purchaseDate: {
    type: DataTypes.DATEONLY
  },
  purchasePrice: {
    type: DataTypes.FLOAT
  },
  condition: {
    type: DataTypes.STRING
  },
  lastMaintenanceDate: {
    type: DataTypes.DATEONLY
  },
  nextMaintenanceDate: {
    type: DataTypes.DATEONLY
  },
  assignedTo: {
    type: DataTypes.STRING
  },
  notes: {
    type: DataTypes.TEXT
  },
  aiMaintenancePlan: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active'
  }
}, {
  tableName: 'equipment',
  timestamps: true
});

module.exports = Equipment;
