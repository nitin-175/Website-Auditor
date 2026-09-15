import { ChevronDown, ExternalLink } from "lucide-react";
import { useState } from "react";
import SeverityBadge from "./SeverityBadge";

function IssueCard({ issue }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white">
      <button
        type="button"
        onClick={() => setExpanded((previous) => !previous)}
        className="flex w-full items-start gap-4 px-5 py-4 text-left transition hover:bg-[#fbfaf5] sm:px-6"
        aria-expanded={expanded}
      >
        <SeverityBadge severity={issue.severity} />

        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold leading-5 text-[#172033]">
            {issue.title}
          </p>

          {issue.category && (
            <p className="mt-1 text-xs font-semibold text-[#96948c]">
              {issue.category}
            </p>
          )}
        </div>

        <div
          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#f4f2eb] text-[#77766f] transition ${
            expanded ? "rotate-180" : ""
          }`}
        >
          <ChevronDown size={15} />
        </div>
      </button>

      {expanded && (
        <div className="border-t border-[#e8e5dc] bg-[#fbfaf5] px-5 py-5 sm:px-6">
          <p className="text-sm leading-6 text-[#60615e]">
            {issue.description || "No additional description is available."}
          </p>

          <button
            type="button"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-extrabold text-[#4f46e5] transition hover:text-[#3730a3]"
          >
            Learn more
            <ExternalLink size={13} />
          </button>
        </div>
      )}
    </div>
  );
}

export default IssueCard;