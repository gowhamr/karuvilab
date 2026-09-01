export function formatCurrency(val, locale = 'en-IN', currency = 'INR') {
    if (!isFinite(val))
        return '₹0';
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    }).format(Math.round(val));
}
export function formatNumber(val, maxDecimals = 2) {
    if (!isFinite(val))
        return '0';
    return Number(val.toFixed(maxDecimals)).toLocaleString('en-US', {
        maximumFractionDigits: maxDecimals,
    });
}
/**
 * Calculates Effective Annual Percentage Yield (APY) for a given nominal rate and compounding frequency.
 * APY = ((1 + r / (100 * f))^f - 1) * 100
 */
export function calculateEffectiveApy(annualRatePercent, compoundingFrequency = 4) {
    if (compoundingFrequency <= 0 || annualRatePercent <= 0) {
        return Math.max(0, annualRatePercent);
    }
    const i = annualRatePercent / (100 * compoundingFrequency);
    const apy = Math.pow(1 + i, compoundingFrequency) - 1;
    return Number((apy * 100).toFixed(4));
}
/**
 * Calculates Recurring Deposit (RD) Maturity Value.
 * For standard Indian quarterly compounding (f = 4):
 * M = P * ((1 + i)^(n/3) - 1) / (1 - (1 + i)^(-1/3)) where i = r / 400 and n = months.
 *
 * For general compounding frequency f:
 * i = r / (100 * f), k = f / 12
 * M = P * ((1 + i)^(n * k) - 1) / (1 - (1 + i)^(-k))
 */
export function calculateRdMaturityValue(monthlyDeposit, annualRatePercent, totalMonths, compoundingFrequency = 4) {
    if (totalMonths <= 0 || monthlyDeposit <= 0)
        return 0;
    if (annualRatePercent === 0)
        return monthlyDeposit * totalMonths;
    const f = compoundingFrequency > 0 ? compoundingFrequency : 4;
    const i = annualRatePercent / (100 * f);
    const k = f / 12;
    const growth = Math.pow(1 + i, totalMonths * k);
    const discountFactor = 1 - Math.pow(1 + i, -k);
    if (discountFactor === 0)
        return monthlyDeposit * totalMonths;
    const maturity = monthlyDeposit * ((growth - 1) / discountFactor);
    return Math.round(maturity * 100) / 100;
}
/**
 * Pure Deterministic RD Engine with senior citizen rate boost,
 * TDS modeling, effective APY calculation, and yearly projections.
 */
