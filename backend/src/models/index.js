const sequelize = require('../config/database');
const User = require('./User');
const Design = require('./Design');
const MaintenanceSchedule = require('./MaintenanceSchedule');
const IrrigationPlan = require('./IrrigationPlan');
const MaterialEstimate = require('./MaterialEstimate');
const ClientProposal = require('./ClientProposal');
const Plant = require('./Plant');
const CostEstimate = require('./CostEstimate');
const Project = require('./Project');
const SoilAnalysis = require('./SoilAnalysis');
const WeatherPlan = require('./WeatherPlan');
const Equipment = require('./Equipment');
const CrewSchedule = require('./CrewSchedule');
const PhotoGallery = require('./PhotoGallery');
const Invoice = require('./Invoice');
const Supplier = require('./Supplier');
const Client = require('./Client');
const Expense = require('./Expense');
const TimeEntry = require('./TimeEntry');

module.exports = {
  sequelize,
  User,
  Design,
  MaintenanceSchedule,
  IrrigationPlan,
  MaterialEstimate,
  ClientProposal,
  Plant,
  CostEstimate,
  Project,
  SoilAnalysis,
  WeatherPlan,
  Equipment,
  CrewSchedule,
  PhotoGallery,
  Invoice,
  Supplier,
  Client,
  Expense,
  TimeEntry
};
