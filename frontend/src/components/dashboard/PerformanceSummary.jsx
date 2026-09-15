import {
  Accessibility,
  Gauge,
  SearchCheck,
  ShieldCheck,
} from "lucide-react";

function getScoreMeta(score) {
  if (score === null || score === undefined) {
    return {
      label: "Not available",
      text: "text-[#929088]",
      track: "bg-[#ece9e1]",
      bar: "bg-[#b9b6ae]",
    };
  }

  const numericScore = Number(score);

  if (numericScore >= 90) {
    return {
      label: "Excellent",
      text: "text-[#128f82]",
      track: "bg-[#e8f7f4]",
      bar: "bg-[#19a999]",
    };
  }

  if (numericScore >= 70) {
    return {
      label: "Good",
      text: "text-[#ad7812]",
      track: "bg-[#fff6df]",
      bar: "bg-[#e0a52b]",
    };
  }

  return {
    label: "Needs work",
    text: "text-[#d95b4f]",
    track: "bg-[#fff0ed]",
    bar: "bg-[#f06f61]",
  };
}

function PerformanceSummary({ audit }) {
  const scores = audit?.scores;

  const categories = [
    {
      label: "Performance",
      score: scores?.performance,
      icon: Gauge,
      accent: "text-[#4f46e5]",
      background: "bg-[#eef0ff]",
    },
    {
      label: "Accessibility",
      score: scores?.accessibility,
      icon: Accessibility,
      accent: "text-[#128f82]",
      background: "bg-[#e8f7f4]",
    },
    {
      label: "Best Practices",
      score: scores?.bestPractices,
      icon: ShieldCheck,
      accent: "text-[#ad7812]",
      background: "bg-[#fff6df]",
    },
    {
      label: "SEO",
      score: scores?.seo,
      icon: SearchCheck,
      accent: "text-[#d95b4f]",
      background: "bg-[#fff0ed]",
    },
  ];

  const availableScores = categories
    .map((category) => category.score)
    .filter(
      (score) => score !== null && score !== undefined,
    )
    .map(Number);

  const calculatedOverallScore =
    availableScores.length > 0
      ? Math.round(
          availableScores.reduce((sum, score) => sum + score, 0) /
            availableScores.length,
        )
      : null;

  const overallScore =
    audit?.overallScore !== null &&
    audit?.overallScore !== undefined
      ? Math.round(Number(audit.overallScore))
      : calculatedOverallScore;

  const overallMeta = getScoreMeta(overallScore);

  return (
    <section className="overflow-hidden rounded-2xl border border-[#ddd9ce] bg-white shadow-[0_8px_30px_rgba(23,32,51,0.04)]">
      <div className="border-b border-[#e5e2d9] p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#19a999]" />
          <h2 className="text-base font-extrabold text-[#172033]">
            Performance summary
          </h2>
        </div>

        <p className="mt-1.5 text-xs leading-5 text-[#8b8981]">
          Latest audit category scores
        </p>
      </div>

      {!audit ? (
        <div className="p-6">
          <div className="rounded-xl border border-dashed border-[#dcd8ce] bg-[#faf9f4] p-6 text-center">
            <p className="text-sm font-semibold text-[#67655f]">
              No completed audit yet
            </p>

            <p className="mt-1.5 text-xs leading-5 text-[#949189]">
              Your category scores will appear here after your first
              completed audit.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-5 p-5 sm:p-6">
            {categories.map((category) => {
              const Icon = category.icon;

              const score =
                category.score !== null &&
                category.score !== undefined
                  ? Math.round(Number(category.score))
                  : null;

              const meta = getScoreMeta(score);

              return (
                <div key={category.label}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${category.background} ${category.accent}`}
                      >
                        <Icon size={16} strokeWidth={2} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#3e3d38]">
                          {category.label}
                        </p>

                        <p
                          className={`mt-0.5 text-[10px] font-bold uppercase tracking-[0.06em] ${meta.text}`}
                        >
                          {meta.label}
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 text-sm font-extrabold text-[#172033]">
                      {score !== null ? score : "—"}
                    </span>
                  </div>

                  <div
                    className={`mt-2.5 h-1.5 overflow-hidden rounded-full ${meta.track}`}
                  >
                    <div
                      className={`h-full rounded-full ${meta.bar} transition-all duration-500`}
                      style={{
                        width:
                          score !== null
                            ? `${Math.max(
                                0,
                                Math.min(100, score),
                              )}%`
                            : "0%",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-[#e5e2d9] bg-[#faf9f4] p-5 sm:p-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#89877f]">
                  Overall score
                </p>

                <div className="mt-1 flex items-baseline gap-1.5">
                  <span
                    className={`text-4xl font-extrabold tracking-[-0.05em] ${overallMeta.text}`}
                  >
                    {overallScore ?? "—"}
                  </span>

                  <span className="text-xs font-semibold text-[#99978f]">
                    / 100
                  </span>
                </div>
              </div>

              {overallScore !== null && (
                <span
                  className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${overallMeta.track} ${overallMeta.text}`}
                >
                  {overallMeta.label}
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default PerformanceSummary;