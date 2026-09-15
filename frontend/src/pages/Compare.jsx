import { useEffect, useMemo, useState } from "react";
import { ArrowRightLeft, BarChart3, RefreshCw, Sparkles } from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import ComparisonSelector from "../components/comparison/ComparisonSelector";
import ComparisonCard from "../components/comparison/ComparisonCard";
import ComparisonChart from "../components/comparison/ComparisonChart";
import auditService from "../services/auditService";
import userService from "../services/userService";

function formatDate(dateValue) {
  if (!dateValue) {
    return "N/A";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function mapAuditSummary(audit) {
  return {
    id: audit.id,
    website: audit.url,
    date: formatDate(audit.createdAt),
    device: audit.device,
    overallScore: Number(audit.overallScore ?? 0),
    status: audit.status,
  };
}

function mapAuditDetails(audit) {
  return {
    ...audit,
    website: audit.url,
    date: formatDate(audit.completedAt || audit.createdAt),
    device: audit.device,
    overallScore: Number(audit.overallScore ?? 0),
    scores: {
      performance: Number(audit.scores?.performance ?? 0),
      accessibility: Number(audit.scores?.accessibility ?? 0),
      bestPractices: Number(audit.scores?.bestPractices ?? 0),
      seo: Number(audit.scores?.seo ?? 0),
    },
  };
}

function Compare() {
  const [audits, setAudits] = useState([]);
  const [userName, setUserName] = useState("User");
  const [firstAuditId, setFirstAuditId] = useState("");
  const [secondAuditId, setSecondAuditId] = useState("");

  const [firstAudit, setFirstAudit] = useState(null);
  const [secondAudit, setSecondAudit] = useState(null);

  const [loadingAudits, setLoadingAudits] = useState(true);
  const [loadingComparison, setLoadingComparison] = useState(false);

  const [error, setError] = useState("");
  
  /*
   * Load the authenticated user's audits.
   * Only completed audits can be compared.
   */

  useEffect(() => {
    let mounted = true;

    const loadAudits = async () => {
      try {
        setLoadingAudits(true);
        setError("");

        const data = await auditService.getAudits();

        if (!mounted) {
          return;
        }

        const completedAudits = Array.isArray(data)
          ? data
              .filter(
                (audit) => String(audit.status).toUpperCase() === "COMPLETED",
              )
              .map(mapAuditSummary)
          : [];

        setAudits(completedAudits);

        /*
         * Automatically select the two newest
         * completed audits.
         */
        if (completedAudits.length >= 2) {
          setFirstAuditId(String(completedAudits[0].id));

          setSecondAuditId(String(completedAudits[1].id));
        } else if (completedAudits.length === 1) {
          setFirstAuditId(String(completedAudits[0].id));

          setSecondAuditId("");
        } else {
          setFirstAuditId("");
          setSecondAuditId("");
        }
      } catch (error) {
        console.error("Failed to load audits for comparison:", error);

        if (mounted) {
          setError(
            error.response?.data?.message || "Unable to load your audits.",
          );
        }
      } finally {
        if (mounted) {
          setLoadingAudits(false);
        }
      }
    };

    loadAudits();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * Load complete details of both selected audits.
   */
  useEffect(() => {
    let mounted = true;

    const loadComparisonAudits = async () => {
      if (!firstAuditId || !secondAuditId) {
        setFirstAudit(null);
        setSecondAudit(null);
        return;
      }

      /*
       * Prevent comparing an audit with itself.
       */
      if (String(firstAuditId) === String(secondAuditId)) {
        setFirstAudit(null);
        setSecondAudit(null);
        setError("Please select two different audits.");
        return;
      }

      try {
        setLoadingComparison(true);
        setError("");

        const [firstData, secondData] = await Promise.all([
          auditService.getAudit(firstAuditId),
          auditService.getAudit(secondAuditId),
        ]);

        if (!mounted) {
          return;
        }

        /*
         * Safety check: both selected audits must
         * still be completed.
         */
        const firstStatus = String(firstData?.status || "").toUpperCase();

        const secondStatus = String(secondData?.status || "").toUpperCase();

        if (firstStatus !== "COMPLETED" || secondStatus !== "COMPLETED") {
          setFirstAudit(null);
          setSecondAudit(null);

          setError("Only completed audits can be compared.");

          return;
        }

        setFirstAudit(mapAuditDetails(firstData));
        setSecondAudit(mapAuditDetails(secondData));
      } catch (error) {
        console.error("Failed to load comparison audits:", error);

        if (mounted) {
          setFirstAudit(null);
          setSecondAudit(null);

          setError(
            error.response?.data?.message ||
              "Unable to load the selected audits.",
          );
        }
      } finally {
        if (mounted) {
          setLoadingComparison(false);
        }
      }
    };

    loadComparisonAudits();

    return () => {
      mounted = false;
    };
  }, [firstAuditId, secondAuditId]);

  const selectedAudits = useMemo(
    () => ({
      first: firstAudit,
      second: secondAudit,
    }),
    [firstAudit, secondAudit],
  );

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        const profile = await userService.getProfile();

        if (mounted && profile?.name) {
          setUserName(profile.name);
        }
      } catch {
        // Keep fallback name if profile loading fails.
      }
    };

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  if (loadingAudits) {
    return (
      <DashboardLayout userName={userName}>
        <div className="flex min-h-[420px] items-center justify-center">
          <div className="w-full max-w-md rounded-2xl border border-[#e7e5df] bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eef2ff] text-[#4f46e5]">
              <RefreshCw size={23} className="animate-spin" />
            </div>

            <h2 className="mt-5 text-base font-bold text-[#172033]">
              Loading your audits
            </h2>

            <p className="mt-2 text-sm text-[#77756f]">
              Preparing your comparison workspace...
            </p>

            <div className="mt-7 space-y-3">
              <div className="h-12 animate-pulse rounded-xl bg-[#f2f1ec]" />
              <div className="h-12 animate-pulse rounded-xl bg-[#f2f1ec]" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error && audits.length === 0) {
    return (
      <DashboardLayout userName={userName}>
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#f4c9c4] bg-[#fff7f5] p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#fde8e5] text-[#d9574b]">
            <RefreshCw size={20} />
          </div>

          <h1 className="mt-5 text-xl font-bold text-[#172033]">
            Unable to load audits
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#9a5149]">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userName={userName}>
      <div className="space-y-7">
        {/* Header */}
        <section className="relative overflow-hidden rounded-2xl border border-[#e7e5df] bg-white px-5 py-6 shadow-sm sm:px-7 sm:py-7">
          <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#eef2ff] blur-2xl" />

          <div className="absolute -bottom-20 right-28 h-36 w-36 rounded-full bg-[#e8f8f5] blur-2xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#e0e7ff] bg-[#f5f7ff] px-3 py-1.5 text-xs font-semibold text-[#4f46e5]">
                <ArrowRightLeft size={14} />
                Audit Comparison
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-[#172033] sm:text-3xl">
                Compare Audits
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b7280]">
                Compare two website audits to understand how your performance
                and quality scores have changed.
              </p>
            </div>

            <div className="hidden shrink-0 items-center gap-3 rounded-xl border border-[#e7e5df] bg-[#faf9f5] px-4 py-3 sm:flex">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e8f8f5] text-[#19a999]">
                <BarChart3 size={19} />
              </div>

              <div>
                <p className="text-xs font-medium text-[#8b8982]">
                  Completed audits
                </p>

                <p className="text-lg font-bold text-[#172033]">
                  {audits.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Selector */}
        {audits.length >= 2 ? (
          <section className="rounded-2xl border border-[#e7e5df] bg-white p-5 shadow-sm sm:p-6">
            <ComparisonSelector
              audits={audits}
              firstAuditId={firstAuditId}
              secondAuditId={secondAuditId}
              onFirstChange={setFirstAuditId}
              onSecondChange={setSecondAuditId}
            />
          </section>
        ) : (
          <section className="rounded-2xl border border-[#e7e5df] bg-white p-7 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef2ff] text-[#4f46e5]">
                <ArrowRightLeft size={24} />
              </div>

              <h2 className="mt-5 text-lg font-bold text-[#172033]">
                Not enough audits
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-[#77756f]">
                You need at least two completed audits to compare them.
              </p>
            </div>
          </section>
        )}

        {/* Comparison loading */}
        {loadingComparison && (
          <div className="rounded-2xl border border-[#e7e5df] bg-white p-8 shadow-sm">
            <div className="flex min-h-40 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#eef2ff] text-[#4f46e5]">
                  <RefreshCw size={20} className="animate-spin" />
                </div>

                <p className="mt-4 text-sm font-semibold text-[#172033]">
                  Loading comparison
                </p>

                <p className="mt-1 text-xs text-[#8b8982]">
                  Comparing the selected audits...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Comparison error */}
        {!loadingComparison && error && audits.length >= 2 && (
          <div className="rounded-2xl border border-[#f4c9c4] bg-[#fff7f5] p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fde8e5] text-[#d9574b]">
                <RefreshCw size={16} />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#172033]">
                  Comparison unavailable
                </p>

                <p className="mt-1 text-sm leading-6 text-[#9a5149]">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Comparison */}
        {!loadingComparison &&
          !error &&
          selectedAudits.first &&
          selectedAudits.second && (
            <>
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-[#e7e5df]" />

                <div className="h-px flex-1 bg-[#e7e5df]" />
              </div>

              <section className="grid gap-5 lg:grid-cols-2">
                <ComparisonCard audit={selectedAudits.first} label="Audit A" />

                <ComparisonCard audit={selectedAudits.second} label="Audit B" />
              </section>

              <ComparisonChart
                firstAudit={selectedAudits.first}
                secondAudit={selectedAudits.second}
              />
            </>
          )}
      </div>
    </DashboardLayout>
  );
}

export default Compare;
