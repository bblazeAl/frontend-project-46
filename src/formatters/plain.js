/* import _ from 'lodash';

const stringify = (data) => {
  if (_.isObject(data)) {
    return '[complex value]';
  }

  if (typeof data === 'string') {
    return `'${data}'`;
  }

  return data;
};

const plain = (data) => {
  const iter = (obj, path) => {
    const values = Object.values(obj);
    const strings = values.flatMap((node) => {
      const { key, oldValue, value, type } = node;
      const newPath = path === '' ? `${key}` : `${path}.${key}`;
      switch (type) {
        case 'added':
          return `Property '${newPath}' was added with value: ${stringify(
            value
          )}`;
        case 'deleted':
          return `Property '${newPath}' was removed`;
        case 'changed':
          return `Property '${newPath}' was updated. From ${stringify(
            oldValue
          )} to ${stringify(value)}`;
        case 'hasChild':
          return iter(value, newPath);
        case 'unchanged':
          return [];
        default:
          throw new Error('something wrong');
      }
    });
    return strings.filter((item) => item !== undefined).join('\n');
  };
  return iter(data, '');
};

export default plain; */

import _ from 'lodash';

const stringify = (data) => {
  if (_.isObject(data)) {
    return '[complex value]';
  }
  if (typeof data === 'string') {
    return `'${data}'`;
  }
  return data;
};

const formatAdded = (path, value) =>
  `Property '${path}' was added with value: ${stringify(value)}`;
const formatDeleted = (path) => `Property '${path}' was removed`;
const formatChanged = (path, oldValue, value) =>
  `Property '${path}' was updated. From ${stringify(oldValue)} to ${stringify(
    value
  )}`;

const iter = (obj, path) => {
  const values = Object.values(obj);
  return values
    .flatMap((node) => {
      const { key, oldValue, value, type } = node;
      const newPath = path === '' ? `${key}` : `${path}.${key}`;

      switch (type) {
        case 'added':
          return formatAdded(newPath, value);
        case 'deleted':
          return formatDeleted(newPath);
        case 'changed':
          return formatChanged(newPath, oldValue, value);
        case 'hasChild':
          return iter(value, newPath);
        case 'unchanged':
          return [];
        default:
          throw new Error('Unknown type');
      }
    })
    .filter(Boolean)
    .join('\n');
};

const plain = (data) => iter(data, '');

export default plain;
