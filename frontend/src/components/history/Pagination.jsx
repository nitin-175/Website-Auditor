import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

function getPageNumbers(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1
    );
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis-right", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "ellipsis-left",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "ellipsis-left",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis-right",
    totalPages,
  ];
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = getPageNumbers(
    currentPage,
    totalPages
  );

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const goToFirstPage = () => {
    if (currentPage !== 1) {
      onPageChange(1);
    }
  };

  const goToLastPage = () => {
    if (currentPage !== totalPages) {
      onPageChange(totalPages);
    }
  };

  return (
    <nav
      aria-label="Audit history pagination"
      className="flex flex-col gap-4 rounded-2xl border border-[#eeeafd] bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5"
    >
      <div className="flex items-center justify-center sm:justify-start">
        <p className="text-xs font-medium text-gray-500">
          Page{" "}
          <span className="font-semibold text-[#181827]">
            {currentPage}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-[#181827]">
            {totalPages}
          </span>
        </p>
      </div>

      <div className="flex items-center justify-center gap-1.5">
        <button
          type="button"
          onClick={goToFirstPage}
          disabled={currentPage === 1}
          aria-label="Go to first page"
          className="hidden h-9 w-9 items-center justify-center rounded-lg border border-[#eeeafd] bg-white text-gray-500 transition hover:border-[#ddd4fa] hover:bg-[#faf9ff] hover:text-[#7c3aed] disabled:cursor-not-allowed disabled:opacity-40 sm:inline-flex"
        >
          <ChevronsLeft size={15} />
        </button>

        <button
          type="button"
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          aria-label="Go to previous page"
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-[#eeeafd] bg-white px-3 text-xs font-semibold text-gray-600 transition hover:border-[#ddd4fa] hover:bg-[#faf9ff] hover:text-[#7c3aed] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={15} />
          <span className="hidden sm:inline">
            Previous
          </span>
        </button>

        <div className="flex items-center gap-1">
          {pageNumbers.map((page) => {
            if (
              page === "ellipsis-left" ||
              page === "ellipsis-right"
            ) {
              return (
                <span
                  key={page}
                  className="flex h-9 w-7 items-center justify-center text-xs font-semibold text-gray-400"
                >
                  …
                </span>
              );
            }

            const isActive = page === currentPage;

            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                aria-current={
                  isActive ? "page" : undefined
                }
                className={`h-9 min-w-9 rounded-lg border px-2 text-xs font-semibold transition ${
                  isActive
                    ? "border-[#7c3aed] bg-[#7c3aed] text-white shadow-sm"
                    : "border-[#eeeafd] bg-white text-gray-600 hover:border-[#ddd4fa] hover:bg-[#faf9ff] hover:text-[#7c3aed]"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          aria-label="Go to next page"
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-[#eeeafd] bg-white px-3 text-xs font-semibold text-gray-600 transition hover:border-[#ddd4fa] hover:bg-[#faf9ff] hover:text-[#7c3aed] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="hidden sm:inline">
            Next
          </span>
          <ChevronRight size={15} />
        </button>

        <button
          type="button"
          onClick={goToLastPage}
          disabled={currentPage === totalPages}
          aria-label="Go to last page"
          className="hidden h-9 w-9 items-center justify-center rounded-lg border border-[#eeeafd] bg-white text-gray-500 transition hover:border-[#ddd4fa] hover:bg-[#faf9ff] hover:text-[#7c3aed] disabled:cursor-not-allowed disabled:opacity-40 sm:inline-flex"
        >
          <ChevronsRight size={15} />
        </button>
      </div>
    </nav>
  );
}

export default Pagination;