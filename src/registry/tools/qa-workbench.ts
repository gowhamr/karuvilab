import { ToolEntry } from "../types";

export const qaWorkbench: ToolEntry = {
  "id": "qa-workbench",
  "name": "QA Workbench",
  "desc": "Unified testing suite for developers: API requests, Regex, Text Diff, JSON formatting, and Mock Data.",
  "href": "/developer-tools/qa-workbench/",
  "category": "developer",
  "icon": null,
  "color": null,
  "featured": true,
  "popular": false,
  "status": "beta",
  "lastAdded": "2026-07-25",
  "keywords": ["qa", "workbench", "testing", "regex", "diff", "json", "mock data", "api tester"],
  "input": "text",
  "output": "text",
  "difficulty": "intermediate",
  "subCategory": "Developer",
  "content": {
    "seoTitle": "QA Workbench - Unified Testing Suite | KaruviLab",
    "seoDescription": "An all-in-one quality assurance workbench for developers. Test regex, generate mock data, format JSON, test APIs, and compare text differences directly in your browser.",
    "h1": "QA Workbench",
    "introduction": "The QA Workbench is a unified suite of developer testing tools. Switch seamlessly between JSON validation, Regex testing, Text diffing, Mock Data generation, and API request testing.",
    "howTo": [
      {
        "step": "Select a Tool",
        "desc": "Choose the testing utility you need from the workbench sidebar or tabs."
      },
      {
        "step": "Configure Input",
        "desc": "Paste your data, regex pattern, or configure your API request details."
      },
      {
        "step": "Execute locally",
        "desc": "Run tests or generate data instantly in your browser without server uploads."
      },
      {
        "step": "Review Results",
        "desc": "View formatted JSON, diff comparisons, regex matches, or API responses."
      }
    ],
    "examples": [],
    "faqs": [
      {
        "q": "Is my testing data secure?",
        "a": "Yes. All data processing (except external API requests you intentionally make) happens entirely inside your browser. We do not store or track your inputs."
      },
      {
        "q": "Can I test local APIs?",
        "a": "Yes, if your local API supports CORS or if you are running a local proxy. Otherwise, browser security policies may block direct requests to localhost from this page."
      }
    ]
  },
  "relatedTools": ["regex-tester", "json-formatter", "text-diff", "fake-data-generator"]
};
