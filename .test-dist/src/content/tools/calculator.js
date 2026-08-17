export const calculator = {
    detailedDescription: `
    <p>The <strong>Calculator</strong> provides a fully integrated mathematical workspace that merges standard and scientific functionalities into one premium interface. It runs completely locally with <strong>Zero-Server-Upload</strong> privacy.</p>
    <p>It supports instant evaluation, robust offline history management, configurable precision settings, responsive design for desktop and mobile devices, and gesture-driven actions.</p>
  `,
    howTo: [
        "Enter an expression using the on-screen keypad or your physical keyboard.",
        "On mobile, rotate your device to landscape or toggle the sidebar to access scientific functions.",
        "Access your calculation history from the panel to reuse previous results.",
        "Use memory keys (MC, MR, M+, M-) for running subtotals.",
        "Change settings like angle unit (Deg/Rad) or precision from the options menu."
    ],
    examples: [
        {
            label: "Basic Arithmetic",
            input: "2 + 2 * 3",
            output: "8",
            description: "respects order of operations"
        },
        {
            label: "Trigonometry",
            input: "sin(90)",
            output: "1",
            description: "in degrees"
        },
        {
            label: "Complex Expressions",
            input: "sqrt(16) + 3^2 - log(100)",
            output: "11",
            description: "combines functions and powers"
        }
    ],
    faq: [
        {
            question: "Is this calculator offline?",
            answer: "Yes, it works entirely in your browser without any network connection."
        },
        {
            question: "How do I see scientific functions on mobile?",
            answer: "Rotate your device to landscape, or tap the mode toggle to reveal the scientific keypad."
        },
        {
            question: "Are my calculations saved?",
            answer: "Yes, your calculation history is saved locally to your device and never uploaded anywhere."
        }
    ]
};
