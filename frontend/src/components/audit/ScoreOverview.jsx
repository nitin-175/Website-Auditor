import {
  Accessibility,
  Gauge,
  SearchCheck,
  ShieldCheck,
} from "lucide-react";
import ScoreGauge from "./ScoreGauge";

function getScoreTone(score) {
  if (score >= 90) {
    return {
      icon: "bg-[#e9f8f5] text-[#168f82]",
      track: "bg-[#e8f2ef]",
      fill: "bg-[#19a999]",
    };
  }

  if (score >= 70) {
    return {
      icon: "bg-[#fff6df] text-[#a07819]",
      track: "bg-[#f4ecd6]",
      fill: "bg-[#d59a20]",
    };
  }

  return {
    icon: "bg-[#fff0ed] text-[#d65347]",
    track: "bg-[#f6e3e0]",
    fill: "bg-[#e56a5d]",
  };
}

function ScoreOverview({ overallScore, scores }) {
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
    <section className="rounded-3xl border border-[#dedbd1] bg-white p-5 shadow-[0_10px_30px_rgba(23,32,51,0.04)] sm:p-7">
      <div className="flex flex-col gap-8 xl:flex-row xl:items-center">
        <div className="flex shrink-0 flex-col items-center border-b border-[#e5e2d9] pb-7 xl:w-56 xl:border-b-0 xl:border-r xl:pb-0 xl:pr-10">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#77766f]">
            Overall score
          </p>

          <div className="mt-4">
            <ScoreGauge score={overallScore} size="large" />
          </div>

          <p className="mt-3 max-w-[180px] text-center text-xs leading-5 text-[#96948c]">
            A combined view of your website's audit health.
          </p>
        </div>

        <div className="grid flex-1 gap-3 sm:grid-cols-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const score = Number(scores?.[category.key] ?? 0);
            const tone = getScoreTone(score);

            return (
              <div
                key={category.key}
                className="rounded-2xl border border-[#e6e3da] bg-[#fbfaf5] p-4 transition hover:border-[#cbc8be]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone.icon}`}
                    >
                      <Icon size={18} strokeWidth={1.8} />
                    </div>

                    <span className="truncate text-sm font-bold text-[#3e414a]">
                      {category.label}
                    </span>
                  </div>

                  <span className="text-xl font-extrabold tracking-tight text-[#172033]">
                    {score}
                  </span>
                </div>

                <div
                  className={`mt-4 h-2 overflow-hidden rounded-full ${tone.track}`}
                >
                  <div
                    className={`h-full rounded-full transition-all ${tone.fill}`}
                    style={{
                      width: `${Math.min(Math.max(score, 0), 100)}%`,
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