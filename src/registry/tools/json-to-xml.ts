import { ToolEntry } from '../types';

export const jsonToXml: ToolEntry = {
  "id": "json-to-xml",
  "name": "Json To Xml",
  "desc": "Convert JSON to XML and XML to JSON.",
  "href": "/developer-tools/json-to-xml/",
  "category": "developer",
  "subCategory": "Converters",
  "icon": null,
  "color": null,
  "featured": false,
  "popular": false,
  "status": "new",
  "lastAdded": new Date().toISOString().split('T')[0],
  "keywords": [
    "json to xml",
    "xml to json",
    "xml",
    "json",
    "converter",
    "developer"
  ],
  "input": null,
  "output": null,
  "related": ["csv-to-json"],
  "requiresNetwork": false
};
