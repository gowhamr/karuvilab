export const INFLATION_SECTOR_PRESETS = [
    {
        id: 'general',
        name: 'General CPI',
        rate: 6,
        description: 'Standard Consumer Price Index basket (food, transport, housing, energy)',
        category: 'Headline Index',
    },
    {
        id: 'lifestyle',
        name: 'Lifestyle',
        rate: 8,
        description: 'Discretionary spending, dining out, electronics, leisure & travel',
        category: 'Discretionary',
    },
    {
        id: 'education',
        name: 'Education',
        rate: 10,
        description: 'School tuition, higher education fees, academic books, coaching',
        category: 'Essential Services',
    },
    {
        id: 'healthcare',
        name: 'Healthcare',
        rate: 12,
        description: 'Hospitalization, specialized medical treatments, health insurance',
        category: 'Critical Care',
    },
];
export function formatCurrency(val, locale = 'en-IN', currency = 'INR') {
    if (!isFinite(val))
        return '₹0';
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    }).format(Math.round(val));
}
export function formatPercent(val, maxDecimals = 1) {
    if (!isFinite(val))
        return '0%';
    return `${Number(val.toFixed(maxDecimals)).toLocaleString('en-US', {
        maximumFractionDigits: maxDecimals,
    })}%`;
}
export function formatNumber(val, maxDecimals = 2) {
    if (!isFinite(val))
        return '0';
    return Number(val.toFixed(maxDecimals)).toLocaleString('en-US', {
        maximumFractionDigits: maxDecimals,
    });
}
/**
 * Calculates future cost of goods after compound inflation:
 * FV = PV * (1 + r/100)^t
 */
export function calculateFutureCost(amount, rate, years) {
    if (years <= 0 || amount <= 0)
        return amount;
    return amount * Math.pow(1 + rate / 100, years);
}
/**
 * Calculates future purchasing power of a fixed nominal sum:
 * PV = FV / (1 + r/100)^t
 */
export function calculatePurchasingPower(amount, rate, years) {
    if (years <= 0 || amount <= 0)
        return amount;
    const factor = Math.pow(1 + rate / 100, years);
    return factor > 0 ? amount / factor : amount;
}
/**
 * Calculates the loss of purchasing power percentage:
 * Loss (%) = (1 - 1 / (1 + r/100)^t) * 100
 */
export function calculatePurchasingPowerLoss(rate, years) {
    if (years <= 0 || rate <= 0)
        return 0;
    const factor = Math.pow(1 + rate / 100, years);
    return factor > 0 ? (1 - 1 / factor) * 100 : 0;
}
/**
 * Calculates purchasing power halving time using the Rule of 70:
 * Halving Time = 70 / r years
 */
export function calculateHalvingTime(rate) {
    if (rate <= 0)
        return 0;
    return Math.round((70 / rate) * 10) / 10;
}
/**
 * Pure Deterministic Inflation Engine
 */
export function calculateDeterministicInflation(input) {
    const { amount, rate, years } = input;
    if (isNaN(amount) || amount <= 0) {
        return {
            success: false,
            error: {
                code: 'INVALID_AMOUNT',
                message: 'Initial amount must be greater than 0.',
            },
        };
    }
    if (isNaN(rate) || rate < 0) {
        return {
            success: false,
            error: {
                code: 'INVALID_RATE',
                message: 'Annual inflation rate cannot be negative.',
            },
        };
    }
    if (isNaN(years) || years <= 0) {
        return {
            success: false,
            error: {
                code: 'INVALID_YEARS',
                message: 'Time period must be at least 1 year.',
            },
        };
    }
    if (amount > 1000000000 || rate > 100 || years > 100) {
        return {
            success: false,
            error: {
                code: 'OUT_OF_BOUNDS_INPUT',
                message: 'Inputs exceed supported maximum bounds (Amount ≤ ₹100 Cr, Rate ≤ 100%, Duration ≤ 100 years).',
            },
        };
    }
    const r = rate / 100;
    const inflationMultiplier = Math.pow(1 + r, years);
    const futureCost = amount * inflationMultiplier;
    const futurePurchasingPower = inflationMultiplier > 0 ? amount / inflationMultiplier : amount;
    const purchasingPowerLossPercent = inflationMultiplier > 0 ? (1 - 1 / inflationMultiplier) * 100 : 0;
    const halvingYears = calculateHalvingTime(rate);
    const projections = [];
    for (let y = 1; y <= years; y++) {
        const yearMultiplier = Math.pow(1 + r, y);
        const yearCost = amount * yearMultiplier;
        const yearPower = yearMultiplier > 0 ? amount / yearMultiplier : amount;
        const yearLoss = yearMultiplier > 0 ? (1 - 1 / yearMultiplier) * 100 : 0;
        projections.push({
            year: y,
            futureCost: Math.round(yearCost * 100) / 100,
            purchasingPower: Math.round(yearPower * 100) / 100,
            purchasingPowerLossPercent: Math.round(yearLoss * 100) / 100,
            cumulativeInflationMultiplier: Math.round(yearMultiplier * 10000) / 10000,
        });
    }
    const formula = `FV = ${formatCurrency(amount)} × (1 + ${rate}%)^${years} = ${formatCurrency(futureCost)}`;
    return {
        success: true,
        data: {
            amount,
            rate,
            years,
            futureCost: Math.round(futureCost * 100) / 100,
            futurePurchasingPower: Math.round(futurePurchasingPower * 100) / 100,
            purchasingPowerLossPercent: Math.round(purchasingPowerLossPercent * 100) / 100,
            halvingYears,
            inflationMultiplier: Math.round(inflationMultiplier * 10000) / 10000,
            formula,
            formattedAmount: formatCurrency(amount),
            formattedFutureCost: formatCurrency(futureCost),
            formattedPurchasingPower: formatCurrency(futurePurchasingPower),
            formattedLossPercent: formatPercent(purchasingPowerLossPercent, 1),
            formattedHalvingYears: halvingYears > 0 ? `~${halvingYears} yrs` : 'N/A',
            projections,
        },
    };
}
