import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import ChartGeneratorClientWrapper from "./ChartGeneratorClientWrapper";

const toolId = "chart-generator";
const category = CATEGORIES.find(c => c.id === "productivity")!;

export const metadata: Metadata = generateToolMetadata(toolId);

export default function ChartGeneratorPage() {
  return (
    <ToolShell
      title="Chart & Graph Generator"
      description="Turn your data into beautiful visualizations. Perfect for reports, presentations, and quick insights."
      category={category}
      toolId={toolId}
    >
      <ChartGeneratorClientWrapper />

      <LearningHub title="Understanding Data Visualization">
        
        <LearningSection type="architecture" title="Choosing the Right Chart">
          <p>Data visualization is the graphic representation of information. Creating a beautiful chart is useless if it conveys the wrong message. The most critical step is selecting the correct chart type for your data.</p>
        </LearningSection>
        
        <LearningSection type="api" title="Bar vs. Line vs. Pie">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Bar Charts:</strong> Best for comparing discrete, categorical data across different groups. (e.g., Sales by Region). The human eye is excellent at comparing the lengths of straight bars.</li>
            <li><strong>Line Charts:</strong> Best for displaying continuous data over a period of time. (e.g., Stock price over 12 months). They immediately highlight trends, spikes, and drops.</li>
            <li><strong>Pie Charts:</strong> Best for showing proportional parts of a whole (must sum to 100%). (e.g., Market share percentages). <em>Warning:</em> Humans are historically terrible at estimating areas and angles, making pie charts with many thin slices extremely hard to read.</li>
          </ul>
        </LearningSection>

        <LearningSection type="failures" title="The Axis Manipulation Trap">
          <p>One of the most common ways to deliberately mislead people with data is by manipulating the Y-axis of a Bar or Line chart.</p>
          <p className="mt-2">If a chart does not start its Y-axis at zero, a tiny 2% difference between two data points can be visually exaggerated to look like a massive 500% difference, because the baseline has been visually truncated. Always check the axis scale.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Which type of chart is best suited for showing the continuous trend of a company's revenue over the last 10 years?",
                options: [
                  "Pie Chart",
                  "Line Chart",
                  "Scatter Plot",
                  "Doughnut Chart"
                ],
                correctIndex: 1,
                explanation: "Line charts are designed specifically to show the flow of continuous data over time, highlighting trends instantly."
              },
              {
                question: "Why do data scientists often dislike Pie charts when comparing many small data points?",
                options: [
                  "Because they are circular.",
                  "Because humans are bad at accurately comparing the area and angles of small slices.",
                  "Because they require too much color.",
                  "Because they can't be printed."
                ],
                correctIndex: 1,
                explanation: "The human eye can compare the straight length of a bar much more accurately than the radial angle of a pie slice."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
