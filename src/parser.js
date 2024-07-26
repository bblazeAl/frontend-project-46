import yaml from 'js-yaml';

const parsers = {
  json: JSON.parse,
  yaml: yaml.parse,
  yml: yaml.parse,
};

export default (filepath, ext) => {
  try {
    return parsers[ext](filepath);
  } catch (error) {
    throw new Error(`Unknown format ${ext}!`);
  }
};
