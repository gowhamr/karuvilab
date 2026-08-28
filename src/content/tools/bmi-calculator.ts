import { ToolContent } from '../../registry/types';

export const bmiCalculator: ToolContent = {
  detailedDescription: `
<p>The KaruviLab Body Mass Index (BMI) Calculator is a privacy-first, client-side clinical assessment tool that evaluates body mass relative to stature. Operating 100% locally in your browser with zero telemetry and zero server uploads, it calculates standard Body Mass Index (Quetelet index), BMI Prime, Ponderal Index, healthy weight boundaries, and demographic-specific thresholds (such as WHO Asian population guidelines).</p>

<p>Body Mass Index is defined as body mass divided by the square of body height ($\text{BMI} = \text{weight (kg)} / \text{height (m)}^2$). While widely used in epidemiological screenings, KaruviLab enriches raw BMI with supplementary metrics:</p>
<ul>
  <li><strong>BMI Prime:</strong> The ratio of actual BMI to the upper limit of normal BMI (25.0). A BMI Prime $< 0.74$ indicates underweight, $0.74 – 1.00$ indicates normal range, and $> 1.00$ indicates overweight.</li>
  <li><strong>Ponderal Index (Corpulence Index):</strong> Evaluates mass divided by height cubed ($\text{kg} / \text{m}^3$), providing a more proportional indicator for exceptionally tall or short individuals.</li>
  <li><strong>Target Weight Adjustment:</strong> Computes the precise weight difference required to enter the standard healthy BMI zone ($18.5 – 24.9$).</li>
  <li><strong>Asian Population Cutoffs:</strong> Due to differences in body fat distribution and cardiovascular risk profiles at lower BMI values, the World Health Organization recommends adjusted thresholds for Asian populations (overweight cutoff at $\ge 23.0$, obesity at $\ge 27.5$).</li>
</ul>

<p>All measurements and calculations are executed securely within your device's browser memory. KaruviLab never collects, logs, or transmits personal health, weight, or biometric data.</p>
`,
  howTo: [
    "<strong>Select Unit System:</strong> Toggle between Metric (kg / cm) and Imperial (lbs / ft + in).",
    "<strong>Enter Height & Weight:</strong> Use the precision sliders or text inputs to specify your height and weight.",
    "<strong>Review Classification:</strong> Inspect your computed BMI score, color-coded WHO category, and visual gauge.",
    "<strong>Analyze Target Weight & Prime Index:</strong> Review the healthy weight range ($18.5 – 24.9$ BMI) and recommended weight adjustment.",
  ],
  faq: [
    {
      question: "What is the formula for calculating BMI?",
      answer: "In the metric system: BMI = weight (kg) / [height (m)]². In the imperial system: BMI = 703 × weight (lbs) / [height (inches)]².",
    },
    {
      question: "What is a healthy BMI range?",
      answer: "According to the World Health Organization (WHO), a healthy adult BMI ranges from 18.5 to 24.9 kg/m².",
    },
    {
      question: "Why are Asian BMI thresholds different?",
      answer: "Research published by the WHO shows that Asian populations often exhibit a higher percentage of body fat and higher risk of diabetes and cardiovascular disease at lower BMI levels. Consequently, the overweight threshold is set at 23.0 and obesity at 27.5.",
    },
    {
      question: "What is BMI Prime?",
      answer: "BMI Prime is the ratio of an individual's BMI to the upper normal threshold (25.0). A value between 0.74 and 1.00 represents a normal weight, making it an intuitive multiplier of healthy upper bounds.",
    },
    {
      question: "Is BMI an accurate measure for athletes and bodybuilders?",
      answer: "BMI does not distinguish between muscle mass and adipose (fat) tissue. High-muscle athletes may register as 'overweight' despite having low body fat percentages.",
    },
  ],
  useCases: [
    "Tracking personal fitness, body transformation, and weight management goals.",
    "Initial clinical health screening and dietary assessment.",
    "Comparing standard WHO criteria with Asian demographic health risk thresholds.",
    "Calculating realistic target weight milestones for healthy nutrition plans.",
  ],
  examples: [
    {
      input: "Height: 170 cm | Weight: 70 kg",
      output: "BMI: 24.2 (Normal Weight) | Healthy Range: 53.5 – 72.0 kg",
      description: "Standard metric calculation in healthy normal range."
    },
    {
      input: "Height: 5 ft 10 in | Weight: 190 lbs",
      output: "BMI: 27.3 (Overweight) | Weight to lose: ~16.4 lbs",
      description: "Imperial calculation indicating overweight classification."
    },
    {
      input: "Height: 170 cm | Weight: 68 kg",
      output: "BMI: 23.5 (WHO Standard: Normal, Asian Guidelines: Overweight)",
      description: "Demographic risk divergence example."
    }
  ],
  commonErrors: [
    {
      error: "Entering Height in Meters instead of Centimeters",
      fix: "Ensure height is entered in centimeters (e.g. 175 cm, not 1.75) when using metric mode.",
    },
    {
      error: "Extreme Out-of-Bounds Values",
      fix: "Verify height is between 50 cm and 300 cm, and weight is between 10 kg and 600 kg.",
    },
  ],
  alternatives: ["CDC Adult BMI Calculator", "NIH National Heart, Lung, and Blood Institute", "Calculator.net BMI"],
};
