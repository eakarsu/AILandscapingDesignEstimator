const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ClientProposal = sequelize.define('ClientProposal', {
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
  clientEmail: {
    type: DataTypes.STRING
  },
  projectScope: {
    type: DataTypes.TEXT
  },
  estimatedBudget: {
    type: DataTypes.FLOAT
  },
  timeline: {
    type: DataTypes.STRING
  },
  proposalContent: {
    type: DataTypes.TEXT
  },
  aiProposal: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'draft'
  }
}, {
  tableName: 'client_proposals',
  timestamps: true
});

module.exports = ClientProposal;
