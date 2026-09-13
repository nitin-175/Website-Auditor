const logger = require("../utils/logger");


function determineSeverity(audit) {
    const score = audit?.score;

    if (score === 0) {
        return "CRITICAL";
    }

    if (typeof score !== "number") {
        return "MEDIUM";
    }

    if (score < 0.5) {
        return "HIGH";
    }

    if (score < 0.9) {
        return "MEDIUM";
    }

    return "LOW";
}

function getRecommendation(audit) {
    if (audit?.details?.items?.length > 0) {
        const firstItem = audit.details.items[0];

        if (firstItem?.node?.snippet) {
            return `Review the affected element: ${firstItem.node.snippet}`;
        }

        if (firstItem?.url) {
            return `Review the affected resource: ${firstItem.url}`;
        }
    }

    if (audit?.description) {
        return audit.description;
    }

    return "Review this Lighthouse audit and apply the recommended optimization.";
}

function extractIssues(result) {
    const audits = result?.lhr?.audits || {};

    const issues = [];

    Object.values(audits).forEach((audit) => {
        if (!audit) {
            return;
        }

        /*
         * Informational audits do not represent problems.
         */
        if (audit.scoreDisplayMode === "informative") {
            return;
        }

        /*
         * Manual audits cannot be automatically classified
         * as failed issues.
         */
        if (audit.scoreDisplayMode === "manual") {
            return;
        }

        /*
         * Only process audits with an actual numeric score.
         */
        if (typeof audit.score !== "number") {
            return;
        }

        /*
         * A score of 1 means the audit passed.
         */
        if (audit.score >= 1) {
            return;
        }

        /*
         * Some audits use null as their score when they
         * cannot be evaluated.
         */
        if (audit.score === null) {
            return;
        }

        const category =
            audit.category ||
            determineCategory(audit);

        const issue = {
            category,
            severity: determineSeverity(audit),

            title:
                audit.title ||
                "Lighthouse audit issue",

            description:
                audit.description ||
                "Lighthouse detected an issue that may affect website quality.",

            recommendation:
                getRecommendation(audit)
        };

        issues.push(issue);
    });

    logger.info(
        `Extracted ${issues.length} Lighthouse issues`
    );

    return issues;
}

function determineCategory(audit) {
    const id = audit?.id?.toLowerCase() || "";

    if (
        id.includes("performance") ||
        id.includes("paint") ||
        id.includes("blocking") ||
        id.includes("speed") ||
        id.includes("layout")
    ) {
        return "PERFORMANCE";
    }

    if (
        id.includes("accessibility") ||
        id.includes("aria") ||
        id.includes("contrast")
    ) {
        return "ACCESSIBILITY";
    }

    if (
        id.includes("seo") ||
        id.includes("meta") ||
        id.includes("crawl")
    ) {
        return "SEO";
    }

    return "BEST_PRACTICES";
}

module.exports = {
    extractIssues
};