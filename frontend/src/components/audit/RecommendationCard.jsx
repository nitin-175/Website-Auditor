import {
  ArrowUpRight,
  Lightbulb,
} from "lucide-react";

function extractUrl(text = "") {
  const match = text.match(/https?:\/\/[^\s)\]]+/);
  return match ? match[0] : null;
}

function cleanUrl(url) {
  if (!url) return null;

  return url.replace(/[.,;]+$/, "");
}

function RecommendationCard({
  title,
  description,
  priority,
}) {
  const priorityStyles = {
    High: "bg-red-50 text-red-600",
    Medium: "bg-amber-50 text-amber-600",
    Low: "bg-blue-50 text-blue-600",
  };

  const recommendationUrl = cleanUrl(extractUrl(description));

  const handleViewRecommendation = () => {
    if (recommendationUrl) {
      window.open(
        recommendationUrl,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  return (
    <article
      className="group min-w-0 max-w-full overflow-hidden rounded-2xl border border-[#eeeafd] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f3e8ff] text-[#7c3aed]">
          <Lightbulb size={18} />
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
            priorityStyles[priority] || priorityStyles.Low
          }`}
        >
          {priority}
        </span>
      </div>

      <h3 className="mt-5 break-words text-sm font-bold text-[#181827]">
        {title}
      </h3>

      <p className="mt-2 max-w-full break-words text-sm leading-6 text-gray-500 [overflow-wrap:anywhere]">
        {description}
      </p>

      <button
        type="button"
        onClick={handleViewRecommendation}
        disabled={!recommendationUrl}
        className={`mt-5 inline-flex items-center gap-1.5 text-xs font-semibold ${
          recommendationUrl
            ? "cursor-pointer text-[#7c3aed] hover:text-[#6d28d9]"
            : "cursor-not-allowed text-gray-400"
        }`}
      >
        View recommendation
        <ArrowUpRight size={14} />
      </button>
    </article>
  );
}

export default RecommendationCard;