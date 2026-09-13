import {
  CheckCircle2,
  Gauge,
  Zap,
} from "lucide-react";

import MetricCard from "./MetricCard";

function CoreWebVitalsPanel({
  vitals,
}) {
  const vitalItems = [
    {
      key: "lcp",
      ...vitals.lcp,
      icon: Gauge,
    },
    {
      key: "inp",
      ...vitals.inp,
      icon: Zap,
    },
    {
      key: "cls",
      ...vitals.cls,
      icon: CheckCircle2,
    },
    {
      key: "fcp",
      ...vitals.fcp,
      icon: Gauge,
    },
  ];

  return (
    <section className="rounded-2xl border border-[#eeeafd] bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#181827]">
            Core Web Vitals
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Key metrics that describe the user experience.
          </p>
        </div>

        <div className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 sm:mt-0">
          <CheckCircle2 size={13} />
          Good
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {vitalItems.map((metric) => (
          <MetricCard
            key={metric.key}
            {...metric}
          />
        ))}
      </div>
    </section>
  );
}

export default CoreWebVitalsPanel;