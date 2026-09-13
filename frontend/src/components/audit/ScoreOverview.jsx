import {
  Accessibility,
  Gauge,
  SearchCheck,
  ShieldCheck,
} from "lucide-react";

import ScoreGauge from "./ScoreGauge";

function ScoreOverview({
  overallScore,
  scores,
}) {
  const categories = [
    {
      key: "performance",
      label: "Performance",
      icon: Gauge,
    },
    {
      key: "accessibility",
      label: "Accessibility",
      icon: Accessibility,
    },
    {
      key: "bestPractices",
      label: "Best Practices",
      icon: ShieldCheck,
    },
    {
      key: "seo",
      label: "SEO",
      icon: SearchCheck,
    },
  ];

  return (
    <section className="rounded-2xl border border-[#eeeafd] bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-col gap-7 lg:flex-row lg:items-center">
        {/* Overall Score */}
        <div className="flex shrink-0 flex-col items-center border-b border-[#eeeafd] pb-7 lg:w-52 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
          <p className="text-sm font-semibold text-gray-500">
            Overall Score
          </p>

          <div className="mt-4">
            <ScoreGauge score={overallScore} size="large" />
          </div>

          <p className="mt-3 text-xs text-gray-400">
            Overall audit score
          </p>
        </div>

        {/* Category Scores */}
        <div className="grid flex-1 gap-4 sm:grid-cols-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const score = scores[category.key];

            return (
              <div
                key={category.key}
                className="rounded-xl bg-[#faf9ff] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f3e8ff] text-[#7c3aed]">
                      <Icon size={17} />
                    </div>

                    <span className="truncate text-sm font-semibold text-gray-600">
                      {category.label}
                    </span>
                  </div>

                  <span className="text-lg font-bold text-[#181827]">
                    {score}
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e9e4f7]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#7c3aed] to-[#db2777]"
                    style={{
                      width: `${score}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ScoreOverview;