import {
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router";

function getScoreStyle(score) {
  if (score === null || score === undefined) {
    return "bg-gray-100 text-gray-500";
  }

  if (score >= 90) {
    return "bg-emerald-50 text-emerald-600";
  }

  if (score >= 70) {
    return "bg-amber-50 text-amber-600";
  }

  return "bg-red-50 text-red-600";
}

function getStatusStyle(status) {
  const normalizedStatus = String(status || "").toLowerCase();

  if (normalizedStatus === "completed") {
    return "bg-emerald-50 text-emerald-600";
  }

  if (normalizedStatus === "running" || normalizedStatus === "pending") {
    return "bg-amber-50 text-amber-600";
  }

  if (normalizedStatus === "failed") {
    return "bg-red-50 text-red-600";
  }

  return "bg-gray-100 text-gray-500";
}

function AuditHistoryRow({
  audit,
}) {
  return (
    <>
      {/* Desktop */}
      <div className="hidden border-b border-[#f1eef8] px-4 py-4 last:border-0 md:grid md:grid-cols-[minmax(0,1.7fr)_80px_100px_100px_110px_64px] md:items-center md:gap-3 lg:px-6 lg:grid-cols-[minmax(0,1.7fr)_100px_120px_120px_120px_80px] lg:gap-4">
        {/* Website */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f3e8ff] text-xs font-bold text-[#7c3aed]">
            {audit.website
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#181827]">
              {audit.website}
            </p>

            <p className="mt-0.5 text-[11px] text-gray-400">
              {audit.issues === null || audit.issues === undefined
                ? "Issue count unavailable"
                : `${audit.issues} issue${audit.issues === 1 ? "" : "s"} found`}
            </p>
          </div>
        </div>

        {/* Score */}
        <div>
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${getScoreStyle(
              audit.score
            )}`}
          >
            {audit.score ?? "—"}
          </span>
        </div>

        {/* Status */}
        <div>
          <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusStyle(audit.status)}`}>
            {audit.status}
          </span>
        </div>

        {/* Device */}
        <p className="text-xs font-medium text-gray-500">
          {audit.device}
        </p>

        {/* Date */}
        <p className="text-xs text-gray-500">
          {audit.date}
        </p>

        {/* Action */}
        <div className="text-right">
          <Link
            to={`/app/report/${audit.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#7c3aed] hover:text-[#6d28d9]"
          >
            View
            <ExternalLink size={13} />
          </Link>
        </div>
      </div>

      {/* Mobile */}
      <div className="border-b border-[#f1eef8] p-5 last:border-0 md:hidden">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f3e8ff] text-xs font-bold text-[#7c3aed]">
              {audit.website
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#181827]">
                {audit.website}
              </p>

              <p className="mt-1 text-[11px] text-gray-400">
                {audit.date}
              </p>
            </div>
          </div>

          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${getScoreStyle(
              audit.score
            )}`}
          >
            {audit.score ?? "—"}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusStyle(audit.status)}`}>
              {audit.status}
            </span>

            <span className="ml-2 text-xs text-gray-400">
              {audit.device}
            </span>
          </div>

          <Link
            to={`/app/report/${audit.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#7c3aed]"
          >
            View Report
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </>
  );
}

export default AuditHistoryRow;