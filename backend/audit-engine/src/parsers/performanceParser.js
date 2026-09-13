function getNumericValue(audit) {
    const value = audit?.numericValue;

    return typeof value === "number"
        ? Number(value.toFixed(2))
        : null;
}

function parsePerformance(result) {
    const audits = result?.lhr?.audits || {};

    return {
        firstContentfulPaint:
            getNumericValue(
                audits["first-contentful-paint"]
            ),

        largestContentfulPaint:
            getNumericValue(
                audits["largest-contentful-paint"]
            ),

        interactionToNextPaint:
            getNumericValue(
                audits["interaction-to-next-paint"]
            ),

        cumulativeLayoutShift:
            getNumericValue(
                audits["cumulative-layout-shift"]
            ),

        speedIndex:
            getNumericValue(
                audits["speed-index"]
            ),

        totalBlockingTime:
            getNumericValue(
                audits["total-blocking-time"]
            )
    };
}

module.exports = {
    parsePerformance
};