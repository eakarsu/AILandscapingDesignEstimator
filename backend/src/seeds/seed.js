const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
if (process.env.ALLOW_DEMO_SEED !== 'true' || process.env.NODE_ENV === 'production') {
  throw new Error('Demo seed is quarantined; set ALLOW_DEMO_SEED=true outside production to run explicitly');
}
if (!process.env.DEMO_SEED_PASSWORD || process.env.DEMO_SEED_PASSWORD.length < 12) {
  throw new Error('DEMO_SEED_PASSWORD must be explicitly supplied with at least 12 characters');
}
const sequelize = require('../config/database');
const User = require('../models/User');
const Design = require('../models/Design');
const MaintenanceSchedule = require('../models/MaintenanceSchedule');
const IrrigationPlan = require('../models/IrrigationPlan');
const MaterialEstimate = require('../models/MaterialEstimate');
const ClientProposal = require('../models/ClientProposal');
const Plant = require('../models/Plant');
const CostEstimate = require('../models/CostEstimate');
const Project = require('../models/Project');
const SoilAnalysis = require('../models/SoilAnalysis');
const WeatherPlan = require('../models/WeatherPlan');
const Equipment = require('../models/Equipment');
const CrewSchedule = require('../models/CrewSchedule');
const PhotoGallery = require('../models/PhotoGallery');
const Invoice = require('../models/Invoice');
const Supplier = require('../models/Supplier');
const Client = require('../models/Client');
const Expense = require('../models/Expense');
const TimeEntry = require('../models/TimeEntry');

