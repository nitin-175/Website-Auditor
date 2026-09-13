import {
  useEffect,
  useMemo,
  useState,
} from "react";

function usePagination({
  initialPage = 1,
  pageSize = 10,
  totalItems = 0,
} = {}) {
  const [currentPage, setCurrentPage] =
    useState(initialPage);

  const totalPages = Math.max(
    1,
    Math.ceil(
      totalItems / pageSize
    )
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [
    currentPage,
    totalPages,
  ]);

  const pagination = useMemo(() => {
    const start =
      totalItems === 0
        ? 0
        : (currentPage - 1) *
            pageSize +
          1;

    const end = Math.min(
      currentPage * pageSize,
      totalItems
    );

    return {
      currentPage,
      pageSize,
      totalPages,
      totalItems,
      start,
      end,

      hasPrevious:
        currentPage > 1,

      hasNext:
        currentPage < totalPages,
    };
  }, [
    currentPage,
    pageSize,
    totalItems,
    totalPages,
  ]);

  const goToPage = (page) => {
    const safePage = Math.min(
      Math.max(page, 1),
      totalPages
    );

    setCurrentPage(safePage);
  };

  const nextPage = () => {
    setCurrentPage((page) =>
      Math.min(
        page + 1,
        totalPages
      )
    );
  };

  const previousPage = () => {
    setCurrentPage((page) =>
      Math.max(page - 1, 1)
    );
  };

  const firstPage = () => {
    setCurrentPage(1);
  };

  const lastPage = () => {
    setCurrentPage(totalPages);
  };

  const resetPagination = () => {
    setCurrentPage(1);
  };

  return {
    ...pagination,
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    resetPagination,
  };
}

export default usePagination;