function SeverityBadge({ severity }) {
  const normalizedSeverity = String(severity || "LOW").toUpperCase();

  const styles = {
    CRITICAL: {
      label: "Critical",
      classes: "bg-[#ffe8e5] text-[#c84438] border-[#f1c7c2]",
    },
    HIGH: {
      label: "High",
      classes: "bg-[#fff0ed] text-[#d65347] border-[#f1c7c2]",
    },
    MEDIUM: {
      label: "Medium",
      classes: "bg-[#fff6df] text-[#a07819] border-[#ead8a7]",
    },
    LOW: {
      label: "Low",
      classes: "bg-[#e9f8f5] text-[#168f82] border-[#c9e8e3]",
    },
  };

  const current = styles[normalizedSeverity] || styles.LOW;

  return (
    <span
      className={`inline-flex shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-extrabold ${current.classes}`}
    >
      {current.label}
    </span>
  );
}

export default SeverityBadge;