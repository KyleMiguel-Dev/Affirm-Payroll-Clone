import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import EmptyState from './EmptyState';

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
  className?: string;
  mobileHidden?: boolean;
}

interface StatTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: Column<T>[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  onRowClick?: (row: T) => void;
  rowClassName?: string;
  emptyMessage?: string;
  loading?: boolean;
  variant?: 'default' | 'compact';
  className?: string;
}

/**
 * StatTable Component
 * Reusable table component for displaying data across pages
 * Supports sorting, mobile-friendly responsive design, and custom rendering
 * Used in: Employees, Payroll, Attendance, Reports
 */
export default function StatTable<T extends Record<string, unknown>>({
  data,
  columns,
  sortBy,
  sortOrder = 'asc',
  onSort,
  onRowClick,
  rowClassName = '',
  emptyMessage = 'No data available',
  loading = false,
  variant = 'default',
  className = '',
}: StatTableProps<T>) {
  // Show empty state
  if (!loading && data.length === 0) {
    return (
      <div className={`${className}`}>
        <EmptyState
          title={emptyMessage}
          illustration="inbox"
          description="No records found. Try adjusting your filters."
        />
      </div>
    );
  }

  const handleSort = (key: string) => {
    if (onSort) {
      onSort(key);
    }
  };

  const SortIcon = ({
    col,
  }: {
    col: Column<T>;
  }) => {
    if (!col.sortable || !onSort) return null;

    const isActive = sortBy === String(col.key);

    return (
      <span className="ml-2 inline-flex items-center">
        {isActive && sortOrder === 'asc' && (
          <ChevronUp size={14} className="text-blue-600" />
        )}
        {isActive && sortOrder === 'desc' && (
          <ChevronDown size={14} className="text-blue-600" />
        )}
        {!isActive && (
          <ChevronUp size={14} className="text-gray-300" />
        )}
      </span>
    );
  };

  return (
    <div
      className={`bg-white rounded-lg overflow-x-auto shadow-sm border border-gray-200 ${className}`}
    >
      {/* Desktop Table View */}
      <table className="w-full hidden md:table">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`px-6 py-3 text-left text-sm font-semibold text-gray-900 ${
                  col.mobileHidden ? 'hidden lg:table-cell' : ''
                } ${col.sortable ? 'cursor-pointer hover:bg-gray-100' : ''} ${
                  col.className || ''
                }`}
                onClick={() => {
                  if (col.sortable) {
                    handleSort(String(col.key));
                  }
                }}
              >
                <div className="flex items-center">
                  {col.label}
                  {col.sortable && <SortIcon col={col} />}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                onRowClick ? 'cursor-pointer' : ''
              } ${rowClassName}`}
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={`px-6 py-4 text-sm text-gray-700 ${
                    col.mobileHidden ? 'hidden lg:table-cell' : ''
                  } ${col.className || ''}`}
                >
                  {col.render
                    ? col.render(row[col.key], row)
                    : String(row[col.key] || '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4 p-4">
        {data.map((row, idx) => (
          <div
            key={idx}
            onClick={() => onRowClick?.(row)}
            className={`bg-white border border-gray-200 rounded-lg p-4 space-y-2 ${
              onRowClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
            } ${rowClassName}`}
          >
            {columns
              .filter((col) => !col.mobileHidden)
              .map((col) => (
                <div key={String(col.key)} className="flex justify-between gap-2">
                  <span className="text-sm font-medium text-gray-600">
                    {col.label}:
                  </span>
                  <span className="text-sm text-gray-900 text-right">
                    {col.render
                      ? col.render(row[col.key], row)
                      : String(row[col.key] || '')}
                  </span>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
