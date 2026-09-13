function MetricCard({
  label,
  value,
  status = "good",
  icon: Icon,
}) {
  const statusStyles = {
    good: {
      badge: "bg-emerald-50 text-emerald-600",
      text: "Good",
    },

    warning: {
      badge: "bg-amber-50 text-amber-600",
      text: "Needs Improvement",
    },

    poor: {
      badge: "bg-red-50 text-red-600",
      text: "Poor",
    },
  };

  const currentStatus =
    statusStyles[status] ||
    statusStyles.good;

  return (
    <div className="rounded-xl border border-[#eeeafd] bg-[#faf9ff] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f3e8ff] text-[#7c3aed]">
          {Icon && <Icon size={17} />}
        </div>

        <span
          className={`rounded-full px-2 py-1 text-[10px] font-bold ${currentStatus.badge}`}
        >
          {currentStatus.text}
        </span>
      </div>

      <p className="mt-5 text-xs font-medium text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold tracking-tight text-[#181827]">
        {value}
      </p>
    </div>
  );
}

export default MetricCard;