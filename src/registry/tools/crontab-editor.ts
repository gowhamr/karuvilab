import { ToolEntry } from '../types';

export const crontab_editor: ToolEntry = {
  id: 'crontab-editor',
  name: 'Crontab Editor',
  desc: 'Visual cron schedule editor with human-readable preview. Build, validate and understand cron expressions instantly',
  href: 'developer-tools/crontab-editor/',
  category: 'developer',
  keywords: ['cron', 'crontab', 'scheduler', 'linux', 'devops', 'automation'],
  status: 'new',
  difficulty: 'beginner',
  priority: 0.9,
  searchIntent: 'action',
  related: ['json-formatter', 'base64', 'regex-tester'],
  seoContent: {
    detailedDescription: `Crontab Editor is a visual, browser-native tool for building and understanding cron schedule expressions. No sign-ups, no server — everything runs locally in your browser. Perfect for developers, DevOps engineers, and system administrators who work with scheduled tasks on Linux/Unix systems.`,
    howTo: [
      'Type a cron expression in the input field or use the visual sliders',
      'See the human-readable description update instantly as you type',
      'View the next 5 scheduled run times to confirm your schedule',
      'Use quick presets for common schedules like "Every day at midnight"',
      'Copy the final expression to use in your crontab or CI/CD config'
    ],
    faq: [
      {
        question: 'What is a cron expression?',
        answer: 'A cron expression is a string of 5 fields (minute, hour, day of month, month, day of week) that defines when a scheduled task should run on Linux/Unix systems.'
      },
      {
        question: 'What does * mean in a cron expression?',
        answer: '* means "every" — every minute, every hour, every day, etc. For example, "* * * * *" runs every minute.'
      },
      {
        question: 'Is my cron expression saved anywhere?',
        answer: 'No. Everything runs locally in your browser. Nothing is sent to any server.'
      },
      {
        question: 'Does this support the non-standard @yearly, @monthly shortcuts?',
        answer: 'Yes. Common shortcuts like @yearly, @monthly, @weekly, @daily, @hourly and @reboot are supported and converted to their standard 5-field equivalents.'
      },
      {
        question: 'Can I use this for AWS CloudWatch or GitHub Actions cron?',
        answer: 'Yes. The standard 5-field cron format is compatible with GitHub Actions, AWS CloudWatch Events, and most CI/CD platforms.'
      }
    ]
  }
};
