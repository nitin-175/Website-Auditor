function getNumericValue(audit) {
    const value = audit?.numericValue;

    return typeof value === "number"
        ? Number(value.toFixed(2))
        : null;
}

function parseVitals(result) {
    const audits = result?.lhr?.audits || {};

    return {
        lcpMs: getNumericValue(
            audits["largest-contentful-paint"]
        ),

        inpMs: getNumericValue(
            audits["interaction-to-next-paint"]
        ),

        cls: getNumericValue(
            audits["cumulative-layout-shift"]
        ),

        fcpMs: getNumericValue(
            audits["first-contentful-paint"]
        )
    };
}

module.exports = {
    parseVitals
};