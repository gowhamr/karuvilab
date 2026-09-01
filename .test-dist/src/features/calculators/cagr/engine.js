/**
 * Pure Deterministic Compound Annual Growth Rate (CAGR) Engine.
 * Formula: [(Ending Value / Beginning Value) ^ (1 / Years)] - 1
 */
export function calculateCagr(input) {
    const { initialValue, finalValue, years } = input;
    if (isNaN(initialValue) || isNaN(finalValue) || isNaN(years)) {
        throw new Error('Inputs must be valid numbers.');
    }
    if (initialValue <= 0 || finalValue <= 0 || years <= 0) {
        return { cagr: 0, absoluteReturn: 0 };
    }
    const cagr = (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100;
    const absoluteReturn = ((finalValue - initialValue) / initialValue) * 100;
    return {
        cagr: Math.round(cagr * 100) / 100,
        absoluteReturn: Math.round(absoluteReturn * 100) / 100
    };
}
