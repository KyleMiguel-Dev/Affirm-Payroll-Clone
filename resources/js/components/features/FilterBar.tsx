import React from 'react';
import { X, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface FilterField {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date';
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  value: string;
  onChange: (value: string) => void;
}

interface FilterBarProps {
  fields: FilterField[];
  onReset: () => void;
  hasActiveFilters: boolean;
  showSearchIcon?: boolean;
  className?: string;
}

/**
 * FilterBar Component
 * Consolidates filter/search UI pattern used in:
 * - Employee Management (search name/ID, filter by dept, status)
 * - Attendance (filter by date, dept, status)
 * - Reports (filter by type, date range, dept)
 * - Payroll (filter by status, period)
 *
 * Eliminates duplicate filter UI code across pages
 */
export default function FilterBar({
  fields,
  onReset,
  hasActiveFilters,
  showSearchIcon = true,
  className = '',
}: FilterBarProps) {
  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {showSearchIcon && <Search size={18} className="text-gray-400" />}
          <h3 className="text-lg font-bold text-gray-900">Search & Filter</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            <X size={14} />
            Clear All
          </button>
        )}
      </div>

      {/* Filter Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {fields.map((field) => (
          <div key={field.key}>
            {field.type === 'text' && (
              <Input
                placeholder={field.placeholder || field.label}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className="w-full"
              />
            )}

            {field.type === 'select' && (
              <select
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              >
                <option value="">{field.placeholder || field.label}</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}

            {field.type === 'date' && (
              <input
                type="date"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
