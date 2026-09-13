import {
  Accessibility,
  Gauge,
  SearchCheck,
  ShieldCheck,
} from "lucide-react";

function PerformanceSummary({ audit }) {
  const scores = audit?.scores;

  const categories = [
    {
      label: "Performance",
      score: scores?.performance,
      icon: Gauge,
    },
    {
      label: "Accessibility",
      score: scores?.accessibility,
      icon: Accessibility,
    },
    {
      label: "Best Practices",
      score: scores?.bestPractices,
      icon: ShieldCheck,
    },
    {
      label: "SEO",
      score: scores?.seo,
      icon: SearchCheck,
    },
  ];

  const availableScores = categories
    .map((category) => category.score)
    .filter(
      (score) =>
        score !== null &&
        score !== undefined
    )
    .map(Number);

  const calculatedOverallScore =
    availableScores.length > 0
      ? Math.round(
          availableScores.reduce(
            (sum, score) => sum + score,
            0
          ) / availableScores.length
        )
      : null;

  return (
    <section className="rounded-2xl border border-[#eeeafd] bg-white p-5 shadow-sm sm:p-6">
      <div>
        <h2 className="text-base font-bold text-[#181827]">
          Performance Summary
        </h2>

        <p className="mt-1 text-xs text-gray-400">
          Latest audit category scores
        </p>
      </div>

      {!audit ? (
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            No completed audit data available yet.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 space-y-5">
            {categories.map((category) => {
              const Icon = category.icon;

              const score =
                category.score !== null &&
                category.score !== undefined
                  ? Math.round(Number(category.score))
                  : null;

              return (
                <div key={category.label}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f3e8ff] text-[#7c3aed]">
                        <Icon size={15} />
                      </div>

                      <span className="truncate text-sm font-medium text-gray-600">
                        {category.label}
                      </span>
                    </div>

                    <span className="text-sm font-bold text-[#181827]">
                      {score !== null ? score : "—"}
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#eeeafd]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#7c3aed] to-[#db2777]"
                      style={{
                        width:
                          score !== null
                            ? `${Math.max(
                                0,
                                Math.min(100, score)
                              )}%`
                            : "0%",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-xl bg-[#faf9ff] p-4">
            <p className="text-xs text-gray-400">
              Overall score
            </p>

            <div className="mt-1 flex items-end gap-2">
              <span className="text-3xl font-extrabold text-[#7c3aed]">
                {audit.overallScore !== null &&
                audit.overallScore !== undefined
                  ? Math.round(Number(audit.overallScore))
                  : calculatedOverallScore ?? "—"}
              </span>

              <span className="pb-1 text-xs text-gray-400">
                / 100
              </span>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default PerformanceSummary;