export const stockAverageCalculator = {
    detailedDescription: "When you buy the same stock at different prices (averaging down or up), it's hard to track your true cost basis. This tool calculates the weighted average price of your stock holdings, helping you determine your break-even point and current profit/loss.",
    howTo: [
        "Add multiple 'Buy' entries with quantity and price per share.",
        "The tool calculates the total shares, total cost, and average price.",
        "You can also add a 'Target Average' to see how many more shares you need to buy at a certain price."
    ],
    faq: [
        { question: "What is averaging down?", answer: "Buying more shares of a stock when its price drops to lower your overall average cost per share." },
        { question: "Does this include brokerage fees?", answer: "You can add brokerage fees to the total cost to get a more accurate net average price." }
    ],
    useCases: [
        "Managing a stock portfolio with multiple buy orders",
        "Planning an 'average down' strategy for a falling stock",
        "Calculating the break-even point for a trade"
    ],
    alternatives: ["TradingView", "Zerodha"]
};
