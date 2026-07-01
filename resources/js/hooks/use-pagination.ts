import { useState, useCallback } from 'react';

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface UsePaginationOptions {
  initialPage?: number;
  itemsPerPage?: number;
}

/**
 * Hook for managing pagination state and logic
 * Eliminates duplicate pagination code across multiple pages
 */
export function usePagination({
  initialPage = 1,
  itemsPerPage = 20,
}: UsePaginationOptions = {}) {
  const [page, setPage] = useState(initialPage);
  const [pagination, setPagination] = useState<PaginationMeta>({
    current_page: initialPage,
    last_page: 1,
    per_page: itemsPerPage,
    total: 0,
  });

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
    setPagination((prev) => ({ ...prev, current_page: newPage }));
  }, []);

  const goToNextPage = useCallback(() => {
    if (page < pagination.last_page) {
      goToPage(page + 1);
    }
  }, [page, pagination.last_page, goToPage]);

  const goToPreviousPage = useCallback(() => {
    if (page > 1) {
      goToPage(page - 1);
    }
  }, [page, goToPage]);

  const reset = useCallback(() => {
    goToPage(initialPage);
  }, [initialPage, goToPage]);

  return {
    page,
    pagination,
    setPagination,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    reset,
    hasNextPage: page < pagination.last_page,
    hasPreviousPage: page > 1,
  };
}
