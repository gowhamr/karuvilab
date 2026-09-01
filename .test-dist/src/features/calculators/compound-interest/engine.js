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
 * Calculates Effective Annual Rate (EAR / APY).
 * EAR = (1 + r/n)^n - 1
 */
export function calculateEffectiveAnnualRate(nominalRatePercent, frequency) {
    if (frequency <= 0 || nominalRatePercent <= 0)
        return nominalRatePercent;
    const r = nominalRatePercent / 100;
    const ear = Math.pow(1 + r / frequency, frequency) - 1;
    return Number((ear * 100).toFixed(4));
}
/**
 * Calculates Rule of 72 Doubling Time (approximate years).
 */
export function calculateDoublingTime(annualRatePercent) {
    if (annualRatePercent <= 0)
        return 0;
    return Number((72 / annualRatePercent).toFixed(1));
}
/**
 * Pure Deterministic Compound Interest Engine with optional recurring contribution and inflation adjustment.
 */
export function calculateCompoundInterest(input) {
    const { principal, annualRate, years, frequency, monthlyContribution = 0, inflationRate = 0, } = input;
    if (isNaN(principal) || principal < 0) {
        return {
            success: false,
            error: { code: 'INVALID_PRINCIPAL', message: 'Principal amount must be a positive number.' },
        };
    }
    if (isNaN(annualRate) || annualRate < 0) {
        return {
            success: false,
            error: { code: 'INVALID_RATE', message: 'Annual interest rate must be a non-negative number.' },
        };
    }
    if (isNaN(years) || years <= 0) {
        return {
            success: false,
            error: { code: 'INVALID_YEARS', message: 'Investment duration must be at least 1 year.' },
        };
    }
    const validFrequencies = [1, 2, 4, 12, 365];
    if (!validFrequencies.includes(frequency)) {
        return {
            success: false,
            error: { code: 'INVALID_FREQUENCY', message: 'Compounding frequency must be 1, 2, 4, 12, or 365.' },
        };
    }
    if (principal > 1000000000 || years > 100 || annualRate > 100) {
        return {
            success: false,
            error: {
                code: 'OUT_OF_BOUNDS_INPUT',
                message: 'Inputs exceed standard maximum ranges (Principal ≤ 100Cr, Years ≤ 100, Rate ≤ 100%).',
            },
        };
    }
    const r = annualRate / 100;
    const n = frequency;
    const t = years;
    const pmt = Math.max(0, monthlyContribution);
    const inf = Math.max(0, inflationRate) / 100;
    // Year-by-year step simulation to guarantee exact projection integrity
    const projections = [];
    let currentBalance = principal;
    let totalContributions = 0;
    for (let y = 1; y <= t; y++) {
        const startingBalance = currentBalance;
        const yearContributions = pmt * 12;
        totalContributions += yearContributions;
        // Simulate 12 months in this year
        let monthlyBalance = startingBalance;
        for (let m = 1; m <= 12; m++) {
            // Add monthly contribution at beginning of month
            monthlyBalance += pmt;
            // Compound for 1/12th of a year with nominal rate r and frequency n
            // Monthly effective growth factor
            const monthlyGrowth = Math.pow(1 + r / n, n / 12);
            monthlyBalance = monthlyBalance * monthlyGrowth;
        }
        const endingBalance = monthlyBalance;
        const interestEarned = endingBalance - startingBalance - yearContributions;
        const realEndingBalance = endingBalance / Math.pow(1 + inf, y);
        projections.push({
            year: y,
            startingBalance: Math.round(startingBalance * 100) / 100,
            contributions: yearContributions,
            interestEarned: Math.round(interestEarned * 100) / 100,
            endingBalance: Math.round(endingBalance * 100) / 100,
            realEndingBalance: Math.round(realEndingBalance * 100) / 100,
        });
        currentBalance = endingBalance;
    }
    const futureValue = currentBalance;
    const totalInvested = principal + totalContributions;
    const totalInterest = futureValue - totalInvested;
    const effectiveAnnualRate = calculateEffectiveAnnualRate(annualRate, frequency);
    const realFutureValue = futureValue / Math.pow(1 + inf, t);
    const doublingYears = calculateDoublingTime(annualRate);
    const freqLabel = frequency === 1
        ? 'Annually'
        : frequency === 2
            ? 'Semi-Annually'
            : frequency === 4
                ? 'Quarterly'
                : frequency === 12
                    ? 'Monthly'
                    : 'Daily';
    const formula = `A = ${formatCurrency(principal)} × (1 + ${annualRate}% / ${frequency})^(${frequency} × ${years})${pmt > 0 ? ` + Monthly Deposits (${formatCurrency(pmt)}/mo)` : ''}`;
    return {
        success: true,
        data: {
            futureValue: Math.round(futureValue * 100) / 100,
            totalPrincipal: principal,
            totalContributions,
            totalInvested: Math.round(totalInvested * 100) / 100,
            totalInterest: Math.round(totalInterest * 100) / 100,
            effectiveAnnualRate,
            realFutureValue: Math.round(realFutureValue * 100) / 100,
            doublingYears,
            formula,
            formattedFutureValue: formatCurrency(futureValue),
            formattedTotalInterest: formatCurrency(totalInterest),
            formattedTotalInvested: formatCurrency(totalInvested),
            formattedEffectiveRate: `${effectiveAnnualRate}%`,
            projections,
        },
    };
}
