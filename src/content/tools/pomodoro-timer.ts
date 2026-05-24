import { ToolContent } from '../../registry/types';

export const pomodoroTimer: ToolContent = {
  detailedDescription: `
    <p>The Pomodoro Technique is a world-renowned time management method developed by Francesco Cirillo in the late 1980s. It uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks. Each interval is known as a <em>pomodoro</em>, from the Italian word for tomato, after the tomato-shaped kitchen timer Cirillo used as a university student.</p>
    
    <p>Our Pomodoro Timer is built on KaruviLab's local-first architecture, ensuring your productivity data stays strictly on your device. By alternating focused work sessions with structured breaks, you can maintain high levels of mental agility and prevent burnout. This tool allows you to fully customize your intervals, toggle notification alerts, and track your completed sessions in real-time.</p>

    <p>Whether you are a developer diving into deep work, a student preparing for exams, or a creative professional managing multiple projects, the KaruviLab Pomodoro Timer provides the perfect balance of simplicity and functionality to help you conquer your to-do list.</p>
  `,
  howTo: [
    "<strong>Choose Your Mode:</strong> Select 'Focus' for deep work or 'Break' for relaxation.",
    "<strong>Start the Timer:</strong> Click the large Play button to begin your session.",
    "<strong>Stay Focused:</strong> Work until the timer reaches zero and the alert sounds.",
    "<strong>Take a Break:</strong> Use the break interval to step away from your screen and recharge.",
    "<strong>Customize:</strong> Use the Settings icon to adjust the duration of your focus and break periods.",
  ],
  faq: [
    {
      question: "Why 25 minutes?",
      answer: "25 minutes is considered the 'sweet spot' for maintaining peak concentration without mental fatigue. However, you can adjust this in Settings to find what works best for you.",
    },
    {
      question: "What is a 'Long Break'?",
      answer: "Traditionally, after completing four focus sessions (pomodoros), you should take a longer break (15-30 minutes) to allow your brain to fully reset.",
    },
    {
      question: "Do I need to keep the tab open?",
      answer: "Yes, for the timer to function reliably, the tab should remain open. However, it is designed to be lightweight and will continue running in the background.",
    },
    {
      question: "Is my data stored?",
      answer: "None of your timing data is uploaded. Your settings and session history are stored locally in your browser using IndexedDB/LocalStorage.",
    },
    {
      question: "Can I use it offline?",
      answer: "Absolutely. Once loaded, the KaruviLab Pomodoro Timer functions 100% offline, making it perfect for distraction-free environments.",
    },
  ],
  useCases: [
    "Software development and deep-coding sessions.",
    "Intensive studying and academic research.",
    "Writing blog posts, documentation, or creative content.",
    "Managing household chores or repetitive daily tasks.",
    "Practicing mindful focus for ADHD management.",
  ],
  examples: [
    {
      label: "Classic Pomodoro",
      input: "Focus: 25m | Short Break: 5m",
      output: "4 Cycles then 15m Long Break",
      description: "The standard rhythm for most productivity enthusiasts."
    },
    {
      label: "Extended Deep Work",
      input: "Focus: 50m | Break: 10m",
      output: "2 Cycles then 20m Long Break",
      description: "Ideal for complex tasks like architecture design or debugging."
    }
  ],
  alternatives: ["Forest app", "Focus To-Do", "Pomofocus.io", "TomatoTimer"],
};
