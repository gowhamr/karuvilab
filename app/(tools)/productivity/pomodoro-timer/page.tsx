import PomodoroClientWrapper from "./PomodoroClientWrapper";
import { generateToolMetadata } from "@/src/lib/seo";
import { ToolShell } from "@/components/ui/ToolShell";
import { CATEGORIES } from "@/src/tool-registry";
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import { Metadata } from "next";

const toolId = "pomodoro-timer";

export const metadata: Metadata = generateToolMetadata(toolId);

export default function PomodoroTimerPage() {
  const cat = CATEGORIES.find(c => c.id === 'productivity')!;
  
  return (
    <ToolShell
      toolId={toolId}
      title="Pomodoro Timer"
      description="A simple, customizable timer to help you focus."
      category={cat}
    >
      <PomodoroClientWrapper />

      <LearningHub title="Understanding UI State Machines">
        
        <LearningSection type="architecture" title="Managing Complex States">
          <p>A Pomodoro timer is more complex than a standard stopwatch because it automatically transitions between different phases: <strong>Focus</strong>, <strong>Short Break</strong>, and <strong>Long Break</strong>.</p>
          <p className="mt-2">If you try to manage this with isolated boolean variables (e.g., <code>isFocus = true</code>, <code>isBreak = false</code>, <code>isRunning = true</code>), your code will quickly become a nightmare of conflicting states.</p>
        </LearningSection>
        
        <LearningSection type="api" title="Finite State Machines">
          <p>Professional applications solve this using a <strong>Finite State Machine (FSM)</strong>. In an FSM, the application can only be in exactly one predefined state at any given time.</p>
          <p className="mt-2">For a Pomodoro timer, the states might be: <code>IDLE</code>, <code>FOCUS_RUNNING</code>, <code>FOCUS_PAUSED</code>, <code>BREAK_RUNNING</code>, or <code>BREAK_PAUSED</code>.</p>
          <p className="mt-2">When a timer hits zero, the FSM receives a <code>TICK_COMPLETE</code> event. Based on its current state (e.g., <code>FOCUS_RUNNING</code>) and its Pomodoro count (e.g., 4th session completed), it cleanly transitions to the exact next state (e.g., <code>LONG_BREAK</code>) without checking dozen of messy boolean flags.</p>
        </LearningSection>

        <LearningSection type="general" title="The Pomodoro Technique">
          <p>Developed by Francesco Cirillo, the technique uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks. The method is based on the idea that frequent breaks can improve mental agility.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why is a Finite State Machine (FSM) better than using multiple boolean variables (true/false) to track an app's status?",
                options: [
                  "Because booleans take up too much memory.",
                  "Because an FSM guarantees the app is only in one valid state at a time, preventing impossible combinations (like 'isPaused' and 'isRunning' both being true).",
                  "Because FSMs are built into HTML automatically.",
                  "Because booleans can't be used in React."
                ],
                correctIndex: 1,
                explanation: "FSMs eliminate impossible states by design, making complex UI flows much more robust and easier to debug."
              },
              {
                question: "In the traditional Pomodoro technique, what happens after you complete your 4th focus session?",
                options: [
                  "You stop working for the day.",
                  "You take a standard 5-minute short break.",
                  "You take a longer break, typically 15-30 minutes.",
                  "The timer speeds up by 10%."
                ],
                correctIndex: 2,
                explanation: "The technique prescribes a longer break after 4 consecutive focus sessions to allow for deeper mental recovery."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
