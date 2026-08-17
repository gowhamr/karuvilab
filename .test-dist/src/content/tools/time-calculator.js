export const timeCalculator = {
    detailedDescription: "Add or subtract time durations with ease. Calculate the exact difference between two times or add hours, minutes, and seconds to a starting time. Perfect for payroll, logbook tracking, and project timing. Runs entirely in your browser.",
    howTo: [
        "Select a calculation mode: 'Time Difference' or 'Add/Subtract Time'.",
        "Enter the start and end times, or the duration values.",
        "The result is calculated instantly in HH:MM:SS format.",
        "Toggle between 12-hour and 24-hour formats if needed.",
    ],
    faq: [
        {
            question: "Does it handle overnight shifts?",
            answer: "Yes. If the end time is earlier than the start time, the tool automatically calculates across the midnight boundary.",
        },
        {
            question: "Can I input just minutes or seconds?",
            answer: "Yes. You can leave hours or minutes at zero to perform calculations on smaller units.",
        },
        {
            question: "Does it track dates?",
            answer: "This tool is focused on time durations within a 24-hour window. For date differences, use our Date Calculator.",
        },
    ],
    useCases: [
        "Calculating total hours worked in a day",
        "Finding the duration of a video or audio file",
        "Planning travel times with layovers",
        "Timing cooking durations with multiple steps",
    ],
    alternatives: ["Timeanddate.com", "Calculator.net Time Calculator", "Online-Stopwatch.com"],
};
