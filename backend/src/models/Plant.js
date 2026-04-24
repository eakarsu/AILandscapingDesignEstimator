const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Plant = sequelize.define('Plant', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  scientificName: {
    type: DataTypes.STRING
  },
  category: {
    type: DataTypes.STRING
  },
  sunRequirement: {
    type: DataTypes.STRING
  },
  waterNeeds: {
    type: DataTypes.STRING
  },
  hardinessZone: {
    type: DataTypes.STRING
  },
  matureHeight: {
    type: DataTypes.STRING
  },
  bloomSeason: {
    type: DataTypes.STRING
  },
  price: {
    type: DataTypes.FLOAT
  },
  aiCareGuide: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active'
  }
}, {
  tableName: 'plants',
  timestamps: true
});

module.exports = Plant;
