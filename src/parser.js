import yaml from 'js-yaml';

const parsers = {
  json: JSON.parse,
  yaml: yaml.load,
  yml: yaml.load,
};

export default (data, ext) => {
  try {
    return parsers[ext](data);
  } catch (error) {
    throw new Error(`Unknown format ${ext}!`);
  }
};