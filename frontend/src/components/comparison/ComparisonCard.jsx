import {
  Accessibility,
  Gauge,
  SearchCheck,
  ShieldCheck,
} from "lucide-react";

function ComparisonCard({
  audit,
  label,
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
    <section className="rounded-2xl border border-[#eeeafd] bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <span className="rounded-full bg-[#f3e8ff] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#7c3aed]">
            {label}
          </span>

          <h2 className="mt-3 truncate text-lg font-bold text-[#181827]">
            {audit.website}
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            {audit.date} · {audit.device}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-xs text-gray-400">
            Overall
          </p>

          <p className="mt-1 text-3xl font-extrabold text-[#7c3aed]">
            {audit.overallScore}
          </p>
        </div>
      </div>

      {/* Category Scores */}
      <div className="mt-7 space-y-4">
        {categories.map((category) => {
          const Icon = category.icon;
          const score = audit.scores[category.key];

          return (
            <div key={category.key}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#faf9ff] text-[#7c3aed]">
                    <Icon size={15} />
                  </div>

                  <span className="text-sm font-medium text-gray-600">
                    {category.label}
                  </span>
                </div>

                <span className="text-sm font-bold text-[#181827]">
                  {score}
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#eeeafd]">
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
    </section>
  );
}

export default ComparisonCard;