async function seed() {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced successfully');

    // Seed Users
    const hashedPassword = await bcrypt.hash(process.env.DEMO_SEED_PASSWORD, 10);
    await User.bulkCreate([
      { name: 'Admin User', email: 'admin@landscaping.com', password: hashedPassword, company: 'GreenScape Pro', role: 'admin' },
      { name: 'John Designer', email: 'john@landscaping.com', password: hashedPassword, company: 'GreenScape Pro', role: 'user' }
    ]);
    console.log('Users seeded');

    // Seed Designs (15 items)
    await Design.bulkCreate([
      { title: 'Modern Zen Garden', description: 'Minimalist Japanese-inspired garden with water features', propertyType: 'Residential', squareFootage: 2500, style: 'Japanese Zen', budget: 15000, features: 'Rock garden, bamboo fence, koi pond, moss pathways', status: 'draft' },
      { title: 'Mediterranean Oasis', description: 'Warm-climate garden with drought-resistant plants', propertyType: 'Residential', squareFootage: 4000, style: 'Mediterranean', budget: 25000, features: 'Olive trees, lavender beds, terracotta planters, gravel paths', status: 'draft' },
      { title: 'English Cottage Garden', description: 'Traditional English garden with mixed borders', propertyType: 'Residential', squareFootage: 3000, style: 'English Cottage', budget: 18000, features: 'Rose arbors, perennial borders, winding paths, bird baths', status: 'draft' },
      { title: 'Corporate Campus Green', description: 'Professional landscape for office complex', propertyType: 'Commercial', squareFootage: 15000, style: 'Modern Corporate', budget: 75000, features: 'Outdoor seating, native plantings, walking trails, rain gardens', status: 'draft' },
      { title: 'Tropical Paradise Backyard', description: 'Lush tropical landscape with pool area', propertyType: 'Residential', squareFootage: 5000, style: 'Tropical', budget: 35000, features: 'Palm trees, hibiscus, pool landscaping, tiki bar area', status: 'draft' },
      { title: 'Desert Xeriscape', description: 'Water-efficient desert landscape design', propertyType: 'Residential', squareFootage: 3500, style: 'Desert Modern', budget: 12000, features: 'Cacti, succulents, decomposed granite, boulder accents', status: 'draft' },
      { title: 'Farm-to-Table Garden', description: 'Edible landscape with vegetable gardens', propertyType: 'Residential', squareFootage: 2000, style: 'Farmhouse', budget: 8000, features: 'Raised beds, herb spiral, fruit trees, greenhouse', status: 'draft' },
      { title: 'Contemporary Minimalist', description: 'Clean lines with architectural plants', propertyType: 'Residential', squareFootage: 1800, style: 'Contemporary', budget: 20000, features: 'Ornamental grasses, geometric planters, LED lighting, water wall', status: 'draft' },
      { title: 'Woodland Retreat', description: 'Natural woodland garden design', propertyType: 'Residential', squareFootage: 8000, style: 'Naturalistic', budget: 30000, features: 'Native trees, fern gardens, stream bed, stone bridges', status: 'draft' },
      { title: 'Rooftop Garden Design', description: 'Urban rooftop green space', propertyType: 'Commercial', squareFootage: 1500, style: 'Urban Modern', budget: 22000, features: 'Container gardens, wind screens, sedum roof, lounge area', status: 'draft' },
      { title: 'Playground Park Design', description: 'Family-friendly outdoor play space', propertyType: 'Commercial', squareFootage: 10000, style: 'Recreational', budget: 50000, features: 'Play structures, shade trees, rubber mulch, splash pad', status: 'draft' },
      { title: 'Coastal Garden', description: 'Salt-tolerant seaside garden', propertyType: 'Residential', squareFootage: 3000, style: 'Coastal', budget: 16000, features: 'Beach grasses, dune plants, driftwood accents, outdoor shower', status: 'draft' },
      { title: 'Formal French Garden', description: 'Symmetrical formal garden with hedges', propertyType: 'Residential', squareFootage: 6000, style: 'French Formal', budget: 45000, features: 'Boxwood hedges, parterre, fountain, gravel allées', status: 'draft' },
      { title: 'Pollinator Paradise', description: 'Garden designed to attract butterflies and bees', propertyType: 'Residential', squareFootage: 2200, style: 'Wildlife-Friendly', budget: 10000, features: 'Butterfly bush, milkweed, bee hotels, native wildflowers', status: 'draft' },
      { title: 'Sports Court Landscape', description: 'Landscaping around residential sports court', propertyType: 'Residential', squareFootage: 4500, style: 'Athletic Modern', budget: 28000, features: 'Privacy hedges, spectator seating, lighting, shade structures', status: 'draft' }
    ]);
    console.log('Designs seeded');

    // Seed Maintenance Schedules (15 items)
    await MaintenanceSchedule.bulkCreate([
      { title: 'Spring Lawn Revival', propertyName: 'Johnson Residence', season: 'Spring', taskType: 'Lawn Care', frequency: 'Weekly', scheduledDate: '2026-04-01', priority: 'high', notes: 'Aerate, overseed, apply pre-emergent', status: 'pending' },
      { title: 'Summer Irrigation Check', propertyName: 'Smith Estate', season: 'Summer', taskType: 'Irrigation', frequency: 'Bi-weekly', scheduledDate: '2026-06-15', priority: 'high', notes: 'Check all zones, adjust heads, repair leaks', status: 'pending' },
      { title: 'Fall Leaf Cleanup', propertyName: 'Williams Property', season: 'Fall', taskType: 'Cleanup', frequency: 'Weekly', scheduledDate: '2026-10-01', priority: 'medium', notes: 'Leaf removal, gutter cleaning, bed preparation', status: 'pending' },
      { title: 'Winter Pruning Schedule', propertyName: 'Davis Manor', season: 'Winter', taskType: 'Pruning', frequency: 'Monthly', scheduledDate: '2026-01-15', priority: 'medium', notes: 'Dormant pruning of trees and shrubs', status: 'pending' },
      { title: 'Rose Garden Maintenance', propertyName: 'Thompson Gardens', season: 'Spring', taskType: 'Specialty Care', frequency: 'Weekly', scheduledDate: '2026-03-20', priority: 'high', notes: 'Deadheading, spraying, fertilizing roses', status: 'pending' },
      { title: 'Hedge Trimming Service', propertyName: 'Corporate Plaza', season: 'Summer', taskType: 'Trimming', frequency: 'Monthly', scheduledDate: '2026-05-01', priority: 'medium', notes: 'Formal hedge shaping, privacy screen maintenance', status: 'pending' },
      { title: 'Mulch Refresh', propertyName: 'Anderson Residence', season: 'Spring', taskType: 'Mulching', frequency: 'Annually', scheduledDate: '2026-04-15', priority: 'low', notes: 'Apply 3 inches fresh hardwood mulch to all beds', status: 'pending' },
      { title: 'Pest Control Treatment', propertyName: 'Baker Property', season: 'Summer', taskType: 'Pest Control', frequency: 'Monthly', scheduledDate: '2026-06-01', priority: 'high', notes: 'Grub treatment, Japanese beetle prevention', status: 'pending' },
      { title: 'Fertilization Program', propertyName: 'Clark Estate', season: 'Spring', taskType: 'Fertilization', frequency: 'Quarterly', scheduledDate: '2026-04-10', priority: 'medium', notes: 'Slow-release fertilizer application for all turf areas', status: 'pending' },
      { title: 'Tree Health Assessment', propertyName: 'Green Valley HOA', season: 'Fall', taskType: 'Inspection', frequency: 'Annually', scheduledDate: '2026-09-15', priority: 'high', notes: 'Inspect mature oaks and elms for disease', status: 'pending' },
      { title: 'Perennial Division', propertyName: 'Mitchell Garden', season: 'Fall', taskType: 'Planting', frequency: 'Annually', scheduledDate: '2026-09-20', priority: 'low', notes: 'Divide overgrown hostas, daylilies, and iris', status: 'pending' },
      { title: 'Snow Removal Prep', propertyName: 'Downtown Office Park', season: 'Winter', taskType: 'Snow Removal', frequency: 'As needed', scheduledDate: '2026-11-15', priority: 'high', notes: 'Stage equipment, mark obstacles, stock salt', status: 'pending' },
      { title: 'Weed Management Program', propertyName: 'Sunrise Subdivision', season: 'Summer', taskType: 'Weed Control', frequency: 'Bi-weekly', scheduledDate: '2026-05-15', priority: 'medium', notes: 'Spot treatment and pre-emergent application', status: 'pending' },
      { title: 'Annual Flower Installation', propertyName: 'City Hall Gardens', season: 'Spring', taskType: 'Planting', frequency: 'Annually', scheduledDate: '2026-05-01', priority: 'medium', notes: 'Install 500 annuals in display beds', status: 'pending' },
      { title: 'Drainage System Maintenance', propertyName: 'Riverside Property', season: 'Fall', taskType: 'Drainage', frequency: 'Annually', scheduledDate: '2026-10-15', priority: 'high', notes: 'Clean French drains, check sump pumps, grade check', status: 'pending' }
    ]);
    console.log('Maintenance schedules seeded');

    // Seed Irrigation Plans (15 items)
    await IrrigationPlan.bulkCreate([
      { title: 'Smart Drip System - Front Yard', propertyName: 'Johnson Residence', zoneCount: 4, waterSource: 'Municipal', soilType: 'Loam', squareFootage: 2500, currentUsageGallons: 3000, targetSavingsPercent: 30, status: 'draft' },
      { title: 'Rotary Sprinkler Network', propertyName: 'Smith Estate', zoneCount: 8, waterSource: 'Well', soilType: 'Sandy Loam', squareFootage: 8000, currentUsageGallons: 12000, targetSavingsPercent: 25, status: 'draft' },
      { title: 'Rain Harvesting Integration', propertyName: 'Green Corp HQ', zoneCount: 6, waterSource: 'Rainwater + Municipal', soilType: 'Clay', squareFootage: 5000, currentUsageGallons: 6000, targetSavingsPercent: 40, status: 'draft' },
      { title: 'Xeriscaping Drip Conversion', propertyName: 'Desert View Home', zoneCount: 3, waterSource: 'Municipal', soilType: 'Sandy', squareFootage: 3500, currentUsageGallons: 4500, targetSavingsPercent: 50, status: 'draft' },
      { title: 'Athletic Field Irrigation', propertyName: 'Lincoln High School', zoneCount: 12, waterSource: 'Municipal', soilType: 'Loam', squareFootage: 50000, currentUsageGallons: 80000, targetSavingsPercent: 20, status: 'draft' },
      { title: 'Rooftop Garden Drip System', propertyName: 'Metro Tower', zoneCount: 3, waterSource: 'Municipal', soilType: 'Container Mix', squareFootage: 1200, currentUsageGallons: 800, targetSavingsPercent: 35, status: 'draft' },
      { title: 'Backyard Micro-Spray Setup', propertyName: 'Williams Property', zoneCount: 5, waterSource: 'Municipal', soilType: 'Silt Loam', squareFootage: 3000, currentUsageGallons: 4000, targetSavingsPercent: 30, status: 'draft' },
      { title: 'Commercial Landscape Retrofit', propertyName: 'Shopping Center', zoneCount: 15, waterSource: 'Municipal', soilType: 'Clay Loam', squareFootage: 25000, currentUsageGallons: 35000, targetSavingsPercent: 35, status: 'draft' },
      { title: 'Vegetable Garden Irrigation', propertyName: 'Farm Fresh Estate', zoneCount: 4, waterSource: 'Well', soilType: 'Rich Loam', squareFootage: 1500, currentUsageGallons: 2000, targetSavingsPercent: 25, status: 'draft' },
      { title: 'Greenhouse Misting System', propertyName: 'Botanical Center', zoneCount: 6, waterSource: 'Municipal', soilType: 'Potting Mix', squareFootage: 3000, currentUsageGallons: 1500, targetSavingsPercent: 20, status: 'draft' },
      { title: 'Slope Irrigation Solution', propertyName: 'Hillside Retreat', zoneCount: 5, waterSource: 'Municipal', soilType: 'Rocky Clay', squareFootage: 4000, currentUsageGallons: 5000, targetSavingsPercent: 30, status: 'draft' },
      { title: 'Pool Area Landscape Watering', propertyName: 'Davis Pool House', zoneCount: 3, waterSource: 'Municipal', soilType: 'Sandy Loam', squareFootage: 1800, currentUsageGallons: 2200, targetSavingsPercent: 25, status: 'draft' },
      { title: 'Native Garden Low-Flow Plan', propertyName: 'Eco Living Community', zoneCount: 7, waterSource: 'Rainwater', soilType: 'Native Clay', squareFootage: 6000, currentUsageGallons: 3000, targetSavingsPercent: 45, status: 'draft' },
      { title: 'HOA Common Area System', propertyName: 'Sunset Ridge HOA', zoneCount: 10, waterSource: 'Municipal', soilType: 'Loam', squareFootage: 20000, currentUsageGallons: 28000, targetSavingsPercent: 30, status: 'draft' },
      { title: 'Smart Controller Upgrade', propertyName: 'Anderson Residence', zoneCount: 6, waterSource: 'Municipal', soilType: 'Silt', squareFootage: 4500, currentUsageGallons: 5500, targetSavingsPercent: 35, status: 'draft' }
    ]);
    console.log('Irrigation plans seeded');

    // Seed Material Estimates (15 items)
    await MaterialEstimate.bulkCreate([
      { title: 'Patio Pavers - Bluestone', projectType: 'Hardscaping', area: 400, materialType: 'Natural Stone Pavers', quantity: 450, unit: 'sq ft', unitPrice: 12.50, totalCost: 5625, supplier: 'Stone World Supply', status: 'estimated' },
      { title: 'Decomposed Granite Pathway', projectType: 'Pathway', area: 200, materialType: 'Decomposed Granite', quantity: 8, unit: 'tons', unitPrice: 45, totalCost: 360, supplier: 'Rock Yard Direct', status: 'estimated' },
      { title: 'Cedar Privacy Fence', projectType: 'Fencing', area: 150, materialType: 'Western Red Cedar', quantity: 75, unit: 'boards', unitPrice: 28, totalCost: 2100, supplier: 'Lumber Pro', status: 'estimated' },
      { title: 'Topsoil for Garden Beds', projectType: 'Soil Work', area: 800, materialType: 'Premium Topsoil', quantity: 30, unit: 'cubic yards', unitPrice: 35, totalCost: 1050, supplier: 'Earth Materials Inc', status: 'estimated' },
      { title: 'Concrete Retaining Wall Blocks', projectType: 'Retaining Wall', area: 120, materialType: 'Interlocking Blocks', quantity: 600, unit: 'blocks', unitPrice: 4.50, totalCost: 2700, supplier: 'Belgard Dealer', status: 'estimated' },
      { title: 'Landscape Lighting Kit', projectType: 'Lighting', area: 2000, materialType: 'LED Path Lights', quantity: 24, unit: 'fixtures', unitPrice: 85, totalCost: 2040, supplier: 'Kichler Lighting', status: 'estimated' },
      { title: 'Drip Irrigation Supplies', projectType: 'Irrigation', area: 1500, materialType: 'Drip Tubing & Emitters', quantity: 500, unit: 'feet', unitPrice: 1.20, totalCost: 600, supplier: 'Irrigation Direct', status: 'estimated' },
      { title: 'Hardwood Mulch Delivery', projectType: 'Mulching', area: 3000, materialType: 'Double-Shred Hardwood', quantity: 40, unit: 'cubic yards', unitPrice: 32, totalCost: 1280, supplier: 'Green Waste Solutions', status: 'estimated' },
      { title: 'Ornamental Gravel', projectType: 'Decorative', area: 300, materialType: 'River Rock', quantity: 5, unit: 'tons', unitPrice: 65, totalCost: 325, supplier: 'Stone World Supply', status: 'estimated' },
      { title: 'Sod Installation Material', projectType: 'Lawn', area: 5000, materialType: 'Bermuda Sod', quantity: 5000, unit: 'sq ft', unitPrice: 0.85, totalCost: 4250, supplier: 'Turf Masters', status: 'estimated' },
      { title: 'Composite Deck Boards', projectType: 'Decking', area: 350, materialType: 'Trex Composite', quantity: 100, unit: 'boards', unitPrice: 42, totalCost: 4200, supplier: 'Deck Pros Supply', status: 'estimated' },
      { title: 'Water Feature Pump & Basin', projectType: 'Water Feature', area: 50, materialType: 'Fountain Kit', quantity: 1, unit: 'kit', unitPrice: 850, totalCost: 850, supplier: 'Aquascape Dealer', status: 'estimated' },
      { title: 'Pergola Lumber Package', projectType: 'Structure', area: 200, materialType: 'Pressure-Treated Pine', quantity: 45, unit: 'boards', unitPrice: 18, totalCost: 810, supplier: 'Lumber Pro', status: 'estimated' },
      { title: 'Weed Barrier Fabric', projectType: 'Ground Cover', area: 2000, materialType: 'Commercial Grade Fabric', quantity: 2000, unit: 'sq ft', unitPrice: 0.45, totalCost: 900, supplier: 'Landscape Supply Co', status: 'estimated' },
      { title: 'Outdoor Kitchen Stone Veneer', projectType: 'Outdoor Kitchen', area: 80, materialType: 'Cultured Stone Veneer', quantity: 80, unit: 'sq ft', unitPrice: 22, totalCost: 1760, supplier: 'Stone World Supply', status: 'estimated' }
    ]);
    console.log('Material estimates seeded');

    // Seed Client Proposals (15 items)
    await ClientProposal.bulkCreate([
      { title: 'Complete Backyard Renovation', clientName: 'Robert & Sarah Johnson', clientEmail: 'johnson@email.com', projectScope: 'Full backyard redesign including patio, garden beds, water feature, and lighting', estimatedBudget: 45000, timeline: '6-8 weeks', status: 'draft' },
      { title: 'Front Yard Curb Appeal Upgrade', clientName: 'Maria Garcia', clientEmail: 'garcia@email.com', projectScope: 'New walkway, foundation plantings, lawn renovation, and landscape lighting', estimatedBudget: 18000, timeline: '3-4 weeks', status: 'draft' },
      { title: 'Commercial Property Maintenance', clientName: 'Apex Business Group', clientEmail: 'facilities@apex.com', projectScope: 'Annual maintenance contract for 5-acre office campus', estimatedBudget: 36000, timeline: '12 months', status: 'draft' },
      { title: 'Pool Landscape Installation', clientName: 'David Thompson', clientEmail: 'dthompson@email.com', projectScope: 'Tropical landscaping around new pool, including privacy screening and deck plantings', estimatedBudget: 22000, timeline: '4-5 weeks', status: 'draft' },
      { title: 'HOA Common Area Redesign', clientName: 'Sunset Ridge HOA Board', clientEmail: 'board@sunsetridge.org', projectScope: 'Redesign entry monuments, common areas, and walking trails', estimatedBudget: 85000, timeline: '10-12 weeks', status: 'draft' },
      { title: 'Restaurant Patio Garden', clientName: 'Bella Vista Restaurant', clientEmail: 'owner@bellavista.com', projectScope: 'Create intimate outdoor dining garden with seasonal plantings', estimatedBudget: 28000, timeline: '3-4 weeks', status: 'draft' },
      { title: 'Erosion Control Project', clientName: 'Lake View Estates', clientEmail: 'mgmt@lakeview.com', projectScope: 'Slope stabilization, retaining walls, and drainage improvements', estimatedBudget: 55000, timeline: '6-8 weeks', status: 'draft' },
      { title: 'Xeriscaping Conversion', clientName: 'Patricia Williams', clientEmail: 'pwilliams@email.com', projectScope: 'Convert water-intensive lawn to drought-tolerant landscape', estimatedBudget: 15000, timeline: '3-4 weeks', status: 'draft' },
      { title: 'Estate Garden Design', clientName: 'Harrison Family Trust', clientEmail: 'estate@harrison.com', projectScope: 'Formal gardens, orchard, cutting garden, and garden rooms on 2-acre estate', estimatedBudget: 120000, timeline: '4-6 months', status: 'draft' },
      { title: 'School Campus Greening', clientName: 'Lincoln Elementary School', clientEmail: 'principal@lincoln.edu', projectScope: 'Outdoor classroom, nature trail, pollinator garden, and shade trees', estimatedBudget: 35000, timeline: '6-8 weeks', status: 'draft' },
      { title: 'Medical Office Landscape', clientName: 'Healing Arts Medical Group', clientEmail: 'admin@healingarts.com', projectScope: 'Healing garden, ADA pathways, seasonal color, and water feature', estimatedBudget: 42000, timeline: '5-6 weeks', status: 'draft' },
      { title: 'Townhouse Complex Grounds', clientName: 'Urban Living Properties', clientEmail: 'property@urbanliving.com', projectScope: 'Landscape 24-unit townhouse complex with community garden', estimatedBudget: 95000, timeline: '8-10 weeks', status: 'draft' },
      { title: 'Fire-Resistant Landscaping', clientName: 'Mountain View Estates', clientEmail: 'hoa@mountainview.com', projectScope: 'Create defensible space with fire-resistant plantings and hardscaping', estimatedBudget: 32000, timeline: '4-5 weeks', status: 'draft' },
      { title: 'Outdoor Wedding Venue', clientName: 'Rosewood Events', clientEmail: 'events@rosewood.com', projectScope: 'Design ceremony area, reception garden, and photo backdrop areas', estimatedBudget: 65000, timeline: '8-10 weeks', status: 'draft' },
      { title: 'Sustainable Rain Garden', clientName: 'Green Living Association', clientEmail: 'info@greenliving.org', projectScope: 'Bio-retention rain garden with native plants and educational signage', estimatedBudget: 18000, timeline: '3-4 weeks', status: 'draft' }
    ]);
    console.log('Client proposals seeded');

    // Seed Plants (15 items)
    await Plant.bulkCreate([
      { name: 'Japanese Maple', scientificName: 'Acer palmatum', category: 'Tree', sunRequirement: 'Partial Shade', waterNeeds: 'Medium', hardinessZone: '5-9', matureHeight: '15-25 ft', bloomSeason: 'Spring', price: 85.00, status: 'active' },
      { name: 'Knockout Rose', scientificName: 'Rosa x Knockout', category: 'Shrub', sunRequirement: 'Full Sun', waterNeeds: 'Medium', hardinessZone: '5-10', matureHeight: '3-4 ft', bloomSeason: 'Spring-Fall', price: 24.99, status: 'active' },
      { name: 'Blue Fescue', scientificName: 'Festuca glauca', category: 'Ornamental Grass', sunRequirement: 'Full Sun', waterNeeds: 'Low', hardinessZone: '4-8', matureHeight: '8-12 in', bloomSeason: 'Summer', price: 12.99, status: 'active' },
      { name: 'Hydrangea Endless Summer', scientificName: 'Hydrangea macrophylla', category: 'Shrub', sunRequirement: 'Partial Shade', waterNeeds: 'High', hardinessZone: '4-9', matureHeight: '3-5 ft', bloomSeason: 'Summer-Fall', price: 34.99, status: 'active' },
      { name: 'Lavender Phenomenal', scientificName: 'Lavandula x intermedia', category: 'Perennial', sunRequirement: 'Full Sun', waterNeeds: 'Low', hardinessZone: '5-9', matureHeight: '24-30 in', bloomSeason: 'Summer', price: 18.99, status: 'active' },
      { name: 'Emerald Green Arborvitae', scientificName: 'Thuja occidentalis', category: 'Evergreen', sunRequirement: 'Full Sun', waterNeeds: 'Medium', hardinessZone: '3-8', matureHeight: '12-15 ft', bloomSeason: 'N/A', price: 45.00, status: 'active' },
      { name: 'Black-Eyed Susan', scientificName: 'Rudbeckia hirta', category: 'Perennial', sunRequirement: 'Full Sun', waterNeeds: 'Low', hardinessZone: '3-9', matureHeight: '24-36 in', bloomSeason: 'Summer-Fall', price: 8.99, status: 'active' },
      { name: 'Crepe Myrtle Natchez', scientificName: 'Lagerstroemia indica', category: 'Tree', sunRequirement: 'Full Sun', waterNeeds: 'Medium', hardinessZone: '7-10', matureHeight: '20-30 ft', bloomSeason: 'Summer', price: 65.00, status: 'active' },
      { name: 'Hostas Blue Angel', scientificName: 'Hosta sieboldiana', category: 'Perennial', sunRequirement: 'Full Shade', waterNeeds: 'Medium', hardinessZone: '3-8', matureHeight: '24-36 in', bloomSeason: 'Summer', price: 15.99, status: 'active' },
      { name: 'Dwarf Boxwood', scientificName: 'Buxus sempervirens', category: 'Shrub', sunRequirement: 'Partial Shade', waterNeeds: 'Medium', hardinessZone: '5-8', matureHeight: '2-3 ft', bloomSeason: 'N/A', price: 22.99, status: 'active' },
      { name: 'Purple Coneflower', scientificName: 'Echinacea purpurea', category: 'Perennial', sunRequirement: 'Full Sun', waterNeeds: 'Low', hardinessZone: '3-8', matureHeight: '24-48 in', bloomSeason: 'Summer', price: 9.99, status: 'active' },
      { name: 'Agave Blue Glow', scientificName: 'Agave attenuata x ocahui', category: 'Succulent', sunRequirement: 'Full Sun', waterNeeds: 'Very Low', hardinessZone: '9-11', matureHeight: '18-24 in', bloomSeason: 'Rare', price: 35.00, status: 'active' },
      { name: 'River Birch', scientificName: 'Betula nigra', category: 'Tree', sunRequirement: 'Full Sun', waterNeeds: 'High', hardinessZone: '4-9', matureHeight: '40-70 ft', bloomSeason: 'Spring', price: 95.00, status: 'active' },
      { name: 'Daylily Stella de Oro', scientificName: 'Hemerocallis Stella de Oro', category: 'Perennial', sunRequirement: 'Full Sun', waterNeeds: 'Low', hardinessZone: '3-10', matureHeight: '12-18 in', bloomSeason: 'Spring-Fall', price: 10.99, status: 'active' },
      { name: 'Butterfly Bush', scientificName: 'Buddleja davidii', category: 'Shrub', sunRequirement: 'Full Sun', waterNeeds: 'Low', hardinessZone: '5-9', matureHeight: '6-10 ft', bloomSeason: 'Summer-Fall', price: 19.99, status: 'active' }
    ]);
    console.log('Plants seeded');

    // Seed Cost Estimates (15 items)
    await CostEstimate.bulkCreate([
      { title: 'Patio Installation Project', projectType: 'Hardscaping', laborCost: 4500, materialCost: 5625, equipmentCost: 800, overheadPercent: 15, profitMarginPercent: 20, totalEstimate: 15400, clientName: 'Johnson Family', status: 'draft' },
      { title: 'Complete Lawn Renovation', projectType: 'Lawn Care', laborCost: 2200, materialCost: 4250, equipmentCost: 600, overheadPercent: 12, profitMarginPercent: 25, totalEstimate: 9800, clientName: 'Garcia Residence', status: 'draft' },
      { title: 'Retaining Wall Construction', projectType: 'Structural', laborCost: 6000, materialCost: 2700, equipmentCost: 1500, overheadPercent: 15, profitMarginPercent: 22, totalEstimate: 14000, clientName: 'Lake View Estates', status: 'draft' },
      { title: 'Landscape Lighting Package', projectType: 'Electrical', laborCost: 1800, materialCost: 2040, equipmentCost: 300, overheadPercent: 10, profitMarginPercent: 30, totalEstimate: 5800, clientName: 'Thompson Home', status: 'draft' },
      { title: 'Irrigation System Install', projectType: 'Irrigation', laborCost: 3500, materialCost: 2800, equipmentCost: 500, overheadPercent: 12, profitMarginPercent: 25, totalEstimate: 9500, clientName: 'Smith Estate', status: 'draft' },
      { title: 'Tree Planting Service', projectType: 'Planting', laborCost: 1500, materialCost: 3200, equipmentCost: 400, overheadPercent: 10, profitMarginPercent: 28, totalEstimate: 7100, clientName: 'City Parks Dept', status: 'draft' },
      { title: 'Outdoor Kitchen Build', projectType: 'Construction', laborCost: 8000, materialCost: 12000, equipmentCost: 2000, overheadPercent: 15, profitMarginPercent: 20, totalEstimate: 30800, clientName: 'Williams Family', status: 'draft' },
      { title: 'French Drain Installation', projectType: 'Drainage', laborCost: 2800, materialCost: 1200, equipmentCost: 800, overheadPercent: 12, profitMarginPercent: 25, totalEstimate: 6700, clientName: 'Riverside Property', status: 'draft' },
      { title: 'Pergola Construction', projectType: 'Structure', laborCost: 3000, materialCost: 2500, equipmentCost: 400, overheadPercent: 12, profitMarginPercent: 25, totalEstimate: 8200, clientName: 'Anderson Residence', status: 'draft' },
      { title: 'Annual Maintenance Contract', projectType: 'Maintenance', laborCost: 18000, materialCost: 4000, equipmentCost: 2000, overheadPercent: 10, profitMarginPercent: 30, totalEstimate: 33600, clientName: 'Apex Business Group', status: 'draft' },
      { title: 'Fence Installation', projectType: 'Fencing', laborCost: 2500, materialCost: 2100, equipmentCost: 300, overheadPercent: 12, profitMarginPercent: 25, totalEstimate: 6800, clientName: 'Davis Property', status: 'draft' },
      { title: 'Water Feature Construction', projectType: 'Water Feature', laborCost: 3500, materialCost: 2850, equipmentCost: 600, overheadPercent: 15, profitMarginPercent: 22, totalEstimate: 9500, clientName: 'Botanical Center', status: 'draft' },
      { title: 'Mulch & Bed Renovation', projectType: 'Bed Work', laborCost: 1200, materialCost: 1280, equipmentCost: 200, overheadPercent: 10, profitMarginPercent: 30, totalEstimate: 3700, clientName: 'Green Valley HOA', status: 'draft' },
      { title: 'Sod & Grading Project', projectType: 'Lawn', laborCost: 3000, materialCost: 4250, equipmentCost: 1200, overheadPercent: 12, profitMarginPercent: 22, totalEstimate: 11700, clientName: 'New Home Builder', status: 'draft' },
      { title: 'Commercial Planting Design', projectType: 'Design & Install', laborCost: 5000, materialCost: 8000, equipmentCost: 1000, overheadPercent: 15, profitMarginPercent: 20, totalEstimate: 19600, clientName: 'Metro Development', status: 'draft' }
    ]);
    console.log('Cost estimates seeded');

    // Seed Projects (15 items)
    await Project.bulkCreate([
      { title: 'Johnson Backyard Makeover', clientName: 'Robert Johnson', address: '123 Oak Lane, Springfield', projectType: 'Full Renovation', startDate: '2026-04-01', endDate: '2026-05-15', budget: 45000, progress: 0, notes: 'Client wants modern design with pool integration', status: 'planning' },
      { title: 'Garcia Front Yard Upgrade', clientName: 'Maria Garcia', address: '456 Elm Street, Riverside', projectType: 'Curb Appeal', startDate: '2026-04-15', endDate: '2026-05-10', budget: 18000, progress: 15, notes: 'Focus on low-maintenance plantings', status: 'in-progress' },
      { title: 'Apex Campus Maintenance', clientName: 'Apex Business Group', address: '789 Corporate Blvd', projectType: 'Annual Maintenance', startDate: '2026-01-01', endDate: '2026-12-31', budget: 36000, progress: 25, notes: 'Monthly maintenance with quarterly enhancements', status: 'in-progress' },
      { title: 'Sunset Ridge Entry Redesign', clientName: 'Sunset Ridge HOA', address: 'Sunset Ridge Blvd Entry', projectType: 'HOA Common Area', startDate: '2026-05-01', endDate: '2026-07-15', budget: 85000, progress: 0, notes: 'New monument signs and entry plantings', status: 'planning' },
      { title: 'Thompson Pool Landscape', clientName: 'David Thompson', address: '321 Palm Drive', projectType: 'Pool Landscaping', startDate: '2026-03-15', endDate: '2026-04-20', budget: 22000, progress: 60, notes: 'Tropical theme with privacy screening', status: 'in-progress' },
      { title: 'Bella Vista Patio Garden', clientName: 'Bella Vista Restaurant', address: '555 Main Street', projectType: 'Commercial Garden', startDate: '2026-04-10', endDate: '2026-05-05', budget: 28000, progress: 0, notes: 'Needs to be completed before summer season', status: 'planning' },
      { title: 'Lake View Erosion Control', clientName: 'Lake View Estates', address: '100 Lakeshore Drive', projectType: 'Erosion Control', startDate: '2026-03-01', endDate: '2026-04-30', budget: 55000, progress: 40, notes: 'Critical slope stabilization needed', status: 'in-progress' },
      { title: 'Williams Xeriscape Project', clientName: 'Patricia Williams', address: '890 Desert View Road', projectType: 'Xeriscape Conversion', startDate: '2026-04-20', endDate: '2026-05-15', budget: 15000, progress: 0, notes: 'Remove existing lawn, install drought-tolerant plants', status: 'planning' },
      { title: 'Harrison Estate Gardens', clientName: 'Harrison Family Trust', address: '1 Estate Drive', projectType: 'Estate Design', startDate: '2026-05-01', endDate: '2026-10-30', budget: 120000, progress: 5, notes: 'Multi-phase formal garden installation', status: 'in-progress' },
      { title: 'Lincoln School Green Space', clientName: 'Lincoln Elementary', address: '200 School Lane', projectType: 'Educational', startDate: '2026-06-15', endDate: '2026-08-01', budget: 35000, progress: 0, notes: 'Must complete during summer break', status: 'planning' },
      { title: 'Healing Arts Garden', clientName: 'Healing Arts Medical', address: '400 Wellness Way', projectType: 'Healing Garden', startDate: '2026-04-01', endDate: '2026-05-30', budget: 42000, progress: 10, notes: 'ADA compliant with sensory elements', status: 'in-progress' },
      { title: 'Urban Living Complex', clientName: 'Urban Living Properties', address: '600 Metro Ave', projectType: 'Multi-Unit Residential', startDate: '2026-05-15', endDate: '2026-07-30', budget: 95000, progress: 0, notes: '24 townhouse units with shared garden', status: 'planning' },
      { title: 'Mountain View Fire Safety', clientName: 'Mountain View HOA', address: 'Mountain View Estates', projectType: 'Fire Mitigation', startDate: '2026-04-01', endDate: '2026-05-15', budget: 32000, progress: 20, notes: 'Defensible space creation required by insurance', status: 'in-progress' },
      { title: 'Rosewood Wedding Venue', clientName: 'Rosewood Events', address: '800 Garden Lane', projectType: 'Event Venue', startDate: '2026-03-01', endDate: '2026-05-30', budget: 65000, progress: 35, notes: 'First wedding booked for June 15', status: 'in-progress' },
      { title: 'Green Living Rain Garden', clientName: 'Green Living Association', address: '150 Eco Boulevard', projectType: 'Stormwater Management', startDate: '2026-04-15', endDate: '2026-05-30', budget: 18000, progress: 0, notes: 'Educational demonstration project', status: 'planning' }
    ]);
    console.log('Projects seeded');

    // Seed Soil Analyses (15 items)
    await SoilAnalysis.bulkCreate([
      { title: 'Johnson Front Yard Analysis', location: '123 Oak Lane - Front', soilType: 'Clay Loam', phLevel: 6.8, nitrogenLevel: 'Medium', phosphorusLevel: 'Low', potassiumLevel: 'Medium', organicMatter: '3.2%', drainageRating: 'Moderate', status: 'pending' },
      { title: 'Smith Estate Garden Beds', location: '456 Maple Ave - Garden', soilType: 'Sandy Loam', phLevel: 7.2, nitrogenLevel: 'High', phosphorusLevel: 'Medium', potassiumLevel: 'High', organicMatter: '5.1%', drainageRating: 'Good', status: 'pending' },
      { title: 'Corporate Campus Lawn', location: '789 Corporate Blvd', soilType: 'Silt Loam', phLevel: 6.5, nitrogenLevel: 'Low', phosphorusLevel: 'Medium', potassiumLevel: 'Low', organicMatter: '2.8%', drainageRating: 'Moderate', status: 'pending' },
      { title: 'Desert View Property', location: '890 Desert View Road', soilType: 'Sandy', phLevel: 8.1, nitrogenLevel: 'Very Low', phosphorusLevel: 'Low', potassiumLevel: 'Medium', organicMatter: '0.8%', drainageRating: 'Excellent', status: 'pending' },
      { title: 'Hillside Slope Assessment', location: 'Hillside Retreat - North Slope', soilType: 'Rocky Clay', phLevel: 5.9, nitrogenLevel: 'Low', phosphorusLevel: 'Low', potassiumLevel: 'Low', organicMatter: '1.5%', drainageRating: 'Poor', status: 'pending' },
      { title: 'Community Garden Plot', location: 'Eco Living Community Garden', soilType: 'Rich Loam', phLevel: 6.6, nitrogenLevel: 'High', phosphorusLevel: 'High', potassiumLevel: 'High', organicMatter: '6.2%', drainageRating: 'Good', status: 'pending' },
      { title: 'School Playground Area', location: 'Lincoln Elementary - East Field', soilType: 'Compacted Clay', phLevel: 7.0, nitrogenLevel: 'Very Low', phosphorusLevel: 'Low', potassiumLevel: 'Low', organicMatter: '1.2%', drainageRating: 'Very Poor', status: 'pending' },
      { title: 'Lakeshore Property', location: '100 Lakeshore Drive', soilType: 'Silty Clay', phLevel: 6.3, nitrogenLevel: 'Medium', phosphorusLevel: 'High', potassiumLevel: 'Medium', organicMatter: '4.5%', drainageRating: 'Poor', status: 'pending' },
      { title: 'Rooftop Container Mix', location: 'Metro Tower Roof', soilType: 'Container Mix', phLevel: 6.0, nitrogenLevel: 'Medium', phosphorusLevel: 'Medium', potassiumLevel: 'Medium', organicMatter: '8.0%', drainageRating: 'Excellent', status: 'pending' },
      { title: 'Vineyard Expansion Area', location: 'Harrison Estate - South Field', soilType: 'Gravelly Loam', phLevel: 7.4, nitrogenLevel: 'Low', phosphorusLevel: 'Medium', potassiumLevel: 'High', organicMatter: '2.3%', drainageRating: 'Good', status: 'pending' },
      { title: 'Rain Garden Site', location: '150 Eco Blvd - Retention Area', soilType: 'Sandy Clay Loam', phLevel: 6.7, nitrogenLevel: 'Medium', phosphorusLevel: 'Low', potassiumLevel: 'Medium', organicMatter: '3.8%', drainageRating: 'Moderate', status: 'pending' },
      { title: 'Athletic Field Turf', location: 'Lincoln High - Main Field', soilType: 'Loam', phLevel: 6.9, nitrogenLevel: 'Medium', phosphorusLevel: 'Medium', potassiumLevel: 'Medium', organicMatter: '3.5%', drainageRating: 'Good', status: 'pending' },
      { title: 'Coastal Property Sand Test', location: '200 Beachfront Road', soilType: 'Sandy', phLevel: 8.3, nitrogenLevel: 'Very Low', phosphorusLevel: 'Very Low', potassiumLevel: 'Low', organicMatter: '0.5%', drainageRating: 'Excellent', status: 'pending' },
      { title: 'Medicinal Garden Bed', location: 'Healing Arts - Courtyard', soilType: 'Amended Loam', phLevel: 6.4, nitrogenLevel: 'High', phosphorusLevel: 'High', potassiumLevel: 'High', organicMatter: '7.0%', drainageRating: 'Good', status: 'pending' },
      { title: 'Wetland Buffer Zone', location: 'Riverside Restoration Area', soilType: 'Muck', phLevel: 5.5, nitrogenLevel: 'High', phosphorusLevel: 'High', potassiumLevel: 'Medium', organicMatter: '12.0%', drainageRating: 'Very Poor', status: 'pending' }
    ]);
    console.log('Soil analyses seeded');

    // Seed Weather Plans (15 items)
    await WeatherPlan.bulkCreate([
      { title: 'Spring Frost Protection Plan', region: 'Northeast US', season: 'Spring', avgTemperature: 55, avgRainfall: 4.2, frostRisk: 'High', windExposure: 'Moderate', recommendations: 'Cover tender plantings, delay tropical installations', status: 'active' },
      { title: 'Summer Heat Management', region: 'Southeast US', season: 'Summer', avgTemperature: 92, avgRainfall: 5.8, frostRisk: 'None', windExposure: 'Low', recommendations: 'Increase irrigation, apply mulch, provide shade', status: 'active' },
      { title: 'Fall Storm Preparation', region: 'Gulf Coast', season: 'Fall', avgTemperature: 72, avgRainfall: 6.5, frostRisk: 'Low', windExposure: 'Very High', recommendations: 'Secure loose items, prune dead branches, check drainage', status: 'active' },
      { title: 'Winter Freeze Protocol', region: 'Midwest US', season: 'Winter', avgTemperature: 28, avgRainfall: 2.1, frostRisk: 'Severe', windExposure: 'High', recommendations: 'Wrap evergreens, mulch perennials heavily, drain irrigation', status: 'active' },
      { title: 'Desert Summer Survival', region: 'Southwest US', season: 'Summer', avgTemperature: 105, avgRainfall: 0.5, frostRisk: 'None', windExposure: 'Moderate', recommendations: 'Deep watering schedule, shade cloth for new plantings', status: 'active' },
      { title: 'Pacific NW Rain Season', region: 'Pacific Northwest', season: 'Winter', avgTemperature: 42, avgRainfall: 8.5, frostRisk: 'Moderate', windExposure: 'High', recommendations: 'Improve drainage, check for root rot, prune for airflow', status: 'active' },
      { title: 'Mountain Spring Thaw Plan', region: 'Rocky Mountain', season: 'Spring', avgTemperature: 48, avgRainfall: 3.2, frostRisk: 'High', windExposure: 'Very High', recommendations: 'Gradual hardening off, windbreak installation', status: 'active' },
      { title: 'Coastal Wind Protection', region: 'Atlantic Coast', season: 'Spring', avgTemperature: 62, avgRainfall: 3.8, frostRisk: 'Moderate', windExposure: 'Very High', recommendations: 'Salt-tolerant species, windbreak hedges, staking new trees', status: 'active' },
      { title: 'Southern Humidity Plan', region: 'Deep South', season: 'Summer', avgTemperature: 88, avgRainfall: 5.5, frostRisk: 'None', windExposure: 'Low', recommendations: 'Fungicide schedule, airflow pruning, disease-resistant varieties', status: 'active' },
      { title: 'High Plains Drought Plan', region: 'Great Plains', season: 'Summer', avgTemperature: 85, avgRainfall: 1.8, frostRisk: 'None', windExposure: 'High', recommendations: 'Xeriscaping, native grasses, deep root watering', status: 'active' },
      { title: 'Lake Effect Snow Plan', region: 'Great Lakes', season: 'Winter', avgTemperature: 25, avgRainfall: 3.5, frostRisk: 'Severe', windExposure: 'High', recommendations: 'Snow load management, salt damage prevention, burlap wrapping', status: 'active' },
      { title: 'California Fire Season', region: 'California', season: 'Fall', avgTemperature: 78, avgRainfall: 0.3, frostRisk: 'None', windExposure: 'Very High', recommendations: 'Defensible space maintenance, fire-resistant plants, irrigation zones', status: 'active' },
      { title: 'Tropical Storm Recovery', region: 'Florida', season: 'Fall', avgTemperature: 80, avgRainfall: 7.2, frostRisk: 'None', windExposure: 'Extreme', recommendations: 'Emergency cleanup plan, tree bracing, flood drainage', status: 'active' },
      { title: 'Northern Spring Prep', region: 'Upper Midwest', season: 'Spring', avgTemperature: 45, avgRainfall: 3.0, frostRisk: 'High', windExposure: 'Moderate', recommendations: 'Soil testing after thaw, delayed planting schedule, cold crop starts', status: 'active' },
      { title: 'Monsoon Season Adaptation', region: 'Arizona', season: 'Summer', avgTemperature: 100, avgRainfall: 2.5, frostRisk: 'None', windExposure: 'Moderate', recommendations: 'Flash flood protection, wash-tolerant plants, temporary berms', status: 'active' }
    ]);
    console.log('Weather plans seeded');

    // Seed Equipment (15 items)
    await Equipment.bulkCreate([
      { name: 'John Deere Z930M Zero-Turn Mower', type: 'Mower', serialNumber: 'JD-ZT-2024-0891', purchaseDate: '2024-03-15', purchasePrice: 12500, condition: 'Excellent', lastMaintenanceDate: '2026-02-10', notes: 'Commercial grade, 60-inch deck' },
      { name: 'Stihl FS 131 String Trimmer', type: 'Trimmer', serialNumber: 'ST-FS-2025-1442', purchaseDate: '2025-04-20', purchasePrice: 450, condition: 'Good', lastMaintenanceDate: '2026-01-25', notes: 'Professional bike handle trimmer' },
      { name: 'Ford F-350 Super Duty Truck', type: 'Truck', serialNumber: 'FD-F350-2023-7723', purchaseDate: '2023-06-01', purchasePrice: 58000, condition: 'Good', lastMaintenanceDate: '2026-03-01', notes: 'Crew cab, diesel, towing package' },
      { name: '16ft Tandem Axle Landscape Trailer', type: 'Trailer', serialNumber: 'TR-LA-2024-3310', purchaseDate: '2024-01-10', purchasePrice: 4200, condition: 'Good', lastMaintenanceDate: '2026-02-20', notes: 'Open trailer with mesh sides and ramp gate' },
      { name: 'Stihl MS 261 C-M Chainsaw', type: 'Chainsaw', serialNumber: 'ST-CS-2025-0556', purchaseDate: '2025-02-14', purchasePrice: 620, condition: 'Excellent', lastMaintenanceDate: '2026-03-05', notes: '20-inch bar, low emissions engine' },
      { name: 'Stihl BR 800 X Backpack Blower', type: 'Blower', serialNumber: 'ST-BL-2024-2287', purchaseDate: '2024-09-01', purchasePrice: 700, condition: 'Good', lastMaintenanceDate: '2026-01-15', notes: 'Most powerful backpack blower, magnum class' },
      { name: 'Ryan Lawnaire 28 Aerator', type: 'Aerator', serialNumber: 'RY-AE-2023-1105', purchaseDate: '2023-08-20', purchasePrice: 3800, condition: 'Fair', lastMaintenanceDate: '2026-02-28', notes: '28-inch walk-behind core aerator' },
      { name: 'Toro Dingo TX 1000 Compact Loader', type: 'Compact Loader', serialNumber: 'TO-DG-2024-4490', purchaseDate: '2024-05-10', purchasePrice: 22000, condition: 'Excellent', lastMaintenanceDate: '2026-03-10', notes: 'Narrow track, multiple attachment options' },
      { name: 'Honda EU7000iS Generator', type: 'Generator', serialNumber: 'HN-GN-2025-0088', purchaseDate: '2025-01-05', purchasePrice: 4800, condition: 'Excellent', lastMaintenanceDate: '2026-02-15', notes: 'Inverter generator, fuel injected, electric start' },
      { name: 'Vermeer BC700XL Brush Chipper', type: 'Chipper', serialNumber: 'VM-BC-2023-6612', purchaseDate: '2023-04-22', purchasePrice: 18500, condition: 'Good', lastMaintenanceDate: '2026-01-30', notes: '7-inch capacity, towable' },
      { name: 'Husqvarna PG 530 Plate Compactor', type: 'Compactor', serialNumber: 'HQ-PC-2024-7780', purchaseDate: '2024-07-15', purchasePrice: 1100, condition: 'Good', lastMaintenanceDate: '2026-02-05', notes: 'Forward plate compactor for paver base' },
      { name: 'Exmark Lazer Z S-Series 52" Mower', type: 'Mower', serialNumber: 'EX-LZ-2025-3321', purchaseDate: '2025-03-01', purchasePrice: 14200, condition: 'Excellent', lastMaintenanceDate: '2026-03-12', notes: 'Suspension platform, RED technology' },
      { name: 'Stihl HS 87 R Hedge Trimmer', type: 'Hedge Trimmer', serialNumber: 'ST-HT-2024-9915', purchaseDate: '2024-06-18', purchasePrice: 550, condition: 'Good', lastMaintenanceDate: '2026-02-22', notes: '30-inch double-sided blade, low vibration' },
      { name: 'Ram 2500 Tradesman Truck', type: 'Truck', serialNumber: 'RM-2500-2024-5501', purchaseDate: '2024-02-28', purchasePrice: 48000, condition: 'Good', lastMaintenanceDate: '2026-03-08', notes: 'Regular cab, 8-foot bed, Cummins diesel' },
      { name: 'Harley Power Box Rake T6', type: 'Landscape Rake', serialNumber: 'HR-PB-2023-2244', purchaseDate: '2023-10-05', purchasePrice: 6500, condition: 'Fair', lastMaintenanceDate: '2026-01-20', notes: '6-foot power rake, Bobcat attachment' }
    ]);
    console.log('Equipment seeded');

    // Seed Crew Schedules (15 items)
    await CrewSchedule.bulkCreate([
      { title: 'Backyard Demo & Grading', crewLeader: 'Carlos Martinez', crewSize: 5, projectName: 'Johnson Backyard Makeover', assignedDate: '2026-04-01', startTime: '07:00', endTime: '16:00', taskDescription: 'Demolition of existing patio and grading for new layout', skillsRequired: 'Hardscaping, Equipment Operation, Grading', status: 'scheduled' },
      { title: 'Front Yard Bed Prep', crewLeader: 'Mike Sullivan', crewSize: 3, projectName: 'Garcia Front Yard Upgrade', assignedDate: '2026-04-15', startTime: '07:30', endTime: '15:30', taskDescription: 'Remove old shrubs and prepare beds for new plantings', skillsRequired: 'Planting, Pruning, Bed Preparation', status: 'scheduled' },
      { title: 'Monument Sign Installation', crewLeader: 'James Wilson', crewSize: 8, projectName: 'Sunset Ridge Entry Redesign', assignedDate: '2026-05-01', startTime: '06:30', endTime: '17:00', taskDescription: 'Install new monument sign base and surrounding stonework', skillsRequired: 'Masonry, Hardscaping, Heavy Equipment', status: 'scheduled' },
      { title: 'Tropical Planting Day', crewLeader: 'Carlos Martinez', crewSize: 4, projectName: 'Thompson Pool Landscape', assignedDate: '2026-03-20', startTime: '07:00', endTime: '15:00', taskDescription: 'Plant palm trees and install tropical shrub borders', skillsRequired: 'Planting, Irrigation, Tropical Plants', status: 'in-progress' },
      { title: 'Retaining Wall Footings', crewLeader: 'David Chen', crewSize: 6, projectName: 'Lake View Erosion Control', assignedDate: '2026-03-18', startTime: '06:30', endTime: '16:30', taskDescription: 'Build retaining wall footings and set first course of blocks', skillsRequired: 'Retaining Walls, Grading, Drainage', status: 'completed' },
      { title: 'Spring Lawn Treatment', crewLeader: 'Mike Sullivan', crewSize: 2, projectName: 'Apex Campus Maintenance', assignedDate: '2026-04-05', startTime: '06:00', endTime: '14:00', taskDescription: 'Spring lawn treatment and pre-emergent application', skillsRequired: 'Lawn Care, Chemical Application, Fertilization', status: 'scheduled' },
      { title: 'Patio & Planter Install', crewLeader: 'Tony Rossi', crewSize: 4, projectName: 'Bella Vista Patio Garden', assignedDate: '2026-04-10', startTime: '07:00', endTime: '16:00', taskDescription: 'Install raised planters and lay flagstone patio surface', skillsRequired: 'Hardscaping, Planting, Masonry', status: 'scheduled' },
      { title: 'Parterre Garden Layout', crewLeader: 'James Wilson', crewSize: 5, projectName: 'Harrison Estate Gardens', assignedDate: '2026-05-05', startTime: '07:00', endTime: '17:00', taskDescription: 'Lay out formal parterre garden and install boxwood hedges', skillsRequired: 'Formal Gardens, Precision Planting, Design Layout', status: 'scheduled' },
      { title: 'ADA Pathway & Water Feature', crewLeader: 'David Chen', crewSize: 3, projectName: 'Healing Arts Garden', assignedDate: '2026-04-02', startTime: '07:30', endTime: '15:30', taskDescription: 'Construct ADA-compliant pathway and install water feature', skillsRequired: 'ADA Compliance, Hardscaping, Water Features', status: 'scheduled' },
      { title: 'Ceremony Area Grading', crewLeader: 'Carlos Martinez', crewSize: 6, projectName: 'Rosewood Wedding Venue', assignedDate: '2026-03-25', startTime: '06:30', endTime: '16:30', taskDescription: 'Grade ceremony area and install stone aisle base', skillsRequired: 'Grading, Stonework, Landscape Design', status: 'scheduled' },
      { title: 'Sod Removal & Granite Base', crewLeader: 'Tony Rossi', crewSize: 3, projectName: 'Williams Xeriscape Project', assignedDate: '2026-04-20', startTime: '07:00', endTime: '15:00', taskDescription: 'Remove existing sod and install decomposed granite base', skillsRequired: 'Xeriscape, Grading, Material Installation', status: 'scheduled' },
      { title: 'Irrigation Mainline Install', crewLeader: 'Mike Sullivan', crewSize: 7, projectName: 'Urban Living Complex', assignedDate: '2026-05-18', startTime: '06:00', endTime: '17:00', taskDescription: 'Install irrigation mainline and zone valves for all 24 units', skillsRequired: 'Irrigation, Plumbing, Trenching', status: 'scheduled' },
      { title: 'Defensible Space Clearing', crewLeader: 'David Chen', crewSize: 4, projectName: 'Mountain View Fire Safety', assignedDate: '2026-04-03', startTime: '07:00', endTime: '16:00', taskDescription: 'Clear brush in defensible space zone and chip debris', skillsRequired: 'Fire Mitigation, Brush Clearing, Chipping', status: 'in-progress' },
      { title: 'Outdoor Classroom Setup', crewLeader: 'James Wilson', crewSize: 5, projectName: 'Lincoln School Green Space', assignedDate: '2026-06-16', startTime: '06:30', endTime: '16:30', taskDescription: 'Install outdoor classroom seating and shade tree plantings', skillsRequired: 'Planting, Construction, Hardscaping', status: 'scheduled' },
      { title: 'Rain Garden Excavation', crewLeader: 'Tony Rossi', crewSize: 2, projectName: 'Green Living Rain Garden', assignedDate: '2026-04-15', startTime: '07:30', endTime: '14:30', taskDescription: 'Excavate bio-retention basin and install underdrain system', skillsRequired: 'Drainage, Excavation, Stormwater Systems', status: 'scheduled' }
    ]);
    console.log('Crew schedules seeded');

    // Seed Photo Gallery (15 items)
    await PhotoGallery.bulkCreate([
      { title: 'Modern Patio Before', category: 'Before/After', projectName: 'Johnson Backyard Makeover', location: '123 Oak Lane, Springfield', dateTaken: '2026-03-15', beforeAfter: 'before', tags: 'patio, hardscape, backyard, before', description: 'Existing cracked concrete patio before renovation' },
      { title: 'Modern Patio After', category: 'Before/After', projectName: 'Johnson Backyard Makeover', location: '123 Oak Lane, Springfield', dateTaken: '2026-05-15', beforeAfter: 'after', tags: 'patio, hardscape, backyard, bluestone, after', description: 'Completed bluestone patio with fire pit and seating wall' },
      { title: 'Tropical Pool Landscape Design Render', category: 'Design', projectName: 'Thompson Pool Landscape', location: '321 Palm Drive', dateTaken: '2026-02-20', beforeAfter: 'before', tags: 'pool, tropical, design, render, 3D', description: '3D rendering of proposed tropical pool landscape' },
      { title: 'Retaining Wall Progress Shot', category: 'Progress', projectName: 'Lake View Erosion Control', location: '100 Lakeshore Drive', dateTaken: '2026-03-20', beforeAfter: 'during', tags: 'retaining wall, construction, erosion, progress', description: 'Second tier of retaining wall blocks installed' },
      { title: 'Formal Garden Boxwood Layout', category: 'Progress', projectName: 'Harrison Estate Gardens', location: '1 Estate Drive', dateTaken: '2026-05-10', beforeAfter: 'during', tags: 'formal garden, boxwood, parterre, layout', description: 'Boxwood hedges being placed in parterre pattern' },
      { title: 'Xeriscaping Completed Front Yard', category: 'Completed', projectName: 'Williams Xeriscape Project', location: '890 Desert View Road', dateTaken: '2026-05-15', beforeAfter: 'after', tags: 'xeriscape, drought-tolerant, desert, completed', description: 'Finished xeriscape with decomposed granite and native plants' },
      { title: 'Wedding Venue Ceremony Area', category: 'Completed', projectName: 'Rosewood Wedding Venue', location: '800 Garden Lane', dateTaken: '2026-05-28', beforeAfter: 'after', tags: 'wedding, venue, ceremony, garden, completed', description: 'Stone aisle with rose arbor backdrop for ceremonies' },
      { title: 'Rain Garden Native Plantings', category: 'Completed', projectName: 'Green Living Rain Garden', location: '150 Eco Boulevard', dateTaken: '2026-05-30', beforeAfter: 'after', tags: 'rain garden, native plants, stormwater, eco', description: 'Bio-retention garden with native sedges and wildflowers' },
      { title: 'School Outdoor Classroom Before', category: 'Before/After', projectName: 'Lincoln School Green Space', location: '200 School Lane', dateTaken: '2026-06-14', beforeAfter: 'before', tags: 'school, outdoor classroom, before, empty field', description: 'Empty grass field before outdoor classroom installation' },
      { title: 'Corporate Campus Spring Color', category: 'Completed', projectName: 'Apex Campus Maintenance', location: '789 Corporate Blvd', dateTaken: '2026-04-25', beforeAfter: 'after', tags: 'corporate, spring, color, annuals, maintained', description: 'Annual flower beds in full spring color at main entry' },
      { title: 'Healing Garden Water Feature', category: 'Progress', projectName: 'Healing Arts Garden', location: '400 Wellness Way', dateTaken: '2026-04-20', beforeAfter: 'during', tags: 'healing garden, water feature, construction, medical', description: 'Basalt fountain being assembled in courtyard' },
      { title: 'Fire Safety Defensible Space', category: 'Before/After', projectName: 'Mountain View Fire Safety', location: 'Mountain View Estates', dateTaken: '2026-04-28', beforeAfter: 'after', tags: 'fire safety, defensible space, brush clearing, after', description: 'Cleared and replanted defensible space zone around home' },
      { title: 'Pool Area Tropical Before', category: 'Before/After', projectName: 'Thompson Pool Landscape', location: '321 Palm Drive', dateTaken: '2026-03-10', beforeAfter: 'before', tags: 'pool, bare, before, dirt, construction', description: 'Bare dirt around newly installed pool before landscaping' },
      { title: 'Restaurant Patio Garden Design', category: 'Design', projectName: 'Bella Vista Patio Garden', location: '555 Main Street', dateTaken: '2026-03-28', beforeAfter: 'before', tags: 'restaurant, patio, design, outdoor dining, render', description: 'Concept design for intimate outdoor dining garden space' },
      { title: 'Erosion Control Wall Completed', category: 'Completed', projectName: 'Lake View Erosion Control', location: '100 Lakeshore Drive', dateTaken: '2026-04-30', beforeAfter: 'after', tags: 'retaining wall, erosion control, completed, lakeshore', description: 'Three-tier retaining wall with integrated plantings' }
    ]);
    console.log('Photo gallery seeded');

    // Seed Invoices (15 items)
    await Invoice.bulkCreate([
      { invoiceNumber: 'INV-2026-001', clientName: 'Robert Johnson', projectName: 'Johnson Backyard Makeover', services: 'Patio demolition, grading, bluestone patio installation, fire pit construction, seating wall', laborTotal: 4500, materialTotal: 5625, taxRate: 8.25, totalAmount: 10962.28, dueDate: '2026-05-01', paidDate: '2026-04-22', status: 'paid' },
      { invoiceNumber: 'INV-2026-002', clientName: 'Maria Garcia', projectName: 'Garcia Front Yard Upgrade', services: 'Walkway installation, foundation plantings, lawn renovation, landscape lighting', laborTotal: 2200, materialTotal: 3800, taxRate: 8.25, totalAmount: 6495.00, dueDate: '2026-05-15', paidDate: null, status: 'pending' },
      { invoiceNumber: 'INV-2026-003', clientName: 'Apex Business Group', projectName: 'Apex Campus Maintenance', services: 'Monthly lawn care, seasonal plantings, irrigation management, snow removal', laborTotal: 3000, materialTotal: 800, taxRate: 7.50, totalAmount: 4085.00, dueDate: '2026-01-31', paidDate: '2026-01-28', status: 'paid' },
      { invoiceNumber: 'INV-2026-004', clientName: 'David Thompson', projectName: 'Thompson Pool Landscape', services: 'Tropical plant installation, privacy screening, pool deck landscaping', laborTotal: 3500, materialTotal: 4200, taxRate: 8.00, totalAmount: 8316.00, dueDate: '2026-04-15', paidDate: null, status: 'overdue' },
      { invoiceNumber: 'INV-2026-005', clientName: 'Sunset Ridge HOA', projectName: 'Sunset Ridge Entry Redesign', services: 'Monument sign installation, entry plantings, irrigation, lighting', laborTotal: 12000, materialTotal: 18500, taxRate: 7.75, totalAmount: 32868.75, dueDate: '2026-06-01', paidDate: null, status: 'pending' },
      { invoiceNumber: 'INV-2026-006', clientName: 'Bella Vista Restaurant', projectName: 'Bella Vista Patio Garden', services: 'Raised planter construction, flagstone patio, seasonal plantings, string lighting', laborTotal: 4000, materialTotal: 5200, taxRate: 8.50, totalAmount: 9982.00, dueDate: '2026-05-10', paidDate: '2026-05-08', status: 'paid' },
      { invoiceNumber: 'INV-2026-007', clientName: 'Lake View Estates', projectName: 'Lake View Erosion Control', services: 'Retaining wall construction, slope stabilization, drainage installation, replanting', laborTotal: 8000, materialTotal: 12000, taxRate: 7.25, totalAmount: 21450.00, dueDate: '2026-04-01', paidDate: '2026-03-29', status: 'paid' },
      { invoiceNumber: 'INV-2026-008', clientName: 'Patricia Williams', projectName: 'Williams Xeriscape Project', services: 'Sod removal, decomposed granite installation, drought-tolerant plantings', laborTotal: 2500, materialTotal: 3200, taxRate: 8.00, totalAmount: 6156.00, dueDate: '2026-05-20', paidDate: null, status: 'pending' },
      { invoiceNumber: 'INV-2026-009', clientName: 'Harrison Family Trust', projectName: 'Harrison Estate Gardens', services: 'Formal parterre layout, boxwood hedge installation, fountain, gravel allees', laborTotal: 18000, materialTotal: 25000, taxRate: 7.50, totalAmount: 46225.00, dueDate: '2026-06-01', paidDate: null, status: 'pending' },
      { invoiceNumber: 'INV-2026-010', clientName: 'Lincoln Elementary', projectName: 'Lincoln School Green Space', services: 'Outdoor classroom construction, shade tree planting, nature trail, pollinator garden', laborTotal: 5000, materialTotal: 7500, taxRate: 0.00, totalAmount: 12500.00, dueDate: '2026-07-15', paidDate: null, status: 'pending' },
      { invoiceNumber: 'INV-2026-011', clientName: 'Healing Arts Medical', projectName: 'Healing Arts Garden', services: 'ADA pathway construction, water feature installation, sensory plantings', laborTotal: 6000, materialTotal: 9500, taxRate: 8.25, totalAmount: 16778.75, dueDate: '2026-05-01', paidDate: null, status: 'overdue' },
      { invoiceNumber: 'INV-2026-012', clientName: 'Urban Living Properties', projectName: 'Urban Living Complex', services: 'Irrigation system, community garden beds, privacy plantings, pathway lighting', laborTotal: 15000, materialTotal: 22000, taxRate: 7.75, totalAmount: 39868.50, dueDate: '2026-06-15', paidDate: null, status: 'pending' },
      { invoiceNumber: 'INV-2026-013', clientName: 'Mountain View HOA', projectName: 'Mountain View Fire Safety', services: 'Brush clearing, defensible space creation, fire-resistant plantings', laborTotal: 4500, materialTotal: 6000, taxRate: 8.00, totalAmount: 11340.00, dueDate: '2026-05-01', paidDate: '2026-04-30', status: 'paid' },
      { invoiceNumber: 'INV-2026-014', clientName: 'Rosewood Events', projectName: 'Rosewood Wedding Venue', services: 'Ceremony area grading, stone aisle, rose arbor, reception garden plantings', laborTotal: 10000, materialTotal: 15000, taxRate: 8.50, totalAmount: 27125.00, dueDate: '2026-04-01', paidDate: null, status: 'overdue' },
      { invoiceNumber: 'INV-2026-015', clientName: 'Green Living Association', projectName: 'Green Living Rain Garden', services: 'Bio-retention basin excavation, underdrain system, native plant installation, signage', laborTotal: 2800, materialTotal: 3500, taxRate: 7.00, totalAmount: 6741.00, dueDate: '2026-05-15', paidDate: '2026-05-10', status: 'paid' }
    ]);
    console.log('Invoices seeded');

    // Seed Suppliers (15 items)
    await Supplier.bulkCreate([
      { name: 'Stone World Supply', contactPerson: 'Frank Rosetti', email: 'frank@stoneworldsupply.com', phone: '555-201-3400', address: '1200 Quarry Road, Springfield, IL 62701', specialty: 'Stone', rating: 4.8, deliveryTime: '3 days', paymentTerms: 'Net 30' },
      { name: 'Lumber Pro', contactPerson: 'Janet Crawford', email: 'janet@lumberpro.com', phone: '555-201-3401', address: '800 Timber Lane, Riverside, CA 92501', specialty: 'Lumber', rating: 4.5, deliveryTime: '5 days', paymentTerms: 'Net 30' },
      { name: 'Green Valley Nursery', contactPerson: 'Linda Tran', email: 'linda@greenvalleynursery.com', phone: '555-201-3402', address: '450 Garden Center Drive, Portland, OR 97201', specialty: 'Plants', rating: 4.9, deliveryTime: '2 days', paymentTerms: 'Net 15' },
      { name: 'Earth Materials Inc', contactPerson: 'Tom Bradley', email: 'tom@earthmaterials.com', phone: '555-201-3403', address: '3000 Soil Works Blvd, Austin, TX 78701', specialty: 'Soil', rating: 4.3, deliveryTime: '2 days', paymentTerms: 'Net 30' },
      { name: 'Irrigation Direct', contactPerson: 'Samantha Nguyen', email: 'samantha@irrigationdirect.com', phone: '555-201-3404', address: '1500 Water Way, Phoenix, AZ 85001', specialty: 'Irrigation', rating: 4.6, deliveryTime: '4 days', paymentTerms: 'Net 45' },
      { name: 'Kichler Lighting Distributor', contactPerson: 'Mark Jensen', email: 'mark@kichlerdist.com', phone: '555-201-3405', address: '700 Bright Street, Denver, CO 80201', specialty: 'Lighting', rating: 4.7, deliveryTime: '7 days', paymentTerms: 'Net 30' },
      { name: 'Rock Yard Direct', contactPerson: 'Paul Sanchez', email: 'paul@rockyarddirect.com', phone: '555-201-3406', address: '2500 Gravel Pit Road, Tucson, AZ 85701', specialty: 'Stone', rating: 4.2, deliveryTime: '3 days', paymentTerms: 'Net 15' },
      { name: 'Turf Masters', contactPerson: 'Brian Kelley', email: 'brian@turfmasters.com', phone: '555-201-3407', address: '600 Sod Farm Lane, Nashville, TN 37201', specialty: 'Plants', rating: 4.4, deliveryTime: '1 day', paymentTerms: 'Due on Delivery' },
      { name: 'Belgard Authorized Dealer', contactPerson: 'Karen Mitchell', email: 'karen@belgarddealer.com', phone: '555-201-3408', address: '1800 Paver Plaza, Charlotte, NC 28201', specialty: 'Stone', rating: 4.8, deliveryTime: '5 days', paymentTerms: 'Net 30' },
      { name: 'Green Waste Solutions', contactPerson: 'Derek Hoffman', email: 'derek@greenwaste.com', phone: '555-201-3409', address: '4200 Recycling Drive, Sacramento, CA 95814', specialty: 'Soil', rating: 3.9, deliveryTime: '1 day', paymentTerms: 'Net 15' },
      { name: 'Aquascape Dealer Network', contactPerson: 'Rachel Kim', email: 'rachel@aquascapedealer.com', phone: '555-201-3410', address: '900 Pond View Circle, St. Charles, IL 60174', specialty: 'Irrigation', rating: 4.6, deliveryTime: '7 days', paymentTerms: 'Net 30' },
      { name: 'Deck Pros Supply', contactPerson: 'Steve Walters', email: 'steve@deckprossupply.com', phone: '555-201-3411', address: '350 Composite Court, Atlanta, GA 30301', specialty: 'Lumber', rating: 4.1, deliveryTime: '5 days', paymentTerms: 'Net 45' },
      { name: 'Landscape Supply Co', contactPerson: 'Angela Torres', email: 'angela@landscapesupply.com', phone: '555-201-3412', address: '2200 Supply Chain Blvd, Dallas, TX 75201', specialty: 'Soil', rating: 4.5, deliveryTime: '2 days', paymentTerms: 'Net 30' },
      { name: 'SunBrite Outdoor Lighting', contactPerson: 'Chris Yamamoto', email: 'chris@sunbritelighting.com', phone: '555-201-3413', address: '1100 Solar Way, San Diego, CA 92101', specialty: 'Lighting', rating: 4.3, deliveryTime: '6 days', paymentTerms: 'Net 30' },
      { name: 'Pacific Coast Plants', contactPerson: 'Maria Delgado', email: 'maria@pacificcoastplants.com', phone: '555-201-3414', address: '5500 Nursery Road, Ventura, CA 93001', specialty: 'Plants', rating: 5.0, deliveryTime: '3 days', paymentTerms: 'Net 15' }
    ]);
    console.log('Suppliers seeded');

    // Seed Clients
    await Client.bulkCreate([
      { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@email.com', phone: '555-0101', address: '123 Oak St', city: 'Austin', state: 'TX', zipCode: '78701', propertyType: 'Residential', propertySize: '5000', source: 'Referral', status: 'active', totalSpent: 12500 },
      { firstName: 'Mike', lastName: 'Chen', email: 'mike.chen@corp.com', phone: '555-0102', address: '456 Commerce Blvd', city: 'Austin', state: 'TX', zipCode: '78702', propertyType: 'Commercial', propertySize: '25000', source: 'Website', status: 'active', totalSpent: 45000 },
      { firstName: 'Lisa', lastName: 'Martinez', email: 'lisa.m@email.com', phone: '555-0103', address: '789 Elm Dr', city: 'Round Rock', state: 'TX', zipCode: '78664', propertyType: 'Residential', propertySize: '8000', source: 'Google Ads', status: 'active', totalSpent: 8900 },
      { firstName: 'David', lastName: 'Thompson', email: 'david.t@hoa.org', phone: '555-0104', address: '321 Pine Ave', city: 'Cedar Park', state: 'TX', zipCode: '78613', propertyType: 'HOA', propertySize: '50000', source: 'Referral', status: 'active', totalSpent: 67000 },
      { firstName: 'Emily', lastName: 'Wilson', email: 'emily.w@email.com', phone: '555-0105', address: '654 Maple Ln', city: 'Austin', state: 'TX', zipCode: '78703', propertyType: 'Residential', propertySize: '3500', source: 'Social Media', status: 'active', totalSpent: 5200 },
    ]);
    console.log('Clients seeded');

    // Seed Expenses
    await Expense.bulkCreate([
      { description: 'Mulch delivery - Oak Gardens project', amount: 450, category: 'Materials', date: '2026-03-15', vendor: 'Green Supply Co', paymentMethod: 'Credit Card', projectName: 'Oak Gardens Renovation', status: 'approved' },
      { description: 'Diesel fuel for truck fleet', amount: 320, category: 'Fuel', date: '2026-03-14', vendor: 'Shell Station', paymentMethod: 'Debit Card', status: 'approved' },
      { description: 'Mower blade replacement', amount: 85, category: 'Equipment', date: '2026-03-13', vendor: 'Ace Hardware', paymentMethod: 'Cash', status: 'approved' },
      { description: 'Monthly insurance premium', amount: 1200, category: 'Insurance', date: '2026-03-01', vendor: 'State Farm', paymentMethod: 'Bank Transfer', taxDeductible: true, status: 'approved' },
      { description: 'Facebook ads campaign', amount: 250, category: 'Marketing', date: '2026-03-10', vendor: 'Meta', paymentMethod: 'Credit Card', taxDeductible: true, status: 'pending' },
      { description: 'Pavers for Thompson patio', amount: 1800, category: 'Materials', date: '2026-03-12', vendor: 'Stone World', paymentMethod: 'Check', projectName: 'Thompson Patio', status: 'approved' },
      { description: 'Subcontractor - electrical work', amount: 2500, category: 'Subcontractor', date: '2026-03-08', vendor: 'Sparky Electric', paymentMethod: 'Check', projectName: 'Corporate Campus', status: 'approved' },
    ]);
    console.log('Expenses seeded');

    // Seed Time Entries
    await TimeEntry.bulkCreate([
      { workerName: 'Carlos Rivera', projectName: 'Oak Gardens Renovation', date: '2026-03-18', startTime: '07:00', endTime: '15:30', hoursWorked: 8, hourlyRate: 25, taskType: 'Planting', breakMinutes: 30, status: 'approved' },
      { workerName: 'Carlos Rivera', projectName: 'Thompson Patio', date: '2026-03-19', startTime: '07:00', endTime: '16:00', hoursWorked: 8.5, hourlyRate: 25, taskType: 'Hardscaping', breakMinutes: 30, status: 'approved' },
      { workerName: 'James Brown', projectName: 'Oak Gardens Renovation', date: '2026-03-18', startTime: '07:30', endTime: '15:30', hoursWorked: 7.5, hourlyRate: 22, taskType: 'Mulching', breakMinutes: 30, status: 'approved' },
      { workerName: 'James Brown', projectName: 'Wilson Front Yard', date: '2026-03-19', startTime: '08:00', endTime: '12:00', hoursWorked: 4, hourlyRate: 22, taskType: 'Mowing', breakMinutes: 0, status: 'pending' },
      { workerName: 'Maria Garcia', projectName: 'Corporate Campus', date: '2026-03-18', startTime: '06:30', endTime: '15:00', hoursWorked: 8, hourlyRate: 28, taskType: 'Irrigation', breakMinutes: 30, status: 'approved' },
      { workerName: 'Maria Garcia', projectName: 'Corporate Campus', date: '2026-03-19', startTime: '06:30', endTime: '15:00', hoursWorked: 8, hourlyRate: 28, taskType: 'Planting', breakMinutes: 30, status: 'approved' },
    ]);
    console.log('Time entries seeded');

    console.log('\n✅ All seed data inserted successfully!');
    console.log('Demo accounts were created with the caller-supplied password.');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
