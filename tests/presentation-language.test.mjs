import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const customerFacingFiles = [
  'src/components/ValuationAndLicensingView.tsx',
  'src/components/BentoGridDashboard.tsx',
  'src/components/Header.tsx',
  'src/components/BuyerDiscoveryAndOutreachView.tsx',
  'README.md',
];

const forbiddenPresentationTerms = /\b(simulat(?:e|es|ed|ing|ion|ions)|sandbox|modeled pipeline|hypothetical estimates only|cleanroom lineage|non-appraisal estimate)\b/i;

test('customer-facing presentation contains no prototype/simulation language', () => {
  const violations = [];
  for (const file of customerFacingFiles) {
    const text = fs.readFileSync(file, 'utf8');
    if (forbiddenPresentationTerms.test(text)) violations.push(file);
  }
  assert.deepEqual(violations, [], `Forbidden presentation language remains in: ${violations.join(', ')}`);
});

test('commercial assessment terminology is present', () => {
  const valuation = fs.readFileSync('src/components/ValuationAndLicensingView.tsx', 'utf8');
  const dashboard = fs.readFileSync('src/components/BentoGridDashboard.tsx', 'utf8');
  assert.match(valuation, /Economic Impact Model/);
  assert.match(dashboard, /Commercial Opportunity/);
  assert.match(dashboard, /Screening Assessment/);
  assert.match(dashboard, /Source Lineage/);
});
