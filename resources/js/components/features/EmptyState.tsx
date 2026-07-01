import React from 'react';
import { AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  illustration?: 'search' | 'inbox' | 'error' | 'data' | 'custom';
  className?: string;
}

/**
 * EmptyState Component
 * Displays friendly message when no data is available
 * Used in: Employee list, Payroll, Attendance, Reports
 */
export default function EmptyState({
  title,
  description,
  icon,
  action,
  illustration = 'data',
  className = '',
}: EmptyStateProps) {
  const getDefaultIcon = () => {
    const icons = {
      search: '🔍',
      inbox: '📭',
      error: '⚠️',
      data: '📊',
      custom: icon || '📋',
    };
    return icons[illustration];
  };

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      {/* Icon/Illustration */}
      <div className="text-6xl mb-4">{getDefaultIcon()}</div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>

      {/* Description */}
      {description && (
        <p className="text-gray-600 text-sm text-center max-w-md mb-4">
          {description}
        </p>
      )}

      {/* Action Button */}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
