'use strict';
const { createRouter } = require('./router');
const { sequelize: adapt } = require('./store');
const { sequelize } = require('../models');
const auth = require('../middleware/auth');
const { evaluate } = require('./domain');
module.exports = createRouter({ db: adapt(sequelize), auth, evaluate,
  workflow: 'landscape-design-estimate',
  providers: ['cad-bim','gis','product-catalog','cost-catalog','render-worker','contractor','object-storage','permitting'],
  approverRoles: ['qualified_designer','contractor','project_manager','admin'] });

