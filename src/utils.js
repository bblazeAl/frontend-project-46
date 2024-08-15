import _ from 'lodash';

const getChangeType = (obj1, obj2, key) => {
  if (!Object.hasOwn(obj1, key)) return 'added';
  if (!Object.hasOwn(obj2, key)) return 'deleted';
  if (obj1[key] === obj2[key]) return 'unchanged';
  return 'changed';
};

const createAddedResult = (key, value) => ({
  key,
  value,
  type: 'added',
});

const createDeletedResult = (key, value) => ({
  key,
  value,
  type: 'deleted',
});

const createChangedResult = (key, oldValue, value) => ({
  key,
  oldValue,
  value,
  type: 'changed',
});

const createChildResult = (key, value) => ({
  key,
  value: buildDiff(value[0], value[1]),
  type: 'hasChild',
});

const buildDiff = (obj1, obj2) => {
  const sortedUnicKeys = _.sortBy(
    _.union(Object.keys(obj1), Object.keys(obj2))
  );

  return sortedUnicKeys.map((key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];
    const type = getChangeType(obj1, obj2, key);

    switch (type) {
      case 'added':
        return createAddedResult(key, value2);
      case 'deleted':
        return createDeletedResult(key, value1);
      case 'unchanged':
        return { key, value: value1, type };
      case 'changed':
        return createChangedResult(key, value1, value2);
      case 'hasChild':
        return createChildResult(key, [value1, value2]);
      default:
        throw new Error('Unknown change type');
    }
  });
};

export default buildDiff;
