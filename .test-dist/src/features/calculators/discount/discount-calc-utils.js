export function formatCurrency(val, locale = 'en-IN', currency = 'INR') {
    if (!isFinite(val))
        return '₹0.00';
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(val);
}
export function formatPercent(val, maxDecimals = 2) {
    if (!isFinite(val))
        return '0%';
    return `${Number(val.toFixed(maxDecimals)).toLocaleString('en-US', {
        maximumFractionDigits: maxDecimals,
    })}%`;
}
/**
 * Calculates sale price after primary discount, optional stacked discount, and sales tax.
 */
export function calculateForwardDiscount(input) {
    const { originalPrice, discountPercent, extraDiscountPercent = 0, taxPercent = 0 } = input;
    if (isNaN(originalPrice) || isNaN(discountPercent) || isNaN(extraDiscountPercent) || isNaN(taxPercent)) {
        return {
            success: false,
            error: { code: 'INVALID_PRICE', message: 'Please enter valid numerical amounts.' },
        };
    }
    if (originalPrice < 0 || discountPercent < 0 || extraDiscountPercent < 0 || taxPercent < 0) {
        return {
            success: false,
            error: { code: 'NEGATIVE_VALUE', message: 'Price, discount rates, and tax rates cannot be negative.' },
        };
    }
    if (discountPercent > 100 || extraDiscountPercent > 100) {
        return {
            success: false,
            error: { code: 'DISCOUNT_100_OR_MORE', message: 'A single discount cannot exceed 100%.' },
        };
    }
    // First discount
    const firstDiscountSavings = (originalPrice * discountPercent) / 100;
    const priceAfterFirst = originalPrice - firstDiscountSavings;
    // Second stacked discount (applied on intermediate price)
    const extraDiscountSavings = (priceAfterFirst * extraDiscountPercent) / 100;
    const preTaxPrice = priceAfterFirst - extraDiscountSavings;
    // Total savings and effective combined discount rate
    const totalSavings = firstDiscountSavings + extraDiscountSavings;
    const effectiveDiscountPercent = originalPrice > 0 ? (totalSavings / originalPrice) * 100 : 0;
    // Sales Tax
    const taxAmount = (preTaxPrice * taxPercent) / 100;
    const finalPayable = preTaxPrice + taxAmount;
    const formula = extraDiscountPercent > 0
        ? `(${formatCurrency(originalPrice)} - ${discountPercent}%) - ${extraDiscountPercent}% extra + ${taxPercent}% tax = ${formatCurrency(finalPayable)}`
        : `${formatCurrency(originalPrice)} - ${discountPercent}% + ${taxPercent}% tax = ${formatCurrency(finalPayable)}`;
    return {
        success: true,
        data: {
            originalPrice,
            discountPercent,
            extraDiscountPercent,
            taxPercent,
            firstDiscountSavings: Math.round(firstDiscountSavings * 100) / 100,
            extraDiscountSavings: Math.round(extraDiscountSavings * 100) / 100,
            totalSavings: Math.round(totalSavings * 100) / 100,
            preTaxPrice: Math.round(preTaxPrice * 100) / 100,
            taxAmount: Math.round(taxAmount * 100) / 100,
            finalPayable: Math.round(finalPayable * 100) / 100,
            effectiveDiscountPercent: Math.round(effectiveDiscountPercent * 100) / 100,
            formula,
            formattedOriginalPrice: formatCurrency(originalPrice),
            formattedFinalPayable: formatCurrency(finalPayable),
            formattedTotalSavings: formatCurrency(totalSavings),
            formattedEffectiveDiscount: formatPercent(effectiveDiscountPercent),
        },
    };
}
/**
 * Calculates the required discount percentage to reach a target price from an original price.
 */
export function calculateFindDiscount(input) {
    const { originalPrice, targetPrice } = input;
    if (isNaN(originalPrice) || isNaN(targetPrice)) {
        return {
            success: false,
            error: { code: 'INVALID_PRICE', message: 'Please enter valid numerical amounts.' },
        };
    }
    if (originalPrice <= 0) {
        return {
            success: false,
            error: { code: 'INVALID_PRICE', message: 'Original price must be greater than zero.' },
        };
    }
    if (targetPrice < 0) {
        return {
            success: false,
            error: { code: 'NEGATIVE_VALUE', message: 'Target price cannot be negative.' },
        };
    }
    if (targetPrice > originalPrice) {
        return {
            success: false,
            error: {
                code: 'TARGET_EXCEEDS_ORIGINAL',
                message: 'Target price cannot be higher than the original price in a discount calculation.',
            },
        };
    }
    const totalSavings = originalPrice - targetPrice;
    const requiredDiscountPercent = (totalSavings / originalPrice) * 100;
    const formula = `((${formatCurrency(originalPrice)} - ${formatCurrency(targetPrice)}) / ${formatCurrency(originalPrice)}) × 100 = ${formatPercent(requiredDiscountPercent)}`;
    return {
        success: true,
        data: {
            originalPrice,
            targetPrice,
            totalSavings: Math.round(totalSavings * 100) / 100,
            requiredDiscountPercent: Math.round(requiredDiscountPercent * 100) / 100,
            formula,
            formattedRequiredDiscount: formatPercent(requiredDiscountPercent),
            formattedTotalSavings: formatCurrency(totalSavings),
        },
    };
}
/**
 * Reverse calculation: Finds the pre-discount original price given a final sale price and discount percentage.
 */
export function calculateFindOriginal(input) {
    const { finalPrice, discountPercent } = input;
    if (isNaN(finalPrice) || isNaN(discountPercent)) {
        return {
            success: false,
            error: { code: 'INVALID_PRICE', message: 'Please enter valid numerical amounts.' },
        };
    }
    if (finalPrice < 0 || discountPercent < 0) {
        return {
            success: false,
            error: { code: 'NEGATIVE_VALUE', message: 'Price and discount rate cannot be negative.' },
        };
    }
    if (discountPercent >= 100) {
        return {
            success: false,
            error: {
                code: 'DISCOUNT_100_OR_MORE',
                message: 'Discount cannot be 100% or greater when back-calculating original price.',
            },
        };
    }
    const originalPrice = finalPrice / (1 - discountPercent / 100);
    const totalSavings = originalPrice - finalPrice;
    const formula = `${formatCurrency(finalPrice)} / (1 - ${discountPercent}%) = ${formatCurrency(originalPrice)}`;
    return {
        success: true,
        data: {
            finalPrice,
            discountPercent,
            originalPrice: Math.round(originalPrice * 100) / 100,
            totalSavings: Math.round(totalSavings * 100) / 100,
            formula,
            formattedOriginalPrice: formatCurrency(originalPrice),
            formattedTotalSavings: formatCurrency(totalSavings),
        },
    };
}
