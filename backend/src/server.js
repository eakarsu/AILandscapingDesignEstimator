const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Startup env validation
const required = ['JWT_SECRET', 'OPENROUTER_API_KEY'];
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

// Custom Views (Landscape Views) - mounted BEFORE 404
const customViewsRoutes = require('./routes/customViews');
app.use('/api/custom-views', customViewsRoutes);

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

// === BATCH 05 AUTO-MOUNT (custom feature suggestions) ===
app.use('/api/site-vision-audit', require('./routes/site-vision-audit'));
app.use('/api/crew-scheduling-agent', require('./routes/crew-scheduling-agent'));
app.use('/api/material-price-aggregator', require('./routes/material-price-aggregator'));
app.use('/api/customer-upsell-agent', require('./routes/customer-upsell-agent'));
app.use('/api/franchise-multitenant', require('./routes/franchise-multitenant'));

// === Batch 05 Gaps & Frontend Mounts ===
try { const _gap_design_feasibility_check = require('./routes/gap-design-feasibility-check'); app.use('/api/gap-design-feasibility-check', _gap_design_feasibility_check); } catch(e) { console.error('gap mount fail design-feasibility-check:', e.message); }
try { const _gap_crew_skill_matcher = require('./routes/gap-crew-skill-matcher'); app.use('/api/gap-crew-skill-matcher', _gap_crew_skill_matcher); } catch(e) { console.error('gap mount fail crew-skill-matcher:', e.message); }
try { const _gap_seasonal_demand_forecast = require('./routes/gap-seasonal-demand-forecast'); app.use('/api/gap-seasonal-demand-forecast', _gap_seasonal_demand_forecast); } catch(e) { console.error('gap mount fail seasonal-demand-forecast:', e.message); }
try { const _gap_maintenance_cost_projector = require('./routes/gap-maintenance-cost-projector'); app.use('/api/gap-maintenance-cost-projector', _gap_maintenance_cost_projector); } catch(e) { console.error('gap mount fail maintenance-cost-projector:', e.message); }
try { const _gap_material_price_monitor = require('./routes/gap-material-price-monitor'); app.use('/api/gap-material-price-monitor', _gap_material_price_monitor); } catch(e) { console.error('gap mount fail material-price-monitor:', e.message); }
try { const _gap_project = require('./routes/gap-project'); app.use('/api/gap-project', _gap_project); } catch(e) { console.error('gap mount fail project:', e.message); }
try { const _gap_equipment = require('./routes/gap-equipment'); app.use('/api/gap-equipment', _gap_equipment); } catch(e) { console.error('gap mount fail equipment:', e.message); }
try { const _gap_customer = require('./routes/gap-customer'); app.use('/api/gap-customer', _gap_customer); } catch(e) { console.error('gap mount fail customer:', e.message); }
try { const _gap_mobile = require('./routes/gap-mobile'); app.use('/api/gap-mobile', _gap_mobile); } catch(e) { console.error('gap mount fail mobile:', e.message); }
try { const _gap_compliance = require('./routes/gap-compliance'); app.use('/api/gap-compliance', _gap_compliance); } catch(e) { console.error('gap mount fail compliance:', e.message); }
try { const _gap_webhooks = require('./routes/gap-webhooks'); app.use('/api/gap-webhooks', _gap_webhooks); } catch(e) { console.error('gap mount fail webhooks:', e.message); }
// === End Batch 05 Mounts ===
