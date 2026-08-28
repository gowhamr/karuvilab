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
 * Calculates the Effective Annual Yield (APY / EAR):
 * APY = (1 + r / (100 * n))^n - 1
 */
export function calculateEffectiveAnnualYield(annualRatePercent, compoundingFrequency) {
    if (isNaN(annualRatePercent) || annualRatePercent <= 0 || compoundingFrequency <= 0) {
        return 0;
    }
    const r = annualRatePercent / 100;
    const apy = Math.pow(1 + r / compoundingFrequency, compoundingFrequency) - 1;
    return Math.round(apy * 10000) / 100; // In percent with 2 decimals
}
/**
 * Calculates Cumulative FD Maturity Value:
 * A = P * (1 + r / (100 * n))^(n * t)
 */
export function calculateFdMaturity(principal, annualRatePercent, tenureYears, compoundingFrequency) {
    if (isNaN(principal) ||
        principal <= 0 ||
        isNaN(annualRatePercent) ||
        annualRatePercent < 0 ||
        isNaN(tenureYears) ||
        tenureYears <= 0 ||
        isNaN(compoundingFrequency) ||
        compoundingFrequency <= 0) {
        return 0;
    }
    if (annualRatePercent === 0)
        return principal;
    const r = annualRatePercent / 100;
    const n = compoundingFrequency;
    const t = tenureYears;
    const maturityValue = principal * Math.pow(1 + r / n, n * t);
    return Math.round(maturityValue * 100) / 100;
}
/**
 * Calculates Non-Cumulative Periodic Interest Payout:
 * Payout = P * (r / (100 * m))
 */
export function calculatePeriodicPayout(principal, annualRatePercent, payoutFrequency) {
    if (isNaN(principal) ||
        principal <= 0 ||
        isNaN(annualRatePercent) ||
        annualRatePercent <= 0 ||
        isNaN(payoutFrequency) ||
        payoutFrequency <= 0) {
        return 0;
    }
    const r = annualRatePercent / 100;
    const payout = principal * (r / payoutFrequency);
    return Math.round(payout * 100) / 100;
}
/**
 * Pure Deterministic FD Calculation Engine.
 */
