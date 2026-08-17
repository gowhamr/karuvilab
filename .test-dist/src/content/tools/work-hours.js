export const workHours = {
    detailedDescription: "Track your daily work hours, including breaks and overtime, with this simple timesheet utility. It helps you calculate total hours worked between a start and end time, making it easy to fill out weekly logs or calculate pay for hourly work. All data is handled privately in your browser.",
    howTo: [
        "Enter your work start time and end time.",
        "Specify any break duration in minutes (e.g., 30 for lunch).",
        "Enter your hourly rate if you wish to see estimated earnings.",
        "The tool calculates total work hours, decimal hours, and total pay."
    ],
    faq: [
        { question: "Does it handle overnight shifts?", answer: "Yes, it correctly calculates the duration even if the shift ends on the next day after midnight." },
        { question: "What are 'decimal hours'?", answer: "Decimal hours convert minutes into a fraction of an hour (e.g., 8 hours 30 mins = 8.5 hours), which is used by most payroll systems." }
    ],
    useCases: [
        "Filling out weekly timesheets for work",
        "Calculating pay for freelance or hourly gigs",
        "Tracking study or project hours",
        "Verifying payroll accuracy"
    ],
    alternatives: ["Clockify", "Toggl", "Harvest"]
};
