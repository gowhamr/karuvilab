export const chartGeneratorContent = {
    detailedDescription: `
<p>The KaruviLab Chart & Graph Generator is a professional-grade visualization utility designed to transform raw data into beautiful, production-ready charts instantly. Whether you need a quick bar chart for a presentation, a pie chart for data analysis, or a line graph to track trends, this tool offers a fast and secure solution directly in your browser.</p>

<p>We prioritize both aesthetics and privacy. Unlike cloud-based visualization platforms that track your data, KaruviLab's generator operates on a 100% local-first architecture. Your data points, labels, and resulting graphics are processed entirely within your browser's sandbox. This makes it an ideal tool for visualizing sensitive business metrics, personal finances, or research data without any risk of server-side leaks.</p>

<p>Our generator features a live-preview engine, high-resolution export options (PNG and SVG), and a modern design system that ensures your charts look clean and readable across all devices. With support for multiple chart types and customizable color palettes, you can create professional visualizations in seconds.</p>
`,
    howTo: [
        "<strong>Input Your Data:</strong> Use the sidebar to add data points with labels and numerical values.",
        "<strong>Choose Your Chart Type:</strong> Toggle between Bar, Pie, Doughnut, and Line charts using the selector at the top.",
        "<strong>Customize Styles:</strong> Select from pre-defined professional color palettes or assign custom colors to specific data points.",
        "<strong>Export and Share:</strong> Download your finished visualization as a high-resolution PNG for documents or a perfectly scalable SVG for web and design projects.",
    ],
    faq: [
        {
            question: "Is my data uploaded to any server?",
            answer: "No. KaruviLab follows a strict zero-upload policy. All data processing and chart rendering occur locally on your device. Your data never touches the internet.",
        },
        {
            question: "Can I export charts in high resolution?",
            answer: "Yes. Our tool exports charts as crisp, high-resolution PNG files or as infinitely scalable SVG vectors, suitable for both digital presentations and high-quality print documents.",
        },
        {
            question: "Which chart types are supported?",
            answer: "We currently support Bar Charts, Pie Charts, Doughnut Charts, and Line Graphs. We are constantly expanding our library of visualization types based on user feedback.",
        },
        {
            question: "Does it work on mobile devices?",
            answer: "Yes, the Chart Generator is fully responsive. You can input data and generate graphics directly on your smartphone or tablet.",
        },
        {
            question: "Can I use this tool offline?",
            answer: "Absolutely. Once the KaruviLab application is loaded in your browser, the generator functions 100% offline via our Service Worker architecture.",
        },
    ],
    useCases: [
        "Visualizing monthly budget breakdowns and expense categories.",
        "Creating clear data representations for academic or business reports.",
        "Generating quick trend lines for project milestones and progress tracking.",
        "Designing social-media-ready data snippets with a clean, modern aesthetic.",
    ],
    examples: [
        {
            label: "Market Share Breakdown",
            input: "Brand A: 40, Brand B: 30, Brand C: 30",
            output: "[Professional Pie Chart Visualization]",
            description: "A classic representation of proportional data using our Pie or Doughnut modes."
        },
        {
            label: "Quarterly Growth Trend",
            input: "Q1: 150, Q2: 210, Q3: 280, Q4: 400",
            output: "[Clean Line Graph with Smooth Curves]",
            description: "Visualizing growth or changes over time using the Line Chart mode."
        }
    ],
    alternatives: ["Google Charts", "Canva Chart Maker", "Chart.js (Library)", "Microsoft Excel"],
};
