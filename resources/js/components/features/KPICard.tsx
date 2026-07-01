import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    percentage?: number;
    label?: string;
  };
  icon?: React.ReactNode;
  borderColor?: string;
  bgColor?: string;
  isLoading?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * KPICard Component
 * Reusable metric card used across Dashboard, Payroll, Attendance
 * Supports trends, custom styling, and loading states
 * Eliminates duplicate code from dashboard, payroll, attendance pages
 */
export default function KPICard({
  title,
  value,
  description,
  trend,
  icon,
  borderColor = 'border-l-4 border-blue-500',
  bgColor = 'bg-white',
  isLoading = false,
  onClick,
  className = '',
}: KPICardProps) {
  return (
    <div
      onClick={onClick}
      className={`${bgColor} rounded-lg p-6 shadow-sm ${borderColor} ${
        onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
      } ${className}`}
    >
      {/* Header with Icon and Title */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>

      {/* Value */}
      {isLoading ? (
        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mb-2" />
      ) : (
        <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
      )}

      {/* Description and Trend */}
      <div className="flex items-center justify-between gap-2">
        <p className="text-gray-600 text-sm">{description}</p>

        {trend && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              trend.direction === 'up'
                ? 'text-green-600'
                : trend.direction === 'down'
                  ? 'text-red-600'
                  : 'text-gray-600'
            }`}
          >
            {trend.direction === 'up' && <TrendingUp size={16} />}
            {trend.direction === 'down' && <TrendingDown size={16} />}
            <span>
              {trend.percentage && `${trend.percentage}%`}
              {trend.label && ` ${trend.label}`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
