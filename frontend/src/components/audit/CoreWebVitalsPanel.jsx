import { CheckCircle2, Gauge, Zap } from "lucide-react";
import MetricCard from "./MetricCard";

function CoreWebVitalsPanel({ vitals }) {
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

  const hasPoorMetric = vitalItems.some(
    (metric) => metric.status === "poor"
  );

  const hasWarningMetric = vitalItems.some(
    (metric) => metric.status === "needs-improvement"
  );

  const overallStatus = hasPoorMetric
    ? "Needs Attention"
    : hasWarningMetric
      ? "Needs Improvement"
      : "Good";

  const statusClasses = hasPoorMetric
    ? "bg-[#fff0ed] text-[#d65347]"
    : hasWarningMetric
      ? "bg-[#fff6df] text-[#a07819]"
      : "bg-[#e9f8f5] text-[#168f82]";

  return (
    <section className="rounded-3xl border border-[#dedbd1] bg-white p-5 shadow-[0_10px_30px_rgba(23,32,51,0.04)] sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#4f46e5]">
            User experience
          </p>

          <h2 className="mt-1 text-xl font-extrabold tracking-[-0.03em] text-[#172033]">
            Core Web Vitals
          </h2>

          <p className="mt-1 text-sm text-[#77766f]">
            Key metrics that describe the real-world experience of visitors.
          </p>
        </div>

        <div
          className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold ${statusClasses}`}
        >
          <CheckCircle2 size={13} />
          {overallStatus}
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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