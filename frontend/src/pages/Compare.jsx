import { useEffect, useMemo, useState } from "react";

import DashboardLayout from "../components/layout/DashboardLayout";
import ComparisonSelector from "../components/comparison/ComparisonSelector";
import ComparisonCard from "../components/comparison/ComparisonCard";
import ComparisonChart from "../components/comparison/ComparisonChart";
import auditService from "../services/auditService";

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
    date: formatDate(
      audit.completedAt || audit.createdAt
    ),
    device: audit.device,
    overallScore: Number(audit.overallScore ?? 0),
    scores: {
      performance: Number(
        audit.scores?.performance ?? 0
      ),
      accessibility: Number(
        audit.scores?.accessibility ?? 0
      ),
      bestPractices: Number(
        audit.scores?.bestPractices ?? 0
      ),
      seo: Number(audit.scores?.seo ?? 0),
    },
  };
}

function Compare() {
  const [audits, setAudits] = useState([]);

  const [firstAuditId, setFirstAuditId] = useState("");
  const [secondAuditId, setSecondAuditId] = useState("");

  const [firstAudit, setFirstAudit] = useState(null);
  const [secondAudit, setSecondAudit] = useState(null);

  const [loadingAudits, setLoadingAudits] = useState(true);
  const [loadingComparison, setLoadingComparison] =
    useState(false);

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
                (audit) =>
                  String(audit.status).toUpperCase() ===
                  "COMPLETED"
              )
              .map(mapAuditSummary)
          : [];

        setAudits(completedAudits);

        /*
         * Automatically select the two newest
         * completed audits.
         */
        if (completedAudits.length >= 2) {
          setFirstAuditId(
            String(completedAudits[0].id)
          );

          setSecondAuditId(
            String(completedAudits[1].id)
          );
        } else if (completedAudits.length === 1) {
          setFirstAuditId(
            String(completedAudits[0].id)
          );

          setSecondAuditId("");
        } else {
          setFirstAuditId("");
          setSecondAuditId("");
        }
      } catch (error) {
        console.error(
          "Failed to load audits for comparison:",
          error
        );

        if (mounted) {
          setError(
            error.response?.data?.message ||
              "Unable to load your audits."
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
      if (
        String(firstAuditId) ===
        String(secondAuditId)
      ) {
        setFirstAudit(null);
        setSecondAudit(null);
        setError(
          "Please select two different audits."
        );
        return;
      }

      try {
        setLoadingComparison(true);
        setError("");

        const [firstData, secondData] =
          await Promise.all([
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
        const firstStatus = String(
          firstData?.status || ""
        ).toUpperCase();

        const secondStatus = String(
          secondData?.status || ""
        ).toUpperCase();

        if (
          firstStatus !== "COMPLETED" ||
          secondStatus !== "COMPLETED"
        ) {
          setFirstAudit(null);
          setSecondAudit(null);

          setError(
            "Only completed audits can be compared."
          );

          return;
        }

        setFirstAudit(mapAuditDetails(firstData));
        setSecondAudit(mapAuditDetails(secondData));
      } catch (error) {
        console.error(
          "Failed to load comparison audits:",
          error
        );

        if (mounted) {
          setFirstAudit(null);
          setSecondAudit(null);

          setError(
            error.response?.data?.message ||
              "Unable to load the selected audits."
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
    [firstAudit, secondAudit]
  );

  if (loadingAudits) {
    return (
      <DashboardLayout userName="Nitin K.">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#eeeafd] border-t-[#7c3aed]" />

            <p className="mt-4 text-sm font-medium text-gray-600">
              Loading your audits...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error && audits.length === 0) {
    return (
      <DashboardLayout userName="Nitin K.">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="text-xl font-bold text-red-700">
            Unable to load audits
          </h1>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userName="Nitin K.">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <p className="text-sm font-semibold text-[#7c3aed]">
            Audit Comparison
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#181827] sm:text-3xl">
            Compare Audits
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Compare two website audits to understand how your
            performance and quality scores have changed.
          </p>
        </div>

        {/* Selector */}
        {audits.length >= 2 ? (
          <ComparisonSelector
            audits={audits}
            firstAuditId={firstAuditId}
            secondAuditId={secondAuditId}
            onFirstChange={setFirstAuditId}
            onSecondChange={setSecondAuditId}
          />
        ) : (
          <section className="rounded-2xl border border-[#eeeafd] bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#181827]">
              Not enough audits
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              You need at least two completed audits to
              compare them.
            </p>
          </section>
        )}

        {/* Comparison loading */}
        {loadingComparison && (
          <div className="flex min-h-40 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#eeeafd] border-t-[#7c3aed]" />

              <p className="mt-3 text-sm font-medium text-gray-600">
                Loading comparison...
              </p>
            </div>
          </div>
        )}

        {/* Comparison error */}
        {!loadingComparison &&
          error &&
          audits.length >= 2 && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
              <p className="text-sm font-medium text-red-600">
                {error}
              </p>
            </div>
          )}

        {/* Comparison */}
        {!loadingComparison &&
          !error &&
          selectedAudits.first &&
          selectedAudits.second && (
            <>
              <section className="grid gap-5 lg:grid-cols-2">
                <ComparisonCard
                  audit={selectedAudits.first}
                  label="Audit A"
                />

                <ComparisonCard
                  audit={selectedAudits.second}
                  label="Audit B"
                />
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