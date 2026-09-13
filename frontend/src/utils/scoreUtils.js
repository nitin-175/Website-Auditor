export function normalizeScore(score) {
  if (
    score === null ||
    score === undefined ||
    Number.isNaN(Number(score))
  ) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(0, Number(score))
  );
}

export function getScoreLevel(score) {
  const normalizedScore =
    normalizeScore(score);

  if (normalizedScore >= 90) {
    return "excellent";
  }

  if (normalizedScore >= 70) {
    return "good";
  }

  if (normalizedScore >= 50) {
    return "needs-improvement";
  }

  return "poor";
}

export function getScoreLabel(score) {
  const level =
    getScoreLevel(score);

  const labels = {
    excellent: "Excellent",
    good: "Good",
    "needs-improvement":
      "Needs Improvement",
    poor: "Poor",
  };

  return labels[level];
}

export function getScoreColorClass(
  score
) {
  const level =
    getScoreLevel(score);

  const classes = {
    excellent:
      "bg-emerald-50 text-emerald-600",
    good:
      "bg-amber-50 text-amber-600",
    "needs-improvement":
      "bg-orange-50 text-orange-600",
    poor:
      "bg-red-50 text-red-600",
  };

  return classes[level];
}

export function getScoreBarClass(
  score
) {
  const level =
    getScoreLevel(score);

  const classes = {
    excellent: "bg-emerald-500",
    good: "bg-amber-500",
    "needs-improvement":
      "bg-orange-500",
    poor: "bg-red-500",
  };

  return classes[level];
}

export function calculateScoreDifference(
  currentScore,
  previousScore
) {
  const current =
    normalizeScore(currentScore);

  const previous =
    normalizeScore(previousScore);

  return current - previous;
}

export function getScoreDifferenceLabel(
  currentScore,
  previousScore
) {
  const difference =
    calculateScoreDifference(
      currentScore,
      previousScore
    );

  if (difference > 0) {
    return `+${difference}`;
  }

  return `${difference}`;
}

export function getScoreDifferenceType(
  currentScore,
  previousScore
) {
  const difference =
    calculateScoreDifference(
      currentScore,
      previousScore
    );

  if (difference > 0) {
    return "positive";
  }

  if (difference < 0) {
    return "negative";
  }

  return "neutral";
}

export function calculateOverallScore(
  scores
) {
  if (!scores) {
    return 0;
  }

  const values = [
    scores.performance,
    scores.accessibility,
    scores.bestPractices,
    scores.seo,
  ].filter(
    (value) =>
      value !== null &&
      value !== undefined &&
      !Number.isNaN(Number(value))
  );

  if (values.length === 0) {
    return 0;
  }

  const total = values.reduce(
    (sum, value) =>
      sum + Number(value),
    0
  );

  return Math.round(
    total / values.length
  );
}