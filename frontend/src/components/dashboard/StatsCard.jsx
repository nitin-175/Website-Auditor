import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Globe2,
  SearchCheck,
  Target,
} from "lucide-react";

function StatsCard({
  title,
  value,
  description,
  trend,
  trendType = "positive",
  accent = "indigo",
  suffix = "",
  loading = false,
}) {
  const iconMap = {
    "Total Audits": SearchCheck,
    "Average Score": Target,
    "Issues Found": Activity,
    Websites: Globe2,
  };

  const accentMap = {
    indigo: {
      icon: "bg-[#eef0ff] text-[#4f46e5]",
      bar: "bg-[#4f46e5]",
    },
    teal: {
      icon: "bg-[#e8f7f4] text-[#128f82]",
      bar: "bg-[#19a999]",
    },
    coral: {
      icon: "bg-[#fff0ed] text-[#e15f52]",
      bar: "bg-[#f06f61]",
    },
    amber: {
      icon: "bg-[#fff6df] text-[#b47b14]",
      bar: "bg-[#e0a52b]",
    },
  };

  const Icon = iconMap[title] || Activity;
  const colors = accentMap[accent] || accentMap.indigo;
  const isPositive = trendType === "positive";

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-[#ddd9ce] bg-white p-5 shadow-[0_6px_24px_rgba(23,32,51,0.035)] transition duration-300 hover:-translate-y-0.5 hover:border-[#cbc7bb] hover:shadow-[0_12px_30px_rgba(23,32,51,0.07)]">
      <div
        className={`absolute left-0 top-0 h-1 w-full ${colors.bar} opacity-80`}
      />

      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors.icon}`}
        >
          <Icon size={18} strokeWidth={2} />
        </div>

        {trend && !loading && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
              isPositive
                ? "bg-[#e8f7f4] text-[#128f82]"
                : "bg-[#fff0ed] text-[#d95b4f]"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight size={12} />
            ) : (
              <ArrowDownRight size={12} />
            )}
            {trend}
          </span>
        )}
      </div>

      <div className="mt-5">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#8a8880]">
          {title}
        </p>

        {loading ? (
          <div className="mt-2 h-9 w-20 animate-pulse rounded-lg bg-[#eeece4]" />
        ) : (
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-[30px] font-extrabold tracking-[-0.04em] text-[#172033]">
              {value}
            </span>

            {suffix && (
              <span className="text-xs font-semibold text-[#98968e]">
                {suffix}
              </span>
            )}
          </div>
        )}

        <p className="mt-1.5 text-xs leading-5 text-[#929088]">
          {description}
        </p>
      </div>
    </article>
  );
}

export default StatsCard;