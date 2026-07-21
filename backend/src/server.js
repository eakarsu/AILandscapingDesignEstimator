const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Startup env validation
const required = ['JWT_SECRET', ...(process.env.NODE_ENV === 'test' ? [] : ['OPENROUTER_API_KEY'])];
for (const key of required) {
  if (!process.env[key]) { console.error(`Missing: ${key}`); process.exit(1); }
}

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
const aiRoutes = require('./routes/ai');

const { generalRateLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(generalRateLimiter);

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
app.use('/api/ai', aiRoutes);
app.use('/api/plant-survivability-zone-check', require('./routes/plantSurvivabilityZoneCheck'));

// Custom Views (Landscape Views) - mounted BEFORE 404
const customViewsRoutes = require('./routes/customViews');
app.use('/api/custom-views', customViewsRoutes);
app.use('/api/governed-landscape-designs', require('./governance'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
    if (process.env.AUTO_INIT_SCHEMA === 'true') {
      await sequelize.sync();
      console.log('Models synced');
    }

    app.listen(PORT, () => {
      console.log(`Backend server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

// Generated prototype routes are opt-in for isolated, non-production evaluation.
if (process.env.ENABLE_GENERATED_ROUTES === 'true' && process.env.NODE_ENV !== 'production') {
app.use('/api/site-vision-audit', require('./routes/site-vision-audit'));
app.use('/api/crew-scheduling-agent', require('./routes/crew-scheduling-agent'));
app.use('/api/material-price-aggregator', require('./routes/material-price-aggregator'));
app.use('/api/customer-upsell-agent', require('./routes/customer-upsell-agent'));
app.use('/api/franchise-multitenant', require('./routes/franchise-multitenant'));

}
// Generated gap routes remain deliberately unmounted.
