import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import AuditHistoryList from "../components/history/AuditHistoryList";
import HistoryFilters from "../components/history/HistoryFilters";
import Pagination from "../components/history/Pagination";
import auditService from "../services/auditService";

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
            audit.overallScore !== null &&
            audit.overallScore !== undefined
              ? Number(audit.overallScore)
              : null,
          status: formatStatus(audit.status),
          device: formatDevice(audit.device),
          date: formatDate(audit.createdAt),

          // Issue count is not currently included
          // in AuditSummary, so don't invent a value.
          issues: null,
        }));

        setAudits(normalizedAudits);
      } catch (error) {
        console.error("Failed to load audit history:", error);

        if (mounted) {
          setError(
            error.response?.data?.message ||
              "Unable to load your audit history."
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
        !searchText ||
        audit.website.toLowerCase().includes(searchText);

      const score = audit.score;

      const matchesScore =
        scoreFilter === "all" ||
        (scoreFilter === "excellent" &&
          score !== null &&
          score >= 90) ||
        (scoreFilter === "good" &&
          score !== null &&
          score >= 70 &&
          score < 90) ||
        (scoreFilter === "poor" &&
          score !== null &&
          score < 70);

      const matchesStatus =
        statusFilter === "all" ||
        audit.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesScore && matchesStatus;
    });
  }, [audits, search, scoreFilter, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAudits.length / ITEMS_PER_PAGE)
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const paginatedAudits = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;

    return filteredAudits.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
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

  return (
    <DashboardLayout userName="Nitin K.">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <p className="text-sm font-semibold text-[#7c3aed]">
            Audit Management
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#181827] sm:text-3xl">
            Audit History
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            View and manage your previous website audits.
          </p>
        </div>

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
          <div className="rounded-2xl border border-[#eeeafd] bg-white p-10 text-center shadow-sm">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#eeeafd] border-t-[#7c3aed]" />

            <p className="mt-4 text-sm font-medium text-gray-600">
              Loading audit history...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <h2 className="text-lg font-bold text-red-700">
              Unable to load audit history
            </h2>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Empty state */}
        {!loading &&
          !error &&
          filteredAudits.length === 0 && (
            <div className="rounded-2xl border border-[#eeeafd] bg-white p-10 text-center shadow-sm">
              <h2 className="text-lg font-bold text-[#181827]">
                No audits found
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {audits.length === 0
                  ? "You have not completed any audits yet."
                  : "No audits match your current filters."}
              </p>
            </div>
          )}

        {/* History */}
        {!loading &&
          !error &&
          filteredAudits.length > 0 && (
            <AuditHistoryList
              audits={paginatedAudits}
            />
          )}

        {/* Pagination */}
        {!loading &&
          !error &&
          filteredAudits.length > 0 && (
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