import _ from 'lodash';

const makeDifference = (obj1, obj2) => {
  const sortedUnicKeys = _.sortBy(
    _.union(Object.keys(obj1), Object.keys(obj2)),
  );

  return sortedUnicKeys.map((key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];

    const type = (() => {
      if (!Object.hasOwn(obj1, key)) {
        return 'added';
      }
      if (!Object.hasOwn(obj2, key)) {
        return 'deleted';
      }
      if (value1 === value2) {
        return 'unchanged';
      }
      if (typeof value1 === 'object' && typeof value2 === 'object') {
        return 'hasChild';
      }
      return 'changed';
    })();

    switch (type) {
      case 'added':
        return { key, value: value2, type };
      case 'deleted':
        return { key, value: value1, type };
      case 'unchanged':
        return { key, value: value1, type };
      case 'changed':
        return {
          key, oldValue: value1, value: value2, type,
        };
      case 'hasChild':
        return { key, value: makeDifference(value1, value2), type };
      default:
        throw new Error('Unknown change type');
    }
  });
};

export default makeDifference;
