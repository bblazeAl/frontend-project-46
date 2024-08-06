import { test, expect } from '@jest/globals';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { readFileSync } from 'fs';
import gendiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => readFileSync(getFixturePath(filename), 'utf-8');

test('genDiff with JSON files', () => {
  const expected = readFile('expected.txt');
  const file1 = getFixturePath('file1.json');
  const file2 = getFixturePath('file2.json');
  expect(genDiff(file1, file2)).toBe(expected);
});

test('genDiff with YAML files', () => {
  const expected = readFile('expected.txt');
  const file1 = getFixturePath('file1.yaml');
  const file2 = getFixturePath('file2.yaml');
  expect(genDiff(file1, file2)).toBe(expected);
});