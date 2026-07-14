import { ToolContent } from '@/src/tool-content';

export const llmsTxtGeneratorContent: ToolContent = {
  detailedDescription: `The LLMs.txt Generator helps developers and site owners create an \`llms.txt\` file. An \`llms.txt\` file acts as a guide for AI agents, language models, and web crawlers, providing instructions on how to navigate, interpret, and use the contents of a website. It allows you to specify system prompts, tool schemas, and URLs for agents to explore, all while maintaining absolute privacy since this tool runs entirely locally in your browser.`,
  howTo: [
    "Enter your project name, description, and author URL.",
    "Add any system prompts or instructions you want AI agents to follow when interacting with your site.",
    "List important URLs or paths the agent should know about.",
    "Click 'Generate' to see the resulting llms.txt content.",
    "Download or copy the generated content and place it in your website's root or `.well-known` directory."
  ],
  faq: [
    {
      question: "What is an llms.txt file?",
      answer: "An `llms.txt` file is a standard proposed for websites to provide clear metadata, instructions, and context to Large Language Models (LLMs) and AI agents interacting with the site."
    },
    {
      question: "Where should I put the llms.txt file?",
      answer: "It is recommended to place the file at the root of your domain (e.g., `https://example.com/llms.txt`) or in the `.well-known` directory."
    },
    {
      question: "Is my data sent to any servers?",
      answer: "No, all generation happens locally in your browser."
    }
  ],
  useCases: [
    "Providing context about a documentation site for AI web scrapers",
    "Defining rules and system prompts for Agentic Browsing bots",
    "Listing available API endpoints and OpenAPI schemas for LLMs"
  ]
};
