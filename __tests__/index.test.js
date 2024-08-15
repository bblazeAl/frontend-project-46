import { test, expect } from '@jest/globals';
import { fileURLToPath } from 'url';
import path from 'path';
import { readFileSync } from 'fs';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) =>
  path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => readFileSync(getFixturePath(filename), 'utf-8');

test('genDiff Tree', () => {
  const file1 = getFixturePath('file1.json');
  const file2 = getFixturePath('file2.json');
  const expected = readFile('expectedTree.txt');

  expect(genDiff(file1, file2)).toEqual(expected);
});

test('gendiff Plain', () => {
  const file1 = getFixturePath('file1.json');
  const file2 = getFixturePath('file2.json');
  const expected = readFile('expectedPlain.txt');

  expect(genDiff(file1, file2, 'plain')).toEqual(expected);
});

test('JSON gendiff', () => {
  const file1 = getFixturePath('file1.json');
  const file2 = getFixturePath('file2.json');
  const expected = readFile('expectedJSON.txt');

  expect(genDiff(file1, file2, 'json')).toEqual(expected);
});