export function calculateDeterministicFd(input) {
    const { principal, annualRate, tenure, tenureUnit = 'years', compoundingFrequency = 4, fdType = 'cumulative', payoutFrequency = 4, isSeniorCitizen = false, seniorCitizenBoost = 0.50, applyTds = true, tdsRate = 10, customTdsThreshold, } = input;
    if (isNaN(principal) || principal <= 0) {
        return {
            success: false,
            error: {
                code: 'INVALID_PRINCIPAL',
                message: 'Principal amount must be greater than zero.',
            },
        };
    }
    if (isNaN(annualRate) || annualRate < 0) {
        return {
            success: false,
            error: {
                code: 'INVALID_RATE',
                message: 'Interest rate cannot be negative.',
            },
        };
    }
    if (isNaN(tenure) || tenure <= 0) {
        return {
            success: false,
            error: {
                code: 'INVALID_TENURE',
                message: 'Tenure must be greater than zero.',
            },
        };
    }
    // Convert tenure to years, months, and days
    let tenureYears = tenure;
    let tenureMonths = Math.round(tenure * 12);
    let tenureDays = Math.round(tenure * 365);
    if (tenureUnit === 'months') {
        tenureYears = tenure / 12;
        tenureMonths = tenure;
        tenureDays = Math.round((tenure / 12) * 365);
    }
    else if (tenureUnit === 'days') {
        tenureYears = tenure / 365;
        tenureMonths = Math.round((tenure / 365) * 12 * 10) / 10;
        tenureDays = tenure;
    }
    if (principal > 1000000000 || annualRate > 50 || tenureYears > 50) {
        return {
            success: false,
            error: {
                code: 'OUT_OF_BOUNDS_INPUT',
                message: 'Inputs exceed supported limits (Principal ≤ ₹100 Cr, Rate ≤ 50%, Tenure ≤ 50 years).',
            },
        };
    }
    const baseRate = annualRate;
    const effectiveRate = isSeniorCitizen
        ? Math.round((baseRate + seniorCitizenBoost) * 100) / 100
        : baseRate;
    const validCompounding = Number(compoundingFrequency) || 4;
    const validPayoutFreq = Number(payoutFrequency) || 4;
    const compoundingLabelMap = {
        12: 'Monthly',
        4: 'Quarterly',
        2: 'Half-Yearly',
        1: 'Annual',
    };
    const compoundingLabel = compoundingLabelMap[validCompounding] || `${validCompounding}x/yr`;
    const tdsThreshold = customTdsThreshold !== undefined
        ? customTdsThreshold
        : isSeniorCitizen
            ? 50000
            : 40000;
    let maturityValue = 0;
    let totalInterest = 0;
    let periodicPayout = 0;
    let totalPayouts = 0;
    let effectiveAnnualYield = 0;
    if (fdType === 'cumulative') {
        maturityValue = calculateFdMaturity(principal, effectiveRate, tenureYears, validCompounding);
        totalInterest = Math.max(0, Math.round((maturityValue - principal) * 100) / 100);
        effectiveAnnualYield = calculateEffectiveAnnualYield(effectiveRate, validCompounding);
    }
    else {
        periodicPayout = calculatePeriodicPayout(principal, effectiveRate, validPayoutFreq);
        totalPayouts = Math.max(1, Math.round(validPayoutFreq * tenureYears));
        totalInterest = Math.round(principal * (effectiveRate / 100) * tenureYears * 100) / 100;
        maturityValue = principal;
        effectiveAnnualYield = effectiveRate;
    }
    // TDS Calculation
    const isTdsApplicable = totalInterest > tdsThreshold;
    const effectiveTdsRate = applyTds && isTdsApplicable ? tdsRate : 0;
    const totalTds = Math.round((totalInterest * (effectiveTdsRate / 100)) * 100) / 100;
    const netInterest = Math.max(0, Math.round((totalInterest - totalTds) * 100) / 100);
    // Generate Year-by-Year Schedule
    const yearlySchedule = [];
    const totalScheduleYears = Math.max(1, Math.ceil(tenureYears));
    let runningBalance = principal;
    let cumulativeInterestAcc = 0;
    let cumulativeTdsAcc = 0;
    for (let y = 1; y <= totalScheduleYears; y++) {
        const yearFraction = y === totalScheduleYears && tenureYears % 1 !== 0
            ? tenureYears - Math.floor(tenureYears)
            : 1;
        const openingBalance = runningBalance;
        let interestThisYear = 0;
        let payoutThisYear = 0;
        let closingBalance = runningBalance;
        if (fdType === 'cumulative') {
            const yearMaturity = calculateFdMaturity(openingBalance, effectiveRate, yearFraction, validCompounding);
            interestThisYear = Math.max(0, Math.round((yearMaturity - openingBalance) * 100) / 100);
            closingBalance = Math.round((openingBalance + interestThisYear) * 100) / 100;
            runningBalance = closingBalance;
        }
        else {
            interestThisYear = Math.round(principal * (effectiveRate / 100) * yearFraction * 100) / 100;
            payoutThisYear = interestThisYear;
            closingBalance = principal;
        }
        const tdsThisYear = effectiveTdsRate > 0 && totalInterest > 0
            ? Math.round(((interestThisYear / totalInterest) * totalTds) * 100) / 100
            : 0;
        const netInterestThisYear = Math.max(0, Math.round((interestThisYear - tdsThisYear) * 100) / 100);
        cumulativeInterestAcc = Math.round((cumulativeInterestAcc + interestThisYear) * 100) / 100;
        cumulativeTdsAcc = Math.round((cumulativeTdsAcc + tdsThisYear) * 100) / 100;
        yearlySchedule.push({
            year: y,
            openingBalance: Math.round(openingBalance * 100) / 100,
            interestEarned: interestThisYear,
            tdsDeducted: tdsThisYear,
            netInterest: netInterestThisYear,
            payoutAmount: payoutThisYear,
            closingBalance,
            cumulativeInterest: cumulativeInterestAcc,
            cumulativeTds: cumulativeTdsAcc,
        });
    }
    const tenureDisplay = `${tenure} ${tenureUnit}`;
    const formula = fdType === 'cumulative'
        ? `A = ${formatCurrency(principal)} × [1 + (${effectiveRate}% / ${validCompounding})]^(${validCompounding} × ${formatNumber(tenureYears)}) = ${formatCurrency(maturityValue)}`
        : `Payout = ${formatCurrency(principal)} × (${effectiveRate}% / ${validPayoutFreq}) = ${formatCurrency(periodicPayout)} / period`;
    return {
        success: true,
        data: {
            principal,
            baseRate,
            effectiveRate,
            tenureYears: Math.round(tenureYears * 1000) / 1000,
            tenureMonths,
            tenureDays,
            tenureDisplay,
            compoundingFrequency: validCompounding,
            compoundingLabel,
            fdType,
            isSeniorCitizen,
            maturityValue,
            totalInterest,
            netInterest,
            totalTds,
            isTdsApplicable,
            tdsThreshold,
            periodicPayout,
            totalPayouts,
            effectiveAnnualYield,
            formula,
            formattedPrincipal: formatCurrency(principal),
            formattedMaturityValue: formatCurrency(maturityValue),
            formattedTotalInterest: formatCurrency(totalInterest),
            formattedNetInterest: formatCurrency(netInterest),
            formattedTotalTds: formatCurrency(totalTds),
            formattedPeriodicPayout: formatCurrency(periodicPayout),
            formattedApy: `${formatNumber(effectiveAnnualYield)}%`,
            yearlySchedule,
        },
    };
}
