function SeverityBadge({
  severity,
}) {
  const styles = {
    high: {
      label: "High",
      classes:
        "bg-red-50 text-red-600 border-red-100",
    },

    medium: {
      label: "Medium",
      classes:
        "bg-amber-50 text-amber-600 border-amber-100",
    },

    low: {
      label: "Low",
      classes:
        "bg-blue-50 text-blue-600 border-blue-100",
    },
  };

  const current =
    styles[severity] || styles.low;

  return (
    <span
      className={`inline-flex shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold ${current.classes}`}
    >
      {current.label}
    </span>
  );
}

export default SeverityBadge;