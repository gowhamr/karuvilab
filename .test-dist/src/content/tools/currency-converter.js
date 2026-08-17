export const currencyConverter = {
    detailedDescription: `
<p>The Currency Converter is a real-time financial utility that allows you to calculate exchange values between global currencies instantly. Whether you are a traveler planning a budget, an e-commerce business owner seting international prices, or a freelancer receiving payments from overseas, this tool provides the accurate data you need for informed decision-making.</p>

<p>Our converter supports a vast array of global currencies, including major ones like USD, EUR, GBP, and JPY, as well as dozens of others. We prioritize data freshness while maintaining KaruviLab's local-first philosophy. Once the latest rates are fetched, all calculations happen instantly on your device. This means you can keep the tool open and perform multiple conversions without constantly refreshing or using extra bandwidth.</p>

<p>Privacy is also handled with care. While the tool requires a brief connection to fetch current exchange rates, your specific conversion amounts and currency pairings remain private on your machine. You can even use the tool offline if you have previously cached the rates, making it an essential companion for international travel.</p>
`,
    howTo: [
        "<strong>Select Base:</strong> Choose the currency you currently have from the first dropdown menu.",
        "<strong>Select Target:</strong> Choose the currency you want to convert into from the second dropdown.",
        "<strong>Enter Amount:</strong> Type the value you wish to convert into the input field.",
        "<strong>View Result:</strong> See the converted value instantly based on the latest exchange rates.",
        "<strong>Swap:</strong> Use the 'Swap' button to quickly reverse the conversion direction.",
    ],
    faq: [
        { question: "How often are rates updated?", answer: "Our rates are typically refreshed once every 24 hours to ensure a balance between accuracy and performance." },
        { question: "Does it work for crypto?", answer: "Currently, we focus on fiat (government-backed) currencies, but crypto support may be added in the future." },
        { question: "Can I use it offline?", answer: "Yes, if you have recently visited the tool, it will use the last known cached rates when you are offline." },
        { question: "Is there a limit on amounts?", answer: "No, you can convert any numerical amount, from cents to billions." },
        { question: "Is it free?", answer: "Yes, the currency converter is 100% free with no hidden fees or markups." }
    ],
    examples: [
        { label: "Travel Budget", input: "100 USD to EUR", output: "~92.50 EUR", description: "Quickly estimating local currency for an upcoming trip." },
        { label: "Freelance Pay", input: "50000 JPY to USD", output: "~335 USD", description: "Converting international project payments into your local currency." },
        { label: "Shopping", input: "10 GBP to INR", output: "~1050 INR", description: "Verifying the cost of an international online purchase." }
    ]
};
