import { ToolEntry } from '../types';
import { Activity } from 'lucide-react';

export const bmi_calculator: ToolEntry = {
  id: 'bmi-calculator',
  name: 'BMI Calculator',
  desc: 'Calculate your Body Mass Index with visual healthy range indicator. Supports metric and imperial units with Indian body type context.',
  href: 'calculators/bmi-calculator/',
  category: 'calculators',
  keywords: ['bmi calculator', 'body mass index', 'health', 'weight', 'fitness', 'healthy weight', 'bmi india'],
  status: 'new',
  popular: true,
  difficulty: 'beginner',
  priority: 0.9,
  searchIntent: 'action',
  related: ['emi-calculator', 'age-calculator', 'sip-calculator'],
  seoContent: {
    detailedDescription: `BMI Calculator is a privacy-first, browser-native health tool that calculates your Body Mass Index instantly. No data is sent to any server — all calculations happen locally in your browser. Supports both metric (kg/cm) and imperial (lbs/ft) units, includes a visual gauge indicator, and provides context specifically relevant for Indian and Asian body types where WHO recommends lower BMI thresholds.`,
    howTo: [
      'Select your preferred unit system — Metric (kg, cm) or Imperial (lbs, ft/in)',
      'Enter your height using the input fields or slider',
      'Enter your weight using the input field or slider',
      'Your BMI is calculated instantly with a visual gauge',
      'View your category, healthy weight range, and actionable context'
    ],
    faq: [
      {
        question: 'What is BMI?',
        answer: 'Body Mass Index (BMI) is a number calculated from your height and weight. It provides a reliable indicator of body fatness for most people and is used to screen for weight categories that may lead to health problems.'
      },
      {
        question: 'What is a healthy BMI range?',
        answer: 'For the general population, a BMI of 18.5–24.9 is considered normal/healthy. Underweight is below 18.5, overweight is 25–29.9, and obese is 30 or above.'
      },
      {
        question: 'Why are there different thresholds for Indian/Asian body types?',
        answer: 'Research shows that people of South Asian and East Asian descent tend to have higher body fat percentage at lower BMI values. The WHO recommends Asian populations consider overweight at BMI ≥23 and obese at BMI ≥27.5.'
      },
      {
        question: 'Is BMI accurate for everyone?',
        answer: 'BMI is a screening tool, not a diagnostic measure. It may overestimate body fat in athletes and muscular people, and underestimate it in older persons. Always consult a healthcare professional for a full health assessment.'
      },
      {
        question: 'Is my health data stored anywhere?',
        answer: 'No. All calculations happen locally in your browser. Your height, weight, and BMI are never sent to any server or stored outside your device.'
      },
      {
        question: 'What is the formula for BMI?',
        answer: 'Metric: BMI = weight(kg) / height(m)². Imperial: BMI = 703 × weight(lbs) / height(inches)².'
      }
    ]
  }
};
