import {
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";

import SeverityBadge from "./SeverityBadge";

function IssueCard({
  issue,
}) {
  const [expanded, setExpanded] =
    useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-[#eeeafd]">
      <button
        type="button"
        onClick={() =>
          setExpanded(
            (previous) => !previous
          )
        }
        className="flex w-full items-center gap-4 p-4 text-left transition hover:bg-[#faf9ff]"
        aria-expanded={expanded}
      >
        <SeverityBadge
          severity={issue.severity}
        />

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[#181827]">
            {issue.title}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            {issue.category}
          </p>
        </div>

        <ChevronDown
          size={17}
          className={`shrink-0 text-gray-400 transition-transform ${
            expanded
              ? "rotate-180"
              : ""
          }`}
        />
      </button>

      {expanded && (
        <div className="border-t border-[#eeeafd] bg-[#faf9ff] px-4 py-4">
          <p className="text-sm leading-6 text-gray-600">
            {issue.description}
          </p>

          <button
            type="button"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#7c3aed]"
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