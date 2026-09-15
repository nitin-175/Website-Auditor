import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import StatsCard from "../components/dashboard/StatsCard";
import RecentAudits from "../components/dashboard/RecentAudits";
import ScoreTrendChart from "../components/dashboard/ScoreTrendChart";
import PerformanceSummary from "../components/dashboard/PerformanceSummary";
import auditService from "../services/auditService";
import authService from "../services/authService";

function Dashboard() {
  const [audits, setAudits] = useState([]);
  const [latestAudit, setLatestAudit] = useState(null);
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const storedUser = authService.getStoredUser();

      if (storedUser?.name) {
        setUserName(storedUser.name);
      }

      const auditData = await auditService.getAudits();

      const auditList = Array.isArray(auditData)
        ? auditData
        : Array.isArray(auditData?.content)
          ? auditData.content
          : [];

      setAudits(auditList);

      const completedAudits = auditList.filter(
        (audit) =>
          audit.status?.toUpperCase() === "COMPLETED" &&
          audit.overallScore !== null &&
          audit.overallScore !== undefined
      );

      if (completedAudits.length > 0) {
        const latestCompletedAudit = [...completedAudits].sort(
          (a, b) =>
            new Date(b.completedAt || b.createdAt || 0) -
            new Date(a.completedAt || a.createdAt || 0)
        )[0];

        try {
          const latestDetails = await auditService.getAudit(
            latestCompletedAudit.id
          );

          setLatestAudit(latestDetails);
        } catch (detailsError) {
          console.error(
            "Failed to load latest audit details:",
            detailsError
          );

          setLatestAudit(null);
        }
      } else {
        setLatestAudit(null);
      }
    } catch (err) {
      console.error("Failed to load dashboard:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  }

  const completedAudits = audits.filter(
    (audit) =>
      audit.status?.toUpperCase() === "COMPLETED" &&
      audit.overallScore !== null &&
      audit.overallScore !== undefined
  );

  const totalAudits = completedAudits.length;

  const averageScore =
    completedAudits.length > 0
      ? Math.round(
          completedAudits.reduce(
            (sum, audit) =>
              sum + Number(audit.overallScore),
            0
          ) / completedAudits.length
        )
      : 0;

  const issuesFound = completedAudits.reduce(
    (total, audit) =>
      total + Number(audit.issues || 0),
    0
  );

  const uniqueWebsites = new Set(
    completedAudits
      .map((audit) => audit.url)
      .filter(Boolean)
  ).size;

  const stats = [
    {
      title: "Total Audits",
      value: loading ? "—" : totalAudits,
      description: "Audits completed",
      icon: "activity",
      accent: "indigo",
    },
    {
      title: "Average Score",
      value:
        loading
          ? "—"
          : completedAudits.length > 0
            ? averageScore
            : "—",
      description: "Overall website score",
      icon: "chart",
      accent: "teal",
    },
    {
      title: "Issues Found",
      value: loading ? "—" : issuesFound,
      description: "Across all audits",
      icon: "alert",
      accent: "coral",
    },
    {
      title: "Websites",
      value: loading ? "—" : uniqueWebsites,
      description: "Unique sites tracked",
      icon: "globe",
      accent: "amber",
    },
  ];

  if (loading) {
    return (
      <DashboardLayout userName={userName}>
        <div className="space-y-6">
          <div>
            <div className="h-4 w-24 animate-pulse rounded bg-[#e7e4da]" />

            <div className="mt-3 h-9 w-64 animate-pulse rounded bg-[#e7e4da]" />

            <div className="mt-3 h-4 w-80 animate-pulse rounded bg-[#eeece4]" />
          </div>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <StatsCard key={stat.title} {...stat} />
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)]">
            <div className="h-[360px] animate-pulse rounded-2xl border border-[#dedbd1] bg-white" />

            <div className="h-[360px] animate-pulse rounded-2xl border border-[#dedbd1] bg-white" />
          </section>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout userName={userName}>
        <div className="mx-auto max-w-3xl py-12">
          <div className="rounded-2xl border border-[#f3c7c1] bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-semibold text-[#c94f43]">
              {error}
            </p>

            <button
              type="button"
              onClick={loadDashboard}
              className="mt-4 rounded-xl bg-[#4f46e5] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4338ca]"
            >
              Try Again
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userName={userName}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#4f46e5]">
              Overview
            </p>

            <h1 className="mt-1 text-2xl font-extrabold tracking-[-0.03em] text-[#172033] sm:text-3xl">
              Good to see you,{" "}
              {userName.split(" ")[0]}.
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#6f6d67]">
              Monitor your website audits and performance insights.
            </p>
          </div>

          <Link
            to="/app/new-audit"
            className="inline-flex w-fit items-center justify-center rounded-full bg-[#172033] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#29344a]"
          >
            New Audit
          </Link>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </section>

        {audits.length === 0 ? (
          <section className="rounded-2xl border border-[#dedbd1] bg-white p-8 text-center shadow-sm">
            <h2 className="text-base font-bold text-[#172033]">
              No audits yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#77756e]">
              Run your first website audit to start seeing
              performance insights here.
            </p>

            <Link
              to="/app/new-audit"
              className="mt-5 inline-flex rounded-full bg-[#4f46e5] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#4338ca]"
            >
              Start your first audit
            </Link>
          </section>
        ) : (
          <>
            <section className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)]">
              <ScoreTrendChart audits={audits} />

              <PerformanceSummary audit={latestAudit} />
            </section>

            <RecentAudits audits={audits} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;