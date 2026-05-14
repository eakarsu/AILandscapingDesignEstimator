/**
 * Simple synchronous validators for estimate creation.
 * Returns { valid: true } or { valid: false, errors: [...] }.
 */

function validateDesignCreate(body) {
  const errors = [];
  if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
    errors.push('title is required and must be a non-empty string');
  }
  if (body.title && body.title.length > 255) {
    errors.push('title must be 255 characters or fewer');
  }
  if (body.budget !== undefined && body.budget !== null) {
    const budget = parseFloat(body.budget);
    if (isNaN(budget) || budget < 0) {
      errors.push('budget must be a non-negative number');
    }
  }
  if (body.squareFootage !== undefined && body.squareFootage !== null) {
    const sqft = parseFloat(body.squareFootage);
    if (isNaN(sqft) || sqft < 0) {
      errors.push('squareFootage must be a non-negative number');
    }
  }
  return errors.length === 0 ? { valid: true } : { valid: false, errors };
}

function validateCostEstimateCreate(body) {
  const errors = [];
  if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
    errors.push('title is required and must be a non-empty string');
  }
  if (body.title && body.title.length > 255) {
    errors.push('title must be 255 characters or fewer');
  }
  const numericFields = ['laborCost', 'materialCost', 'equipmentCost', 'totalEstimate'];
  for (const field of numericFields) {
    if (body[field] !== undefined && body[field] !== null) {
      const val = parseFloat(body[field]);
      if (isNaN(val) || val < 0) {
        errors.push(`${field} must be a non-negative number`);
      }
    }
  }
  const percentFields = ['overheadPercent', 'profitMarginPercent'];
  for (const field of percentFields) {
    if (body[field] !== undefined && body[field] !== null) {
      const val = parseFloat(body[field]);
      if (isNaN(val) || val < 0 || val > 100) {
        errors.push(`${field} must be between 0 and 100`);
      }
    }
  }
  return errors.length === 0 ? { valid: true } : { valid: false, errors };
}

/**
 * Express middleware factory.
 * Usage: router.post('/', auth, validateBody(validateDesignCreate), async (req, res) => { ... })
 */
function validateBody(validatorFn) {
  return (req, res, next) => {
    const result = validatorFn(req.body);
    if (!result.valid) {
      return res.status(422).json({ error: 'Validation failed', details: result.errors });
    }
    next();
  };
}

module.exports = { validateDesignCreate, validateCostEstimateCreate, validateBody };
