import {
  ArrowRight,
  ExternalLink,
  Globe2,
} from "lucide-react";
import { Link } from "react-router-dom";

function getScoreMeta(score) {
  if (score === null || score === undefined) {
    return {
      background: "bg-[#f0eee8]",
      text: "text-[#77756e]",
    };
  }

  const numericScore = Number(score);

  if (numericScore >= 90) {
    return {
      background: "bg-[#e8f7f4]",
      text: "text-[#128f82]",
    };
  }

  if (numericScore >= 70) {
    return {
      background: "bg-[#fff6df]",
      text: "text-[#ad7812]",
    };
  }

  return {
    background: "bg-[#fff0ed]",
    text: "text-[#d95b4f]",
  };
}

function getStatusMeta(status) {
  switch (status?.toUpperCase()) {
    case "COMPLETED":
      return {
        label: "Completed",
        background: "bg-[#e8f7f4]",
        text: "text-[#128f82]",
        dot: "bg-[#19a999]",
      };

    case "FAILED":
      return {
        label: "Failed",
        background: "bg-[#fff0ed]",
        text: "text-[#d95b4f]",
        dot: "bg-[#f06f61]",
      };

    case "RUNNING":
    case "IN_PROGRESS":
      return {
        label: "Running",
        background: "bg-[#eef0ff]",
        text: "text-[#4f46e5]",
        dot: "bg-[#4f46e5]",
      };

    case "PENDING":
      return {
        label: "Pending",
        background: "bg-[#fff6df]",
        text: "text-[#ad7812]",
        dot: "bg-[#e0a52b]",
      };

    default:
      return {
        label: "Unknown",
        background: "bg-[#f0eee8]",
        text: "text-[#77756e]",
        dot: "bg-[#99978f]",
      };
  }
}

function formatWebsite(url) {
  if (!url) {
    return "Unknown website";
  }

  try {
    return new URL(url).hostname.replace(/^www\./, "");
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
        new Date(a.createdAt || 0),
    )
    .slice(0, 5);

  return (
    <section className="overflow-hidden rounded-2xl border border-[#ddd9ce] bg-white shadow-[0_8px_30px_rgba(23,32,51,0.04)]">
      <div className="flex flex-col gap-3 border-b border-[#e5e2d9] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#f06f61]" />
            <h2 className="text-base font-extrabold text-[#172033]">
              Recent audits
            </h2>
          </div>

          <p className="mt-1.5 text-xs text-[#8b8981]">
            Your latest website activity
          </p>
        </div>

        <Link
          to="/app/history"
          className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#ddd9ce] px-3 py-1.5 text-xs font-bold text-[#4f46e5] transition hover:border-[#c8c4b9] hover:bg-[#f7f6f0]"
        >
          View all
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="border-b border-[#e5e2d9] bg-[#faf9f4]">
              <th className="px-6 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#8e8c84]">
                Website
              </th>

              <th className="px-6 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#8e8c84]">
                Score
              </th>

              <th className="px-6 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#8e8c84]">
                Status
              </th>

              <th className="px-6 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#8e8c84]">
                Device
              </th>

              <th className="px-6 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#8e8c84]">
                Date
              </th>

              <th className="px-6 py-3 text-right text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#8e8c84]">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {recentAudits.map((audit) => {
              const website = formatWebsite(audit.url);
              const score = audit.overallScore;
              const scoreMeta = getScoreMeta(score);
              const statusMeta = getStatusMeta(audit.status);

              return (
                <tr
                  key={audit.id}
                  className="border-b border-[#efede6] last:border-0 transition hover:bg-[#fbfaf6]"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eef0ff] text-[#4f46e5]">
                        <Globe2 size={16} />
                      </div>

                      <div className="min-w-0">
                        <p className="max-w-[220px] truncate text-sm font-bold text-[#293247]">
                          {website}
                        </p>

                        <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.05em] text-[#9a988f]">
                          Website audit
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex min-w-[42px] justify-center rounded-full px-2.5 py-1.5 text-xs font-extrabold ${scoreMeta.background} ${scoreMeta.text}`}
                    >
                      {score !== null && score !== undefined
                        ? Math.round(Number(score))
                        : "—"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-bold ${statusMeta.background} ${statusMeta.text}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${statusMeta.dot}`}
                      />
                      {statusMeta.label}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-xs font-semibold text-[#68665f]">
                    {audit.device || "—"}
                  </td>

                  <td className="px-6 py-4 text-xs font-medium text-[#77756e]">
                    {formatDate(audit.createdAt)}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/app/report/${audit.id}`}
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-[#4f46e5] transition hover:bg-[#eef0ff]"
                    >
                      View
                      <ExternalLink size={12} />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-[#efede6] md:hidden">
        {recentAudits.map((audit) => {
          const website = formatWebsite(audit.url);
          const score = audit.overallScore;
          const scoreMeta = getScoreMeta(score);
          const statusMeta = getStatusMeta(audit.status);

          return (
            <div key={audit.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eef0ff] text-[#4f46e5]">
                    <Globe2 size={15} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#293247]">
                      {website}
                    </p>

                    <p className="mt-0.5 text-[10px] text-[#96948c]">
                      {formatDate(audit.createdAt)}
                    </p>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1.5 text-xs font-extrabold ${scoreMeta.background} ${scoreMeta.text}`}
                >
                  {score !== null && score !== undefined
                    ? Math.round(Number(score))
                    : "—"}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-bold ${statusMeta.background} ${statusMeta.text}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${statusMeta.dot}`}
                  />
                  {statusMeta.label}
                </span>

                <Link
                  to={`/app/report/${audit.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#4f46e5]"
                >
                  View report
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