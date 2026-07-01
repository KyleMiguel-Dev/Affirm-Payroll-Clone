import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingStateProps {
  rows?: number;
  columns?: number;
  variant?: 'table' | 'cards' | 'kpi';
  className?: string;
}

/**
 * LoadingState Component
 * Shows skeleton loaders while data is being fetched
 * Improves perceived performance
 */
export default function LoadingState({
  rows = 5,
  columns = 4,
  variant = 'table',
  className = '',
}: LoadingStateProps) {
  if (variant === 'kpi') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-gray-300">
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-8 w-20 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'cards') {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="space-y-3">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Table variant
  return (
    <div className={`bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {Array.from({ length: columns }).map((_, idx) => (
              <th key={idx} className="px-6 py-3">
                <Skeleton className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx} className="border-b border-gray-200">
              {Array.from({ length: columns }).map((_, colIdx) => (
                <td key={colIdx} className="px-6 py-4">
                  <Skeleton className="h-4 w-24" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
