import { ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router";

function getScoreClass(score) {
  if (score === null || score === undefined) {
    return "bg-gray-100 text-gray-500";
  }

  const numericScore = Number(score);

  if (numericScore >= 90) {
    return "bg-emerald-50 text-emerald-600";
  }

  if (numericScore >= 70) {
    return "bg-amber-50 text-amber-600";
  }

  return "bg-red-50 text-red-600";
}

function getStatusClass(status) {
  switch (status?.toUpperCase()) {
    case "COMPLETED":
      return "bg-emerald-50 text-emerald-600";

    case "FAILED":
      return "bg-red-50 text-red-600";

    case "RUNNING":
    case "IN_PROGRESS":
      return "bg-blue-50 text-blue-600";

    case "PENDING":
      return "bg-amber-50 text-amber-600";

    default:
      return "bg-gray-100 text-gray-500";
  }
}

function formatStatus(status) {
  if (!status) {
    return "Unknown";
  }

  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatWebsite(url) {
  if (!url) {
    return "Unknown website";
  }

  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function formatDate(date) {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function RecentAudits({ audits = [] }) {
  const recentAudits = [...audits]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )
    .slice(0, 5);

  return (
    <section className="rounded-2xl border border-[#eeeafd] bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-[#eeeafd] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-base font-bold text-[#181827]">
            Recent Audits
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Your latest website audits
          </p>
        </div>

        <Link
          to="/app/history"
          className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-[#7c3aed] hover:text-[#6d28d9]"
        >
          View all
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[650px]">
          <thead>
            <tr className="border-b border-[#eeeafd] bg-[#faf9ff]">
              <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-gray-400">
                Website
              </th>

              <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-gray-400">
                Score
              </th>

              <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-gray-400">
                Status
              </th>

              <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-gray-400">
                Date
              </th>

              <th className="px-6 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-gray-400">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {recentAudits.map((audit) => {
              const website = formatWebsite(audit.url);
              const score = audit.overallScore;

              return (
                <tr
                  key={audit.id}
                  className="border-b border-[#f1eef8] last:border-0"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f3e8ff] text-xs font-bold text-[#7c3aed]">
                        {website.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-[#181827]">
                          {website}
                        </p>

                        <p className="text-[11px] text-gray-400">
                          {audit.device || "Website"} audit
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${getScoreClass(
                        score
                      )}`}
                    >
                      {score !== null && score !== undefined
                        ? Math.round(Number(score))
                        : "—"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                        audit.status
                      )}`}
                    >
                      {formatStatus(audit.status)}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(audit.createdAt)}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/app/report/${audit.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#7c3aed] hover:text-[#6d28d9]"
                    >
                      View
                      <ExternalLink size={13} />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-[#f1eef8] md:hidden">
        {recentAudits.map((audit) => {
          const website = formatWebsite(audit.url);
          const score = audit.overallScore;

          return (
            <div
              key={audit.id}
              className="p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f3e8ff] text-xs font-bold text-[#7c3aed]">
                    {website.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#181827]">
                      {website}
                    </p>

                    <p className="mt-0.5 text-[11px] text-gray-400">
                      {formatDate(audit.createdAt)}
                    </p>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${getScoreClass(
                    score
                  )}`}
                >
                  {score !== null && score !== undefined
                    ? Math.round(Number(score))
                    : "—"}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                    audit.status
                  )}`}
                >
                  {formatStatus(audit.status)}
                </span>

                <Link
                  to={`/app/report/${audit.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#7c3aed]"
                >
                  View Report
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default RecentAudits;