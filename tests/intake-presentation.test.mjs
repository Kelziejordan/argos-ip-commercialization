import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const intake = readFileSync(new URL('../src/components/AssetIntakeSection.tsx', import.meta.url), 'utf8');
const samples = readFileSync(new URL('../src/engine/sampleAssets.ts', import.meta.url), 'utf8');

test('paste-code mode clears example content on first focus', () => {
  assert.match(intake, /onFocus=\{\(\) => setCustomCode\(''\)\}/);
  assert.match(intake, /value=\{customCode\}/);
});

test('sample catalog is generic demonstration content, not personal project assets', () => {
  assert.doesNotMatch(samples, /ArgOS Autonomous Operating Substrate/);
  assert.doesNotMatch(samples, /argos-supervisor-core/);
  assert.doesNotMatch(samples, /94%/);
  assert.match(samples, /High-Performance Cache/);
  assert.match(samples, /Stream Processing Pipeline/);
  assert.match(samples, /Image Processing Engine/);
});

test('intake offers simple upload, sample, and paste choices', () => {
  assert.match(intake, />Upload Asset</);
  assert.match(intake, />Try a Sample</);
  assert.match(intake, />Paste Code</);
});
