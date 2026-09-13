const logger = require("../utils/logger");

const {
    parseScores,
    calculateOverallScore
} = require("../parsers/scoreParser");

const {
    parsePerformance
} = require("../parsers/performanceParser");

const {
    parseVitals
} = require("../parsers/vitalsParser");

const {
    extractIssues
} = require("./issueExtractor");

function processAuditResult(lighthouseResult) {
    if (!lighthouseResult) {
        const error = new Error(
            "Lighthouse result is empty"
        );

        error.statusCode = 500;
        throw error;
    }

    const scores = parseScores(lighthouseResult);

    const overallScore =
        calculateOverallScore(scores);

    const performance =
        parsePerformance(lighthouseResult);

    const vitals =
        parseVitals(lighthouseResult);

    const issues =
        extractIssues(lighthouseResult);

    logger.info(
        `Audit result processed: ${issues.length} issues found`
    );

    return {
        scores: {
            performance: scores.performance,
            accessibility: scores.accessibility,
            bestPractices: scores.bestPractices,
            seo: scores.seo,
            overall: overallScore
        },

        performance,

        vitals,

        issues
    };
}

module.exports = {
    processAuditResult
};