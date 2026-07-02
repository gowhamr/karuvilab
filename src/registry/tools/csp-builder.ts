import { ToolEntry } from '../types';
import { Shield } from 'lucide-react';

export const csp_builder: ToolEntry = {
  id: 'csp-builder',
  name: 'CSP Builder',
  desc: 'Visual Content Security Policy (CSP) generator. Build, analyze, and export strict CSP headers to protect against XSS and injection attacks',
  href: 'security-tools/csp-builder/',
  category: 'security',
  keywords: ['csp', 'content security policy', 'csp generator', 'xss protection', 'security headers', 'csp evaluator'],
  status: 'new',
  popular: false,
  featured: true,
  difficulty: 'advanced',
  priority: 0.9,
  searchIntent: 'action',
  related: ['meta-tags', 'robots-txt', 'hmac-generator'],
  seoContent: {
    detailedDescription: `The CSP Builder is an essential DevSecOps tool that allows you to visually construct, validate, and analyze Content Security Policies. By defining strict CSP rules, you can significantly mitigate Cross-Site Scripting (XSS) and data injection attacks. Generate secure headers for Nginx, Apache, or HTML meta tags instantly.`,
    howTo: [
      'Select a preset (e.g., Strict or Standard) to get started quickly.',
      'Expand individual directives like `script-src` or `img-src` to configure allowed origins.',
      'Toggle common security sources like `\'self\'`, `\'unsafe-inline\'`, or `https:`.',
      'Add specific trusted domains to the custom sources input.',
      'Check the real-time Security Score and warnings to identify potential vulnerabilities.',
      'Export the final CSP as an HTTP header, Nginx config, or HTML meta tag.'
    ],
    faq: [
      { question: 'What is a Content Security Policy (CSP)?', answer: 'CSP is an added layer of security that helps detect and mitigate certain types of attacks, including XSS and data injection. It works by restricting the domains that the browser considers valid sources of executable scripts.' },
      { question: 'Why is `unsafe-inline` dangerous?', answer: 'Allowing `unsafe-inline` permits the execution of inline scripts and styles. This is the primary vector for XSS attacks, as an attacker can inject malicious `<script>` tags into your page.' },
      { question: 'What is `strict-dynamic`?', answer: '`strict-dynamic` allows the execution of scripts added to the page dynamically by a script that already has a valid nonce or hash. It simplifies the deployment of strict CSPs in modern web applications.' },
      { question: 'What is Report-Only mode?', answer: '`Content-Security-Policy-Report-Only` allows you to test your policy without actually blocking anything. The browser will instead send violation reports to the specified `report-uri`.' },
      { question: 'How do I test my existing CSP?', answer: 'Paste your existing CSP string into the Analyzer tab. The tool will parse the directives, flag insecure configurations (like wildcards), and provide a security score.' }
    ]
  }
};
