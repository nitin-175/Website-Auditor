import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Download,
  ExternalLink,
  RotateCcw,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import ScoreOverview from "../components/audit/ScoreOverview";
import CoreWebVitalsPanel from "../components/audit/CoreWebVitalsPanel";
import IssueList from "../components/audit/IssueList";
import RecommendationCard from "../components/audit/RecommendationCard";
import auditService from "../services/auditService";
import authService from "../services/authService";
import AuditProgress from "../components/audit/AuditProgress";
import AuditStatus from "../components/audit/AuditStatus";

function getVitalStatus(type, value) {
  if (value === null || value === undefined) {
    return "unknown";
  }

  switch (type) {
    case "lcp":
      if (value <= 2500) return "good";
      if (value <= 4000) return "needs-improvement";
      return "poor";

    case "inp":
      if (value <= 200) return "good";
      if (value <= 500) return "needs-improvement";
      return "poor";

    case "cls":
      if (value <= 0.1) return "good";
      if (value <= 0.25) return "needs-improvement";
      return "poor";

    case "fcp":
      if (value <= 1800) return "good";
      if (value <= 3000) return "needs-improvement";
      return "poor";

    default:
      return "unknown";
  }
}

function formatVitalValue(type, value) {
  if (value === null || value === undefined) {
    return "N/A";
  }

  if (type === "cls") {
    return Number(value).toFixed(2);
  }

  if (type === "lcp" || type === "fcp") {
    return `${(Number(value) / 1000).toFixed(2)} s`;
  }

  if (type === "inp") {
    return `${Math.round(Number(value))} ms`;
  }

  return String(value);
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "N/A";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleString();
}

function getFirstName(name = "User") {
  return name.trim().split(/\s+/)[0] || "User";
}

