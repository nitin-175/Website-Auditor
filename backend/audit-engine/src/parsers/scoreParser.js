function getCategoryScore(result, category) {
    const score =
        result?.lhr?.categories?.[category]?.score;

    if (typeof score !== "number") {
        return null;
    }

    return Number((score * 100).toFixed(2));
}

function parseScores(result) {
    return {
        performance: getCategoryScore(
            result,
            "performance"
        ),

        accessibility: getCategoryScore(
            result,
            "accessibility"
        ),

        bestPractices: getCategoryScore(
            result,
            "best-practices"
        ),

        seo: getCategoryScore(
            result,
            "seo"
        )
    };
}

function calculateOverallScore(scores) {
    const validScores = Object.values(scores)
        .filter(score => typeof score === "number");

    if (validScores.length === 0) {
        return null;
    }

    const total = validScores.reduce(
        (sum, score) => sum + score,
        0
    );

    return Number(
        (total / validScores.length).toFixed(2)
    );
}

module.exports = {
    parseScores,
    calculateOverallScore
};