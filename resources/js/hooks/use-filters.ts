import { useState, useCallback } from 'react';

export interface FilterOptions {
  searchTerm?: string;
  department?: string;
  status?: string;
  dateRange?: { from: string; to: string };
  [key: string]: string | { from: string; to: string } | undefined;
}

interface UseFiltersOptions {
  onFilterChange?: (filters: FilterOptions) => void;
}

/**
 * Hook for managing filter and search state
 * Consolidates filter/search logic used across employees, attendance, and payroll pages
 */
export function useFilters({ onFilterChange }: UseFiltersOptions = {}) {
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    department: '',
    status: '',
  });

  const updateFilter = useCallback(
    (key: keyof FilterOptions, value: string | { from: string; to: string }) => {
      setFilters((prev) => {
        const updated = { ...prev, [key]: value };
        onFilterChange?.(updated);
        return updated;
      });
    },
    [onFilterChange]
  );

  const setSearchTerm = useCallback(
    (term: string) => {
      updateFilter('searchTerm', term);
    },
    [updateFilter]
  );

  const setDepartment = useCallback(
    (dept: string) => {
      updateFilter('department', dept);
    },
    [updateFilter]
  );

  const setStatus = useCallback(
    (status: string) => {
      updateFilter('status', status);
    },
    [updateFilter]
  );

  const setDateRange = useCallback(
    (from: string, to: string) => {
      updateFilter('dateRange', { from, to });
    },
    [updateFilter]
  );

  const reset = useCallback(() => {
    const resetFilters = {
      searchTerm: '',
      department: '',
      status: '',
      dateRange: undefined,
    };
    setFilters(resetFilters);
    onFilterChange?.(resetFilters);
  }, [onFilterChange]);

  const hasActiveFilters = () => {
    return (
      filters.searchTerm ||
      filters.department ||
      filters.status ||
      filters.dateRange
    );
  };

  return {
    filters,
    updateFilter,
    setSearchTerm,
    setDepartment,
    setStatus,
    setDateRange,
    reset,
    hasActiveFilters,
  };
}
