function getScoreStatus(score) {
  if (score >= 90) {
    return {
      label: "Excellent",
      text: "text-[#168f82]",
      border: "border-[#19a999]",
      track: "border-[#c9e8e3]",
      background: "bg-[#f3fbf9]",
    };
  }

  if (score >= 70) {
    return {
      label: "Needs Improvement",
      text: "text-[#a07819]",
      border: "border-[#d59a20]",
      track: "border-[#ead8a7]",
      background: "bg-[#fffaf0]",
    };
  }

  return {
    label: "Needs Attention",
    text: "text-[#d65347]",
    border: "border-[#e56a5d]",
    track: "border-[#f1c7c2]",
    background: "bg-[#fff8f6]",
  };
}

function ScoreGauge({ score = 0, size = "medium" }) {
  const safeScore = Math.min(Math.max(Number(score) || 0, 0), 100);
  const status = getScoreStatus(safeScore);

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

  const selectedSize = sizes[size] || sizes.medium;

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative flex items-center justify-center rounded-full ${selectedSize.wrapper} ${selectedSize.border} ${status.track} ${status.background}`}
      >
        <div
          className={`absolute inset-0 rounded-full ${selectedSize.border} ${status.border}`}
          style={{
            clipPath: `inset(0 ${100 - safeScore}% 0 0)`,
          }}
        />

        <span
          className={`font-extrabold tracking-[-0.04em] ${selectedSize.score} ${status.text}`}
        >
          {Math.round(safeScore)}
        </span>
      </div>

      <span
        className={`mt-2 text-xs font-extrabold ${status.text}`}
      >
        {status.label}
      </span>
    </div>
  );
}

export default ScoreGauge;