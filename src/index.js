import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import parseData from './parser.js';

const getFullPath = (filepath) => path.resolve(process.cwd(), filepath);
const extractFormat = (filepath) => path.extname(filepath).slice(1);
const getData = (filepath) => {
  const format = extractFormat(filepath);
  const content = fs.readFileSync(filepath, 'utf-8');
  return parseData(content, format);
};

export default (filePath1, filePath2) => {
  const fullFilePath1 = getFullPath(filePath1);
  const fullFilePath2 = getFullPath(filePath2);

  const data1 = getData(fullFilePath1);
  const data2 = getData(fullFilePath2);
  const allKeys = _.union(Object.keys(data1), Object.keys(data2)).sort();
  const result = allKeys.map((key) => {
    if (!Object.prototype.hasOwnProperty.call(data2, key)) {
      return `  - ${key}: ${data1[key]}`;
    }
    if (!Object.prototype.hasOwnProperty.call(data1, key)) {
      return `  + ${key}: ${data2[key]}`;
    }
    if (data1[key] !== data2[key]) {
      return `  - ${key}: ${data1[key]}\n  + ${key}: ${data2[key]}`;
    }
    return `    ${key}: ${data1[key]}`;
  });
  return `{\n${result.join('\n')}\n}`;
};

// console.log('fullFilePath1', fullFilePath1);
// console.log('fullFilePath2', fullFilePath2);
// console.log(fs.readFileSync(fullFilePath1, 'utf-8'));
// console.log(fs.readFileSync(fullFilePath2, 'utf-8'));
