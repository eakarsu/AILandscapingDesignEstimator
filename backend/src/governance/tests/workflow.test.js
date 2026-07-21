'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { evaluate } = require('../domain');

test('domain workflow accepts a grounded reviewable case', () => {
  const evaluation = evaluate({
  site: { id: 'site1', areaSqM: 100, surveyVersion: 'sv1', requirementsVersion: 'rv1',
    coordinateSystem: 'EPSG:4326', constraints: ['setback'] },
  assumptions: ['catalog prices captured on review date'],
  alternatives: [{ id: 'a1', version: 'v1', drawingScale: '1:100',
    elements: [{ id: 'bed', lengthM: 5, widthM: 4, materialSku: 'mulch' }],
    quantities: [{ sku: 'mulch', quantity: 10, unit: 'm3', unitCost: 20, catalogVersion: 'c1' }],
    budget: { materialTotal: 200 }, schedule: [{ id: 'prep', durationDays: 2, dependsOn: [] }],
    assets: [{ licenseRef: 'lic1', sourceRef: 'catalog:1' }],
    deliverable: { format: 'dxf', sha256: 'f'.repeat(64), dimensionsVerified: true },
    qualifiedReview: { codeCheckVersion: 'code-1', permitSourceVersion: 'permit-1',
      constructabilityApprovedBy: 'designer-1', renderReviewedBy: 'designer-2' } }]
});
  assert.deepEqual(evaluation.errors, []);
  assert.equal(evaluation.result.decision, 'reviewable');
  assert.ok(Array.isArray(evaluation.assumptions));
  assert.equal(typeof evaluation.uncertainty, 'object');
});

test('domain workflow fails closed on incomplete or unsafe input', () => {
  const evaluation = evaluate({ site: {}, alternatives: [{ id: 'a', elements: [{ lengthM: -1 }], quantities: [], budget: {}, schedule: [], assets: [], deliverable: {} }] });
  assert.ok(evaluation.errors.length > 0);
  assert.notEqual(evaluation.result.decision, 'reviewable');
});
