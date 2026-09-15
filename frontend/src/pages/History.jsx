import { useEffect, useMemo, useState } from "react";
import { History as HistoryIcon, RefreshCw } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import AuditHistoryList from "../components/history/AuditHistoryList";
import HistoryFilters from "../components/history/HistoryFilters";
import Pagination from "../components/history/Pagination";
import auditService from "../services/auditService";
import userService from "../services/userService";

const ITEMS_PER_PAGE = 5;

function formatDate(dateValue) {
  if (!dateValue) {
    return "N/A";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function formatStatus(status) {
  if (!status) {
    return "Unknown";
  }

  return String(status)
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDevice(device) {
  if (!device) {
    return "Unknown";
  }

  return String(device)
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function History() {
  const [search, setSearch] = useState("");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    let mounted = true;

    const loadHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await auditService.getAudits();

        if (!mounted) {
          return;
        }

        const auditList = Array.isArray(data)
          ? data
          : data?.content || data?.audits || [];

        const normalizedAudits = auditList.map((audit) => ({
          id: audit.id,
          website: audit.url || "Unknown website",
          score:
            audit.overallScore !== null && audit.overallScore !== undefined
              ? Number(audit.overallScore)
              : null,
          status: formatStatus(audit.status),
          device: formatDevice(audit.device),
          date: formatDate(audit.createdAt),
          issues: null,
        }));

        setAudits(normalizedAudits);
      } catch (error) {
        console.error("Failed to load audit history:", error);

        if (mounted) {
          setError(
            error.response?.data?.message ||
              "Unable to load your audit history.",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadHistory();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredAudits = useMemo(() => {
    return audits.filter((audit) => {
      const searchText = search.trim().toLowerCase();

      const matchesSearch =
        !searchText || audit.website.toLowerCase().includes(searchText);

      const score = audit.score;

      const matchesScore =
        scoreFilter === "all" ||
        (scoreFilter === "excellent" && score !== null && score >= 90) ||
        (scoreFilter === "good" &&
          score !== null &&
          score >= 70 &&
          score < 90) ||
        (scoreFilter === "poor" && score !== null && score < 70);

      const matchesStatus =
        statusFilter === "all" ||
        audit.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesScore && matchesStatus;
    });
  }, [audits, search, scoreFilter, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAudits.length / ITEMS_PER_PAGE),
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedAudits = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;

    return filteredAudits.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAudits, safeCurrentPage]);

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleScoreChange = (value) => {
    setScoreFilter(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

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

  return (
    <DashboardLayout userName={userName}>
      <div className="space-y-7">
        {/* Header */}
        <section className="relative overflow-hidden rounded-2xl border border-[#e7e5df] bg-white px-5 py-6 shadow-sm sm:px-7 sm:py-7">
          <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#eef2ff] blur-2xl" />
          <div className="absolute -bottom-20 right-28 h-32 w-32 rounded-full bg-[#e8f8f5] blur-2xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#e0e7ff] bg-[#f5f7ff] px-3 py-1.5 text-xs font-semibold text-[#4f46e5]">
                <HistoryIcon size={14} />
                Audit Management
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-[#172033] sm:text-3xl">
                Audit History
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b7280]">
                View, search, and manage your previous website audits from one
                place.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2 rounded-xl border border-[#e7e5df] bg-[#faf9f5] px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eef2ff] text-[#4f46e5]">
                <HistoryIcon size={18} />
              </div>

              <div>
                <p className="text-xs font-medium text-[#8b8982]">
                  Total audits
                </p>
                <p className="text-lg font-bold text-[#172033]">
                  {audits.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <HistoryFilters
          search={search}
          scoreFilter={scoreFilter}
          statusFilter={statusFilter}
          onSearchChange={handleSearchChange}
          onScoreChange={handleScoreChange}
          onStatusChange={handleStatusChange}
        />

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-[#e7e5df] bg-white p-8 shadow-sm sm:p-10">
            <div className="mx-auto flex max-w-md flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eef2ff] text-[#4f46e5]">
                <RefreshCw size={21} className="animate-spin" />
              </div>

              <h2 className="mt-5 text-base font-bold text-[#172033]">
                Loading your audit history
              </h2>

              <p className="mt-2 text-sm text-[#77756f]">
                Fetching your previous website audits...
              </p>

              <div className="mt-7 w-full space-y-3">
                <div className="h-14 animate-pulse rounded-xl bg-[#f2f1ec]" />
                <div className="h-14 animate-pulse rounded-xl bg-[#f2f1ec]" />
                <div className="h-14 animate-pulse rounded-xl bg-[#f2f1ec]" />
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-[#f4c9c4] bg-[#fff7f5] p-8 text-center shadow-sm">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#fde8e5] text-[#d9574b]">
              <RefreshCw size={19} />
            </div>

            <h2 className="mt-4 text-lg font-bold text-[#172033]">
              Unable to load audit history
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#9a5149]">
              {error}
            </p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredAudits.length === 0 && (
          <div className="rounded-2xl border border-[#e7e5df] bg-white px-6 py-12 text-center shadow-sm sm:px-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef2ff] text-[#4f46e5]">
              <HistoryIcon size={25} />
            </div>

            <h2 className="mt-5 text-lg font-bold text-[#172033]">
              No audits found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#77756f]">
              {audits.length === 0
                ? "You have not completed any audits yet."
                : "No audits match your current filters."}
            </p>
          </div>
        )}

        {/* History */}
        {!loading && !error && filteredAudits.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-[#e7e5df] bg-white shadow-sm">
            <div className="border-b border-[#eceae4] px-5 py-4 sm:px-6">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-sm font-bold text-[#172033]">
                    Previous audits
                  </h2>

                  <p className="mt-0.5 text-xs text-[#8b8982]">
                    {filteredAudits.length}{" "}
                    {filteredAudits.length === 1 ? "audit" : "audits"} found
                  </p>
                </div>

                <div className="rounded-full bg-[#f3f4f6] px-3 py-1 text-xs font-semibold text-[#6b7280]">
                  Page {safeCurrentPage} of {totalPages}
                </div>
              </div>
            </div>

            <AuditHistoryList audits={paginatedAudits} />
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && filteredAudits.length > 0 && (
          <Pagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

export default History;
