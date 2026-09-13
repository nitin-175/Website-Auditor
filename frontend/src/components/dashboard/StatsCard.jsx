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
}) {
  const iconMap = {
    "Total Audits": SearchCheck,
    "Average Score": Target,
    "Issues Found": Activity,
    Websites: Globe2,
  };

  const Icon = iconMap[title] || Activity;

  const isPositive = trendType === "positive";

  return (
    <article className="rounded-2xl border border-[#eeeafd] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3e8ff] text-[#7c3aed]">
          <Icon size={19} />
        </div>

        {trend && (
          <div
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${
              isPositive
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight size={12} />
            ) : (
              <ArrowDownRight size={12} />
            )}

            {trend}
          </div>
        )}
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-gray-500">
          {title}
        </p>

        <p className="mt-1 text-2xl font-bold tracking-tight text-[#181827]">
          {value}
        </p>

        <p className="mt-1 text-xs text-gray-400">
          {description}
        </p>
      </div>
    </article>
  );
}

export default StatsCard;