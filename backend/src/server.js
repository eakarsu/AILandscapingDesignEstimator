const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const sequelize = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const designRoutes = require('./routes/designs');
const maintenanceRoutes = require('./routes/maintenance');
const irrigationRoutes = require('./routes/irrigation');
const materialRoutes = require('./routes/materials');
const proposalRoutes = require('./routes/proposals');
const plantRoutes = require('./routes/plants');
const costRoutes = require('./routes/costs');
const projectRoutes = require('./routes/projects');
const soilRoutes = require('./routes/soil');
const weatherRoutes = require('./routes/weather');
const equipmentRoutes = require('./routes/equipment');
const crewRoutes = require('./routes/crews');
const galleryRoutes = require('./routes/gallery');
const invoiceRoutes = require('./routes/invoices');
const supplierRoutes = require('./routes/suppliers');
const clientRoutes = require('./routes/clients');
const expenseRoutes = require('./routes/expenses');
const timeEntryRoutes = require('./routes/timeentries');
const profileRoutes = require('./routes/profile');

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/designs', designRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/irrigation', irrigationRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api/costs', costRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/soil', soilRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/crews', crewRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/time-entries', timeEntryRoutes);
app.use('/api/profile', profileRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
    await sequelize.sync();
    console.log('Models synced');

    app.listen(PORT, () => {
      console.log(`Backend server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
