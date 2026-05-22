const express = require('express');
const router = express.Router();
function check(input = {}) {
  const plants = input.plants || [
    { plant: 'Japanese maple', zone_min: 5, zone_max: 8, site_zone: 9, sun: 'afternoon' },
    { plant: 'Lavender', zone_min: 5, zone_max: 9, site_zone: 8, sun: 'full' },
  ];
  return { plants: plants.map(p => {
    const ok = Number(p.site_zone) >= Number(p.zone_min) && Number(p.site_zone) <= Number(p.zone_max);
    return { ...p, status: ok ? 'suitable' : 'substitute_recommended', note: ok ? 'Zone compatible' : 'Hardiness zone mismatch' };
  }) };
}
router.get('/', (req, res) => res.json(check()));
router.post('/check', (req, res) => res.json(check(req.body || {})));
module.exports = router;
