function getScoreStatus(score) {
  if (score >= 90) {
    return {
      label: "Excellent",
      text: "text-emerald-600",
      track: "border-emerald-100",
      ring: "border-emerald-500",
    };
  }

  if (score >= 70) {
    return {
      label: "Needs Improvement",
      text: "text-amber-600",
      track: "border-amber-100",
      ring: "border-amber-500",
    };
  }

  return {
    label: "Poor",
    text: "text-red-600",
    track: "border-red-100",
    ring: "border-red-500",
  };
}

function ScoreGauge({
  score,
  size = "medium",
}) {
  const status = getScoreStatus(score);

  const sizes = {
    small: {
      wrapper: "h-16 w-16",
      score: "text-lg",
      border: "border-4",
    },

    medium: {
      wrapper: "h-24 w-24",
      score: "text-2xl",
      border: "border-4",
    },

    large: {
      wrapper: "h-32 w-32",
      score: "text-4xl",
      border: "border-[6px]",
    },
  };

  const selectedSize =
    sizes[size] || sizes.medium;

  return (
    <div className="flex flex-col items-center">
      <div
        className={`
          flex
          items-center
          justify-center
          rounded-full
          ${selectedSize.wrapper}
          ${selectedSize.border}
          ${status.track}
          bg-white
          relative
        `}
      >
        <div
          className={`
            absolute
            inset-0
            rounded-full
            border-transparent
            ${selectedSize.border}
          `}
          style={{
            clipPath: `inset(0 ${100 - score}% 0 0)`,
          }}
        />

        <span
          className={`font-extrabold tracking-tight ${selectedSize.score} ${status.text}`}
        >
          {score}
        </span>
      </div>

      <span
        className={`mt-2 text-xs font-semibold ${status.text}`}
      >
        {status.label}
      </span>
    </div>
  );
}

export default ScoreGauge;