function MetricCard({
  label,
  value,
  status = "good",
  icon: Icon,
}) {
  const statusStyles = {
    good: {
      badge: "bg-[#e9f8f5] text-[#168f82]",
      icon: "bg-[#e9f8f5] text-[#168f82]",
      border: "border-[#c9e8e3]",
      text: "Good",
    },
    "needs-improvement": {
      badge: "bg-[#fff6df] text-[#a07819]",
      icon: "bg-[#fff6df] text-[#a07819]",
      border: "border-[#ead8a7]",
      text: "Needs Improvement",
    },
    warning: {
      badge: "bg-[#fff6df] text-[#a07819]",
      icon: "bg-[#fff6df] text-[#a07819]",
      border: "border-[#ead8a7]",
      text: "Needs Improvement",
    },
    poor: {
      badge: "bg-[#fff0ed] text-[#d65347]",
      icon: "bg-[#fff0ed] text-[#d65347]",
      border: "border-[#f1c7c2]",
      text: "Poor",
    },
    unknown: {
      badge: "bg-[#eeece4] text-[#77766f]",
      icon: "bg-[#eeece4] text-[#77766f]",
      border: "border-[#dedbd1]",
      text: "Unavailable",
    },
  };

  const currentStatus =
    statusStyles[status] || statusStyles.unknown;

  return (
    <div
      className={`rounded-2xl border bg-[#fbfaf5] p-4 ${currentStatus.border}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${currentStatus.icon}`}
        >
          {Icon && <Icon size={18} strokeWidth={1.8} />}
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${currentStatus.badge}`}
        >
          {currentStatus.text}
        </span>
      </div>

      <p className="mt-5 text-xs font-bold text-[#77766f]">
        {label}
      </p>

      <p className="mt-1 text-2xl font-extrabold tracking-[-0.03em] text-[#172033]">
        {value}
      </p>
    </div>
  );
}

export default MetricCard;