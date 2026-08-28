export function formatNumber(n, maxDecimals = 4) {
    if (!isFinite(n))
        return '0';
    return Number(n.toFixed(maxDecimals)).toLocaleString('en-US', {
        maximumFractionDigits: maxDecimals,
    });
}
/**
 * Calculates what is X% of Y.
 * Formula: (X / 100) * Y
 */
export function calculatePercentageOf(input) {
    const { percentage, total } = input;
    if (isNaN(percentage) || isNaN(total)) {
        return {
            success: false,
            error: { code: 'INVALID_NUMBER', message: 'Please enter valid numerical values.' },
        };
    }
    const fraction = percentage / 100;
    const result = fraction * total;
    return {
        success: true,
        data: {
            result,
            percentage,
            total,
            fraction,
            formula: `(${formatNumber(percentage)} / 100) × ${formatNumber(total)} = ${formatNumber(result)}`,
            formattedResult: formatNumber(result),
        },
    };
}
/**
 * Calculates what percentage X is of Y.
 * Formula: (X / Y) * 100
 */
export function calculateWhatPercentage(input) {
    const { part, total } = input;
    if (isNaN(part) || isNaN(total)) {
        return {
            success: false,
            error: { code: 'INVALID_NUMBER', message: 'Please enter valid numerical values.' },
        };
    }
    if (total === 0) {
        return {
            success: false,
            error: {
                code: 'DIVISION_BY_ZERO',
                message: 'Cannot calculate percentage of a total of zero (division by zero).',
            },
        };
    }
    const fraction = part / total;
    const percentage = fraction * 100;
    return {
        success: true,
        data: {
            percentage,
            part,
            total,
            fraction,
            formula: `(${formatNumber(part)} / ${formatNumber(total)}) × 100 = ${formatNumber(percentage)}%`,
            formattedPercentage: `${formatNumber(percentage)}%`,
        },
    };
}
/**
 * Calculates percentage change (increase/decrease) from X to Y.
 * Formula: ((Y - X) / |X|) * 100
 */
export function calculatePercentageChange(input) {
    const { fromValue, toValue } = input;
    if (isNaN(fromValue) || isNaN(toValue)) {
        return {
            success: false,
            error: { code: 'INVALID_NUMBER', message: 'Please enter valid numerical values.' },
        };
    }
    if (fromValue === 0) {
        return {
            success: false,
            error: {
                code: 'DIVISION_BY_ZERO',
                message: 'Original base value cannot be zero when computing percentage change.',
            },
        };
    }
    const diff = toValue - fromValue;
    const absoluteChange = Math.abs(diff);
    const percentageChange = (diff / Math.abs(fromValue)) * 100;
    const multiplier = toValue / fromValue;
    let changeType = 'no-change';
    if (diff > 0)
        changeType = 'increase';
    else if (diff < 0)
        changeType = 'decrease';
    const prefix = percentageChange > 0 ? '+' : '';
    return {
        success: true,
        data: {
            percentageChange,
            absoluteChange,
            fromValue,
            toValue,
            changeType,
            multiplier,
            formula: `((${formatNumber(toValue)} - ${formatNumber(fromValue)}) / |${formatNumber(fromValue)}|) × 100 = ${prefix}${formatNumber(percentageChange)}%`,
            formattedPercentage: `${prefix}${formatNumber(percentageChange)}%`,
        },
    };
}
/**
 * Reverse percentage calculation: Finds original value before an X% increase or decrease.
 * Increase Formula: Original = Final / (1 + X/100)
 * Decrease Formula: Original = Final / (1 - X/100)
 */
export function calculateReversePercentage(input) {
    const { finalValue, percentage, type } = input;
    if (isNaN(finalValue) || isNaN(percentage)) {
        return {
            success: false,
            error: { code: 'INVALID_NUMBER', message: 'Please enter valid numerical values.' },
        };
    }
    if (type === 'decrease' && percentage >= 100) {
        return {
            success: false,
            error: {
                code: 'INVALID_PERCENTAGE_DECREASE',
                message: 'A percentage decrease cannot be 100% or greater in reverse calculation.',
            },
        };
    }
    const rate = Math.abs(percentage) / 100;
    let originalValue;
    let formula;
    if (type === 'increase') {
        originalValue = finalValue / (1 + rate);
        formula = `${formatNumber(finalValue)} / (1 + ${formatNumber(rate)}) = ${formatNumber(originalValue)}`;
    }
    else {
        originalValue = finalValue / (1 - rate);
        formula = `${formatNumber(finalValue)} / (1 - ${formatNumber(rate)}) = ${formatNumber(originalValue)}`;
    }
    const difference = finalValue - originalValue;
    return {
        success: true,
        data: {
            originalValue,
            finalValue,
            percentage,
            type,
            difference,
            formula,
            formattedOriginalValue: formatNumber(originalValue),
        },
    };
}
