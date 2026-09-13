import {
  Filter,
  Search,
  X,
} from "lucide-react";

function HistoryFilters({
  search,
  scoreFilter,
  statusFilter,
  onSearchChange,
  onScoreChange,
  onStatusChange,
}) {
  const hasFilters =
    search ||
    scoreFilter !== "all" ||
    statusFilter !== "all";

  const clearFilters = () => {
    onSearchChange("");
    onScoreChange("all");
    onStatusChange("all");
  };

  return (
    <section className="rounded-2xl border border-[#eeeafd] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4">
        {/* Top */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f3e8ff] text-[#7c3aed]">
              <Filter size={16} />
            </div>

            <h2 className="text-sm font-bold text-[#181827]">
              Filters
            </h2>
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-[#7c3aed]"
            >
              <X size={13} />
              Clear
            </button>
          )}
        </div>

        {/* Controls */}
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px]">
          {/* Search */}
          <div className="flex items-center gap-2 rounded-xl border border-[#eeeafd] bg-[#faf9ff] px-3 focus-within:border-[#8b5cf6] focus-within:ring-4 focus-within:ring-[#8b5cf6]/10">
            <Search
              size={17}
              className="shrink-0 text-gray-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                onSearchChange(event.target.value)
              }
              placeholder="Search by website..."
              className="min-w-0 flex-1 border-0 bg-transparent py-3 text-sm text-[#181827] outline-none placeholder:text-gray-400"
            />
          </div>

          {/* Score */}
          <select
            value={scoreFilter}
            onChange={(event) =>
              onScoreChange(event.target.value)
            }
            className="rounded-xl border border-[#eeeafd] bg-[#faf9ff] px-3 py-3 text-sm text-gray-600 outline-none focus:border-[#8b5cf6] focus:ring-4 focus:ring-[#8b5cf6]/10"
          >
            <option value="all">
              All Scores
            </option>

            <option value="excellent">
              Excellent · 90+
            </option>

            <option value="good">
              Good · 70–89
            </option>

            <option value="poor">
              Poor · Below 70
            </option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(event) =>
              onStatusChange(event.target.value)
            }
            className="rounded-xl border border-[#eeeafd] bg-[#faf9ff] px-3 py-3 text-sm text-gray-600 outline-none focus:border-[#8b5cf6] focus:ring-4 focus:ring-[#8b5cf6]/10"
          >
            <option value="all">
              All Statuses
            </option>

            <option value="completed">
              Completed
            </option>

            <option value="running">
              Running
            </option>

            <option value="failed">
              Failed
            </option>
          </select>
        </div>
      </div>
    </section>
  );
}

export default HistoryFilters;