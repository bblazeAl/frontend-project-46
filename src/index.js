import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import parseData from './parser.js';
import formatter from './formatters/index.js';

const getFullPath = (filepath) => path.resolve(process.cwd(), filepath);
const extractFormat = (filepath) => path.extname(filepath).slice(1);
const getData = (filepath) => {
  const format = extractFormat(filepath);
  const content = fs.readFileSync(filepath, 'utf-8');
  return parseData(content, format);
};

const buildDiff = (obj1, obj2) => {
  const sortedUnicKeys = _.sortBy(
    _.union(Object.keys(obj1), Object.keys(obj2))
  );
  const resultObj = sortedUnicKeys.map((key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];

    if (!Object.hasOwn(obj1, key)) {
      return { key, value: value2, type: 'added' };
    }

    if (!Object.hasOwn(obj2, key)) {
      return { key, value: value1, type: 'deleted' };
    }

    if (value1 === value2) {
      return { key, value: value1, type: 'unchanged' };
    }

    if (typeof value1 === 'object' && typeof value2 === 'object') {
      return { key, value: buildDiff(value1, value2), type: 'hasChild' };
    }
    return {
      key,
      oldValue: value1,
      value: value2,
      type: 'changed',
    };
  });
  return resultObj;
};

export default (filePath1, filePath2, format = 'stylish') => {
  const data1 = getData(getFullPath(filePath1));
  const data2 = getData(getFullPath(filePath2));
  const diffTree = buildDiff(data1, data2);
  return formatter(diffTree, format);
};

/* const formatValue = (value, depth) => {
  if (_.isObject(value) && !_.isArray(value)) {
    const indent = ' '.repeat(depth * 4);
    const bracketIndent = ' '.repeat((depth - 1) * 4);
    const lines = Object.entries(value).map(([key, val]) => `${indent}${key}: ${formatValue(val, depth + 1)}`);
    return `{\n${lines.join('\n')}\n${bracketIndent}}`;
  }
  return value;
};

const makeDifference = (data1, data2, depth = 1) => {
  const keys = _.union(Object.keys(data1), Object.keys(data2)).sort();
  const indent = ' '.repeat(depth * 4 - 2);
  const currentIndent = ' '.repeat(depth * 4);

  const result = keys.map((key) => {
    if (!Object.prototype.hasOwnProperty.call(data2, key)) {
      return `${indent}- ${key}: ${formatValue(data1[key], depth + 1)}`;
    }
    if (!Object.prototype.hasOwnProperty.call(data1, key)) {
      return `${indent}+ ${key}: ${formatValue(data2[key], depth + 1)}`;
    }
    if (_.isObject(data1[key]) && _.isObject(data2[key])) {
      return `${currentIndent}${key}: ${makeDifference(data1[key], data2[key], depth + 1)}`;
    }
    if (data1[key] !== data2[key]) {
      return `${indent}- ${key}: ${formatValue(data1[key], depth + 1)}\n${indent}+ ${key}: ${formatValue(data2[key], depth + 1)}`;
    }
    return `${currentIndent}${key}: ${formatValue(data1[key], depth + 1)}`;
  });

  return `{\n${result.join('\n')}\n${' '.repeat((depth - 1) * 4)}}`;
};

export default (filePath1, filePath2) => {
  const data1 = getData(getFullPath(filePath1));
  const data2 = getData(getFullPath(filePath2));
  return makeDifference(data1, data2);
};

// console.log('fullFilePath1', fullFilePath1);
// console.log('fullFilePath2', fullFilePath2);
// console.log(fs.readFileSync(fullFilePath1, 'utf-8'));
// console.log(fs.readFileSync(fullFilePath2, 'utf-8')); */

/* const formatValue = (value, depth) => {
  if (_.isObject(value) && !_.isArray(value)) {
    const indent = ' '.repeat(depth * 4);
    const currentIndent = ' '.repeat(depth * 4 - 2);
    const lines = Object.keys(value).map(
      (key) => `${currentIndent}${key}: ${formatValue(value[key], depth + 1)}`
    );
    return `{\n${lines.join('\n')}\n${indent}}`;
  }
  if (_.isArray(value)) {
    const indent = ' '.repeat(depth * 4);
    const lines = value.map(
      (item) => `${indent}- ${formatValue(item, depth + 1)}`
    );
    return `[\n${lines.join('\n')}\n${indent}]`;
  }
  return value;
};

const makeDifference = (data1, data2, depth) => {
  const allKeys = _.union(Object.keys(data1), Object.keys(data2)).sort();
  return allKeys
    .map((key) => {
      const value1 = data1[key];
      const value2 = data2[key];
      if (!_.has(data2, key)) {
        return `  - ${key}: ${formatValue(value1, depth + 1)}`;
      }
      if (!_.has(data1, key)) {
        return `  + ${key}: ${formatValue(value2, depth + 1)}`;
      }
      if (_.isObject(value1) && _.isObject(value2)) {
        return `  ${key}: ${makeDifference(value1, value2, depth + 1)}`;
      }
      if (value1 !== value2) {
        return `  - ${key}: ${formatValue(
          value1,
          depth + 1
        )}\n  + ${key}: ${formatValue(value2, depth + 1)}`;
      }
      return `    ${key}: ${formatValue(value1, depth + 1)}`;
    })
    .join('\n');
};

export default (filePath1, filePath2) => {
  const fullFilePath1 = getFullPath(filePath1);
  const fullFilePath2 = getFullPath(filePath2);

  const data1 = parseData(
    fs.readFileSync(fullFilePath1, 'utf-8'),
    extractFormat(fullFilePath1)
  );
  const data2 = parseData(
    fs.readFileSync(fullFilePath2, 'utf-8'),
    extractFormat(fullFilePath2)
  );

  return `{\n${makeDifference(data1, data2, 0)}\n}`;
}; */

/* ';
;
;
;
;
;

const readfile = (filepath) => {
  const currentDir = cwd();
  const absolutePath = resolve(currentDir, filepath);
  const content = readFileSync(absolutePath, 'utf-8');
  return content;
};

const getExtension = (file) => file.split('.')[1];

const genDiff = (filepath1, filepath2, format = 'stylish') => {
  const file1 = parseFile(getExtension(filepath1), readfile(filepath1));
  const file2 = parseFile(getExtension(filepath2), readfile(filepath2));
  const diffTree = buildDiff(file1, file2);
  return formatter(diffTree, format);
};

export default genDiff; */

/* const buildDiff = (obj1, obj2) => {
  const sortedUnicKeys = _.sortBy(_.union(Object.keys(obj1), Object.keys(obj2)));
  const resultObj = sortedUnicKeys.map((key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];

    if (!Object.hasOwn(obj1, key)) {
      return { key, value: value2, type: 'added' };
    }

    if (!Object.hasOwn(obj2, key)) {
      return { key, value: value1, type: 'deleted' };
    }

    if (value1 === value2) {
      return { key, value: value1, type: 'unchanged' };
    }

    if (typeof value1 === 'object' && typeof value2 === 'object') {
      return { key, value: buildDiff(value1, value2), type: 'hasChild' };
    }
    return {
      key,
      oldValue: value1,
      value: value2,
      type: 'changed',
    };
  });
  return resultObj;
};
export default buildDiff; */