function Report() {
  const { auditId } = useParams();

  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const storedUser = authService.getStoredUser();
  const userName = storedUser?.name || "User";

  useEffect(() => {
    let mounted = true;
    let pollTimer;

    const loadAudit = async () => {
      try {
        setError("");

        const statusData = await auditService.getAuditStatus(auditId);
        const status = String(statusData?.status || "").toUpperCase();

        if (status === "PENDING" || status === "RUNNING") {
          if (mounted) {
            setLoading(true);
            pollTimer = window.setTimeout(loadAudit, 2000);
          }
          return;
        }

        if (status === "FAILED" || status === "CANCELLED") {
          throw new Error(`Audit ${status.toLowerCase()}.`);
        }

        const data = await auditService.getAudit(auditId);

        if (mounted) {
          setAudit(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to load audit report:", error);

        if (mounted) {
          setLoading(false);
          setError(
            error.response?.data?.message ||
              error.message ||
              "Unable to load the audit report.",
          );
        }
      }
    };

    if (auditId) {
      loadAudit();
    } else {
      setError("Invalid audit ID.");
      setLoading(false);
    }

    return () => {
      mounted = false;

      if (pollTimer) {
        window.clearTimeout(pollTimer);
      }
    };
  }, [auditId]);

  if (loading) {
    return (
      <DashboardLayout userName={userName}>
        <div className="mx-auto max-w-4xl space-y-5">
          <AuditProgress
            url={audit?.url || "Preparing your website..."}
            device={audit?.device || "desktop"}
          />

          <AuditStatus state="running" onCancel={() => {}} />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !audit) {
    return (
      <DashboardLayout userName={userName}>
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-[#f1c7c2] bg-white p-8 text-center shadow-[0_10px_30px_rgba(23,32,51,0.05)] sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff0ed] text-[#e85d4f]">
              <span className="text-xl font-extrabold">!</span>
            </div>

            <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[#e85d4f]">
              Report unavailable
            </p>

            <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-[#172033]">
              Unable to load report
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#77766f]">
              {error || "Audit report not found."}
            </p>

            <Link
              to="/app/dashboard"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#172033] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#29344a]"
            >
              <ArrowLeft size={16} />
              Back to dashboard
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const scores = {
    performance: Number(audit.scores?.performance ?? 0),
    accessibility: Number(audit.scores?.accessibility ?? 0),
    bestPractices: Number(audit.scores?.bestPractices ?? 0),
    seo: Number(audit.scores?.seo ?? 0),
  };

  const vitals = {
    lcp: {
      label: "Largest Contentful Paint",
      value: formatVitalValue("lcp", audit.vitals?.lcpMs),
      status: getVitalStatus("lcp", audit.vitals?.lcpMs),
    },
    inp: {
      label: "Interaction to Next Paint",
      value: formatVitalValue("inp", audit.vitals?.inpMs),
      status: getVitalStatus("inp", audit.vitals?.inpMs),
    },
    cls: {
      label: "Cumulative Layout Shift",
      value: formatVitalValue("cls", audit.vitals?.cls),
      status: getVitalStatus("cls", audit.vitals?.cls),
    },
    fcp: {
      label: "First Contentful Paint",
      value: formatVitalValue("fcp", audit.vitals?.fcpMs),
      status: getVitalStatus("fcp", audit.vitals?.fcpMs),
    },
  };

  const issues = (audit.issues || []).map((issue) => ({
    id: issue.id,
    title: issue.title,
    description: issue.description,
    severity: issue.severity,
    category: issue.category,
  }));

  const recommendations = (audit.recommendations || []).map(
    (recommendation) => ({
      id: recommendation.id,
      title: recommendation.title,
      description: recommendation.description,
      priority: recommendation.priority,
    }),
  );

  const overallScore = Number(audit.overallScore ?? 0);

  const issueCounts = {
    critical: issues.filter(
      (issue) => String(issue.severity).toUpperCase() === "CRITICAL",
    ).length,
    high: issues.filter(
      (issue) => String(issue.severity).toUpperCase() === "HIGH",
    ).length,
    medium: issues.filter(
      (issue) => String(issue.severity).toUpperCase() === "MEDIUM",
    ).length,
    low: issues.filter(
      (issue) => String(issue.severity).toUpperCase() === "LOW",
    ).length,
  };

  return (
    <DashboardLayout userName={userName}>
      <div className="space-y-7">
        {/* Header */}
        <section className="rounded-3xl border border-[#dedbd1] bg-white p-5 shadow-[0_10px_30px_rgba(23,32,51,0.04)] sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <Link
                to="/app/history"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6d6b65] transition hover:text-[#4f46e5]"
              >
                <ArrowLeft size={14} />
                Back to history
              </Link>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#eef0ff] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#4f46e5]">
                  Audit report
                </span>

                <span className="rounded-full bg-[#e9f8f5] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#168f82]">
                  {String(audit.status || "COMPLETED").toLowerCase()}
                </span>
              </div>

              <h1 className="mt-3 break-words text-2xl font-extrabold tracking-[-0.04em] text-[#172033] sm:text-3xl lg:text-4xl">
                Website Audit Report
              </h1>

              <a
                href={audit.url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex max-w-full items-center gap-1.5 break-all text-sm font-medium text-[#65645f] transition hover:text-[#4f46e5]"
              >
                <span className="break-all">{audit.url}</span>
                <ExternalLink className="shrink-0" size={14} />
              </a>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:items-center">
              <div className="rounded-2xl bg-[#f7f6f0] px-4 py-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#77766f]">
                  <CalendarDays size={14} />
                  Audited
                </div>

                <p className="mt-1 text-sm font-bold text-[#172033]">
                  {formatDate(audit.completedAt || audit.createdAt)}
                </p>

                <p className="mt-1 text-xs font-semibold capitalize text-[#94928a]">
                  {String(audit.device || "desktop").toLowerCase()} audit
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#dcd9d0] bg-white px-4 py-3 text-xs font-bold text-[#55544f] transition hover:border-[#4f46e5] hover:text-[#4f46e5]"
                >
                  <RotateCcw size={15} />
                  Re-run
                </button>

                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#172033] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#29344a]"
                >
                  <Download size={15} />
                  Export
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Executive summary */}
        <section>
          <div className="mb-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#4f46e5]">
              Executive summary
            </p>
            <h2 className="mt-1 text-xl font-extrabold tracking-[-0.03em] text-[#172033]">
              What needs attention
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-[#f1c7c2] bg-[#fff8f6] p-4">
              <p className="text-xs font-bold text-[#a34d43]">Critical</p>
              <p className="mt-2 text-2xl font-extrabold text-[#d65347]">
                {issueCounts.critical}
              </p>
            </div>

            <div className="rounded-2xl border border-[#f1c7c2] bg-white p-4">
              <p className="text-xs font-bold text-[#a34d43]">High</p>
              <p className="mt-2 text-2xl font-extrabold text-[#d65347]">
                {issueCounts.high}
              </p>
            </div>

            <div className="rounded-2xl border border-[#ead8a7] bg-[#fffaf0] p-4">
              <p className="text-xs font-bold text-[#a07819]">Medium</p>
              <p className="mt-2 text-2xl font-extrabold text-[#b98512]">
                {issueCounts.medium}
              </p>
            </div>

            <div className="rounded-2xl border border-[#c9e8e3] bg-[#f3fbf9] p-4">
              <p className="text-xs font-bold text-[#168f82]">Low</p>
              <p className="mt-2 text-2xl font-extrabold text-[#168f82]">
                {issueCounts.low}
              </p>
            </div>
          </div>
        </section>

        {/* Score overview */}
        <ScoreOverview overallScore={overallScore} scores={scores} />

        {/* Core Web Vitals */}
        <CoreWebVitalsPanel vitals={vitals} />

        {/* Issues */}
        <IssueList issues={issues} />

        {/* Recommendations */}
        <section>
          <div className="mb-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#19a999]">
              Action plan
            </p>

            <h2 className="mt-1 text-xl font-extrabold tracking-[-0.03em] text-[#172033]">
              Recommendations
            </h2>

            <p className="mt-1 text-sm text-[#77766f]">
              Practical improvements based on the audit findings.
            </p>
          </div>

          {recommendations.length === 0 ? (
            <div className="rounded-2xl border border-[#dedbd1] bg-white p-7 text-sm text-[#77766f]">
              No recommendations were generated for this audit.
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-3">
              {recommendations.map((recommendation) => (
                <RecommendationCard
                  key={recommendation.id}
                  {...recommendation}
                />
              ))}
            </div>
          )}
        </section>

        {/* Closing note */}
        <section className="rounded-3xl border border-[#c9e8e3] bg-[#f3fbf9] p-6 sm:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-extrabold text-[#172033]">
                Start with the highest-impact issues.
              </p>
              <p className="mt-1 text-sm leading-6 text-[#5f716e]">
                Fixing critical and high-priority findings first usually gives
                you the clearest improvement path.
              </p>
            </div>

            <Link
              to="/app/new-audit"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#19a999] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#168f82]"
            >
              Run another audit
            </Link>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

export default Report;
