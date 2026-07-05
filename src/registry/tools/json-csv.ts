import { ToolEntry } from '../types';

export const jsonCsv: ToolEntry = {
  "id": "json-csv",
  "name": "JSON ↔ CSV",
  "desc": "Convert between JSON and CSV",
  "href": "developer-tools/json-csv/",
  "category": "developer",
  "input": ["json", "csv"],
  "output": ["json", "csv"],
  "keywords": [
    "json",
    "csv",
    "convert"
  ],
  "difficulty": "intermediate",
  "searchIntent": "transactional",
  "priority": 0.8,
  "popular": true,
  "icon": "",
  "related": [
    "json-formatter",
    "unit-converter"
  ],
  "status": "stable"
};
