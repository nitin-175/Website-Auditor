import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";
import ScoreOverview from "../components/audit/ScoreOverview";
import CoreWebVitalsPanel from "../components/audit/CoreWebVitalsPanel";
import IssueList from "../components/audit/IssueList";
import RecommendationCard from "../components/audit/RecommendationCard";

import auditService from "../services/auditService";

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

function Report() {
  const { auditId } = useParams();

  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadAudit = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await auditService.getAudit(auditId);

        if (mounted) {
          setAudit(data);
        }
      } catch (error) {
        console.error("Failed to load audit report:", error);

        if (mounted) {
          setError(
            error.response?.data?.message ||
              "Unable to load the audit report."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
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
    };
  }, [auditId]);

  if (loading) {
    return (
      <DashboardLayout userName="Nitin K.">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#eeeafd] border-t-[#7c3aed]" />
            <p className="mt-4 text-sm font-medium text-gray-600">
              Loading audit report...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !audit) {
    return (
      <DashboardLayout userName="Nitin K.">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="text-xl font-bold text-red-700">
            Unable to load report
          </h1>

          <p className="mt-2 text-sm text-red-600">
            {error || "Audit report not found."}
          </p>
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
    })
  );

  return (
    <DashboardLayout userName="Nitin K.">
      <div className="space-y-6">
        {/* Report Header */}
        <div>
          <p className="text-sm font-semibold text-[#7c3aed]">
            Audit Report
          </p>

          <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#181827] sm:text-3xl">
                Website Audit Report
              </h1>

              <p className="mt-2 break-all text-sm text-gray-500">
                {audit.url}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-xs text-gray-400">
                Audited
              </p>

              <p className="mt-1 text-xs font-medium text-gray-600">
                {formatDate(audit.completedAt || audit.createdAt)}
              </p>

              <p className="mt-1 text-xs capitalize text-gray-400">
                {audit.device} audit
              </p>
            </div>
          </div>
        </div>

        {/* Score Overview */}
        <ScoreOverview
          overallScore={Number(audit.overallScore ?? 0)}
          scores={scores}
        />

        {/* Core Web Vitals */}
        <CoreWebVitalsPanel
          vitals={vitals}
        />

        {/* Issues */}
        <IssueList
          issues={issues}
        />

        {/* Recommendations */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-[#181827]">
              Recommendations
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Practical improvements based on the audit findings.
            </p>
          </div>

          {recommendations.length === 0 ? (
            <div className="rounded-2xl border border-[#eeeafd] bg-white p-6 text-sm text-gray-500">
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
      </div>
    </DashboardLayout>
  );
}

export default Report;