'use strict';
function close(a, b, tolerance = 0.01) { return Math.abs(Number(a) - Number(b)) <= tolerance; }
function evaluate(input = {}) {
  const errors = [], site = input.site || {}, alternatives = input.alternatives || [];
  if (!site.id || !(site.areaSqM > 0) || !site.surveyVersion || !site.requirementsVersion || !site.coordinateSystem || !Array.isArray(site.constraints)) errors.push('dimensioned versioned site, requirements, and constraints required');
  if (!alternatives.length) errors.push('at least one editable alternative required');
  if (!Array.isArray(input.assumptions) || !input.assumptions.length ||
      input.assumptions.some((item) => !String(item).trim())) errors.push('explicit design assumptions required');
  const evaluated = [];
  for (const alt of alternatives) {
    const issues = [];
    if (!alt.id || !alt.version || !alt.drawingScale || !Array.isArray(alt.elements)) issues.push('version, scale, and elements required');
    const elementArea = (alt.elements || []).reduce((sum, e) => {
      if (!(e.lengthM > 0) || !(e.widthM > 0) || !e.materialSku) issues.push(`element ${e.id || '?'} lacks dimensions/material`);
      return sum + Number(e.lengthM || 0) * Number(e.widthM || 0);
    }, 0);
    if (site.areaSqM && elementArea > site.areaSqM * 1.01) issues.push('designed area exceeds surveyed site');
    const qtyCost = (alt.quantities || []).reduce((sum, q) => {
      if (!q.sku || !(q.quantity >= 0) || !q.unit || !(q.unitCost >= 0) || !q.catalogVersion) issues.push('quantity lacks unit, cost, or catalog version');
      return sum + Number(q.quantity || 0) * Number(q.unitCost || 0);
    }, 0);
    if (!close(qtyCost, alt.budget?.materialTotal || 0)) issues.push('material quantities do not reconcile to budget');
    const scheduleIds = new Set((alt.schedule || []).map((s) => s.id));
    for (const task of alt.schedule || []) {
      if (!(task.durationDays > 0) || (task.dependsOn || []).some((id) => !scheduleIds.has(id))) issues.push(`task ${task.id || '?'} has invalid duration/dependency`);
    }
    if ((alt.assets || []).some((a) => !a.licenseRef || !a.sourceRef)) issues.push('licensed asset provenance incomplete');
    if (!alt.deliverable?.format || !/^[a-f0-9]{64}$/i.test(alt.deliverable?.sha256 || '') || alt.deliverable?.dimensionsVerified !== true) issues.push('verified deliverable required');
    if (!alt.qualifiedReview?.codeCheckVersion || !alt.qualifiedReview?.permitSourceVersion ||
        !alt.qualifiedReview?.constructabilityApprovedBy || !alt.qualifiedReview?.renderReviewedBy) {
      issues.push('qualified code, permit, constructability, and render review required');
    }
    errors.push(...issues.map((x) => `alternative ${alt.id || '?'}: ${x}`));
    evaluated.push({ id: alt.id, elementAreaSqM: elementArea, materialCost: qtyCost, issues });
  }
  return { errors, result: { alternatives: evaluated, constraintCount: (site.constraints || []).length,
    decision: errors.length ? 'revise' : 'reviewable' },
    assumptions: input.assumptions || [],
    uncertainty: { codeAndPermitReviewRequired: true, constructabilityReviewRequired: true, renderFidelityHumanReviewRequired: true } };
}
module.exports = { evaluate };
