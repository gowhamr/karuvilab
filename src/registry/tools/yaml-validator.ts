import { ToolEntry } from '../types';

export const yaml_validator: ToolEntry = {
  id: 'yaml-validator',
  name: 'YAML Validator & Converter',
  desc: 'Validate YAML syntax and convert between YAML and JSON.',
  href: 'developer-tools/yaml-validator/',
  category: 'developer',
  subCategory: 'Format & Convert',
  keywords: ['yaml', 'json', 'converter', 'validator', 'parser', 'formatter'],
  searchIntent: 'action',
  related: ['json-formatter', 'diff-checker', 'code-minifier'],
};