export function calculateDeterministicRd(input) {
    const { monthlyDeposit, annualInterestRate, tenureYears, tenureMonths, compoundingFrequency = 4, isSeniorCitizen = false, seniorCitizenRateBoost = 0.5, applyTds = false, tdsRate = 10, customTdsThreshold, } = input;
    if (isNaN(monthlyDeposit) || monthlyDeposit <= 0) {
        return {
            success: false,
            error: {
                code: 'INVALID_MONTHLY_DEPOSIT',
                message: 'Monthly deposit must be greater than zero (minimum ₹100).',
            },
        };
    }
    if (isNaN(annualInterestRate) || annualInterestRate < 0) {
        return {
            success: false,
            error: {
                code: 'INVALID_INTEREST_RATE',
                message: 'Interest rate cannot be negative.',
            },
        };
    }
    const calculatedMonths = tenureMonths !== undefined && !isNaN(tenureMonths) && tenureMonths > 0
        ? Math.round(tenureMonths)
        : Math.round((isNaN(tenureYears) ? 0 : tenureYears) * 12);
    if (calculatedMonths <= 0) {
        return {
            success: false,
            error: {
                code: 'INVALID_TENURE',
                message: 'Deposit tenure must be at least 1 month (or 1 year).',
            },
        };
    }
    const validFrequencies = [1, 2, 4, 12];
    const freq = (validFrequencies.includes(compoundingFrequency)
        ? compoundingFrequency
        : 4);
    if (!validFrequencies.includes(compoundingFrequency)) {
        return {
            success: false,
            error: {
                code: 'INVALID_COMPOUNDING_FREQUENCY',
                message: 'Compounding frequency must be 1 (Annual), 2 (Half-yearly), 4 (Quarterly), or 12 (Monthly).',
            },
        };
    }
    if (applyTds && (isNaN(tdsRate) || tdsRate < 0 || tdsRate > 100)) {
        return {
            success: false,
            error: {
                code: 'INVALID_TDS_RATE',
                message: 'TDS rate must be between 0% and 100%.',
            },
        };
    }
    if (monthlyDeposit > 100000000 ||
        annualInterestRate > 50 ||
        calculatedMonths > 360) {
        return {
            success: false,
            error: {
                code: 'OUT_OF_BOUNDS_INPUT',
                message: 'Inputs exceed standard maximum bounds (Monthly Deposit ≤ ₹10 Cr, Rate ≤ 50%, Tenure ≤ 30 years).',
            },
        };
    }
    const effectiveBoost = isSeniorCitizen ? seniorCitizenRateBoost : 0;
    const effectiveInterestRate = Math.round((annualInterestRate + effectiveBoost) * 1000) / 1000;
    const resolvedYears = Math.round((calculatedMonths / 12) * 100) / 100;
    const maturityAmount = calculateRdMaturityValue(monthlyDeposit, effectiveInterestRate, calculatedMonths, freq);
    const totalInvested = Math.round(monthlyDeposit * calculatedMonths * 100) / 100;
    const totalInterest = Math.max(0, Math.round((maturityAmount - totalInvested) * 100) / 100);
    const effectiveApy = calculateEffectiveApy(effectiveInterestRate, freq);
    // TDS Modeling under Section 194A / Section 80TTB
    const defaultTdsThreshold = isSeniorCitizen ? 50000 : 40000;
    const tdsThreshold = customTdsThreshold !== undefined && !isNaN(customTdsThreshold) && customTdsThreshold > 0
        ? customTdsThreshold
        : defaultTdsThreshold;
    const isTdsApplicable = applyTds && totalInterest > tdsThreshold;
    const tdsAmount = isTdsApplicable
        ? Math.round(totalInterest * (tdsRate / 100) * 100) / 100
        : 0;
    const netTotalInterest = Math.max(0, Math.round((totalInterest - tdsAmount) * 100) / 100);
    const netMaturityAmount = Math.round((totalInvested + netTotalInterest) * 100) / 100;
    // Year-by-year trajectory projection schedule
    const totalYears = Math.ceil(calculatedMonths / 12);
    const projections = [];
    let previousMaturity = 0;
    let previousInvested = 0;
    for (let year = 1; year <= totalYears; year++) {
        const currentMonths = Math.min(year * 12, calculatedMonths);
        const monthsInThisYear = currentMonths - previousInvested / monthlyDeposit;
        const annualDeposit = Math.round(monthlyDeposit * monthsInThisYear * 100) / 100;
        const cumulativeInvested = Math.round(monthlyDeposit * currentMonths * 100) / 100;
        const currentMaturityValue = calculateRdMaturityValue(monthlyDeposit, effectiveInterestRate, currentMonths, freq);
        const cumulativeInterest = Math.max(0, Math.round((currentMaturityValue - cumulativeInvested) * 100) / 100);
        const interestEarnedThisYear = Math.max(0, Math.round((currentMaturityValue - previousMaturity - annualDeposit) * 100) / 100);
        const yearTds = applyTds && cumulativeInterest > tdsThreshold
            ? Math.round(cumulativeInterest * (tdsRate / 100) * 100) / 100
            : 0;
        const netMaturityValue = Math.round((currentMaturityValue - yearTds) * 100) / 100;
        projections.push({
            year,
            monthsCompleted: currentMonths,
            openingBalance: previousMaturity,
            annualDeposit,
            cumulativeInvested,
            interestEarnedThisYear,
            cumulativeInterest,
            maturityValue: currentMaturityValue,
            estimatedTds: yearTds,
            netMaturityValue,
        });
        previousMaturity = currentMaturityValue;
        previousInvested = cumulativeInvested;
    }
    const formula = freq === 4
        ? `M = P × [ (1 + i)^(n/3) - 1 ] / [ 1 - (1 + i)^(-1/3) ] where i = ${effectiveInterestRate}%/400, n = ${calculatedMonths} months`
        : `M = P × [ (1 + i)^(n × ${freq}/12) - 1 ] / [ 1 - (1 + i)^(-${freq}/12) ] where i = ${effectiveInterestRate}%/(${freq} × 100)`;
    return {
        success: true,
        data: {
            monthlyDeposit,
            baseInterestRate: annualInterestRate,
            seniorCitizenRateBoost: effectiveBoost,
            effectiveInterestRate,
            isSeniorCitizen,
            tenureYears: resolvedYears,
            totalMonths: calculatedMonths,
            compoundingFrequency: freq,
            effectiveApy,
            totalInvested,
            totalInterest,
            maturityAmount,
            isTdsApplicable,
            tdsThreshold,
            tdsAmount,
            netTotalInterest,
            netMaturityAmount,
            formula,
            formattedMonthlyDeposit: formatCurrency(monthlyDeposit),
            formattedTotalInvested: formatCurrency(totalInvested),
            formattedTotalInterest: formatCurrency(totalInterest),
            formattedMaturityAmount: formatCurrency(maturityAmount),
            formattedEffectiveApy: `${formatNumber(effectiveApy, 2)}%`,
            formattedTdsAmount: formatCurrency(tdsAmount),
            formattedNetMaturityAmount: formatCurrency(netMaturityAmount),
            projections,
        },
    };
}
