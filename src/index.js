import path from 'path';
import fs from 'fs';
import parseData from './parser.js';
import formatter from './formatters/index.js';
import buildDiff from './utils.js';

const getFullPath = (filepath) => path.resolve(process.cwd(), filepath);
const extractFormat = (filepath) => path.extname(filepath).slice(1);
const getData = (filepath) => {
  const format = extractFormat(filepath);
  const content = fs.readFileSync(filepath, 'utf-8');
  return parseData(content, format);
};

export default (filePath1, filePath2, format = 'stylish') => {
  const data1 = getData(getFullPath(filePath1));
  const data2 = getData(getFullPath(filePath2));
  const diffTree = buildDiff(data1, data2);
  return formatter(diffTree, format);
};
