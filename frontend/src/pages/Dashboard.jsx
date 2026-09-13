import { useEffect, useState } from "react";
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

      if (auditList.length > 0) {
        const latest = [...auditList].sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
        )[0];

        try {
          const latestDetails = await auditService.getAudit(latest.id);

          setLatestAudit(latestDetails);
        } catch {
          setLatestAudit(null);
        }
      } else {
        setLatestAudit(null);
      }
    } catch (err) {
      console.error("Failed to load dashboard:", err);

      setError(err.response?.data?.message || "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  const completedAudits = audits.filter(
    (audit) =>
      audit.status?.toUpperCase() === "COMPLETED" &&
      audit.overallScore !== null &&
      audit.overallScore !== undefined,
  );

  const totalAudits = completedAudits.length;

  const averageScore =
    completedAudits.length > 0
      ? Math.round(
          completedAudits.reduce(
            (sum, audit) => sum + Number(audit.overallScore),
            0,
          ) / completedAudits.length,
        )
      : 0;

  const issuesFound = completedAudits.reduce(
    (total, audit) => total + Number(audit.issues || 0),
    0,
  );

  const uniqueWebsites = new Set(
    completedAudits.map((audit) => audit.url).filter(Boolean),
  ).size;

  const stats = [
    {
      title: "Total Audits",
      value: loading ? "—" : totalAudits,
      description: "Audits completed",
    },
    {
      title: "Average Score",
      value: loading ? "—" : completedAudits.length > 0 ? averageScore : "—",
      description: "Overall website score",
    },
    {
      title: "Issues Found",
      value: loading ? "—" : issuesFound,
      description: "Across all audits",
    },
    {
      title: "Websites",
      value: loading ? "—" : uniqueWebsites,
      description: "Unique websites audited",
    },
  ];

  if (loading) {
    return (
      <DashboardLayout userName={userName}>
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium text-[#7c3aed]">Overview</p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#181827] sm:text-3xl">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Monitor your website audits and performance insights.
            </p>
          </div>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <StatsCard key={stat.title} {...stat} />
            ))}
          </section>

          <div className="rounded-2xl border border-[#eeeafd] bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-gray-500">Loading your audit data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout userName={userName}>
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium text-[#7c3aed]">Overview</p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#181827] sm:text-3xl">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Monitor your website audits and performance insights.
            </p>
          </div>

          <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-semibold text-red-600">{error}</p>

            <button
              type="button"
              onClick={loadDashboard}
              className="mt-4 rounded-lg bg-[#7c3aed] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#6d28d9]"
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
        <div>
          <p className="text-sm font-medium text-[#7c3aed]">Overview</p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#181827] sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Monitor your website audits and performance insights.
          </p>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </section>

        {audits.length === 0 ? (
          <section className="rounded-2xl border border-[#eeeafd] bg-white p-8 text-center shadow-sm">
            <h2 className="text-base font-bold text-[#181827]">
              No audits yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Run your first website audit to start seeing performance insights
              here.
            </p>
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
