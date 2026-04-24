const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PhotoGallery = sequelize.define('PhotoGallery', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  projectName: {
    type: DataTypes.STRING
  },
  category: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.TEXT
  },
  location: {
    type: DataTypes.STRING
  },
  dateTaken: {
    type: DataTypes.DATEONLY
  },
  beforeAfter: {
    type: DataTypes.STRING
  },
  tags: {
    type: DataTypes.STRING
  },
  aiAnalysis: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active'
  }
}, {
  tableName: 'photo_gallery',
  timestamps: true
});

module.exports = PhotoGallery;
