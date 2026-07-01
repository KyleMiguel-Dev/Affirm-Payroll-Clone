import React, { useState } from 'react';
import KPICard from '@/components/features/KPICard';
import FilterBar from '@/components/features/FilterBar';
import LoadingState from '@/components/features/LoadingState';
import ErrorBoundary from '@/components/features/ErrorBoundary';
import { useApi } from '@/hooks/use-api';
import { BarChart3, TrendingUp, Users, DollarSign, Download } from 'lucide-react';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('attendance');
  const [dateRange, setDateRange] = useState('this-month');
  const [department, setDepartment] = useState('');

  // Fetch reports data
  const { data: reportData, loading } = useApi(
    `/api/reports/${reportType === 'attendance' ? 'attendance' : reportType === 'payroll' ? 'payroll' : 'employees'}`,
    { autoFetch: true }
  );

  // Mock statistics based on report type
  const getStats = () => {
    if (reportType === 'attendance') {
      return [
        {
          title: 'Average Attendance',
          value: '236.7',
          description: 'Employees per day',
          trend: { direction: 'up' as const, percentage: 2.3 },
          icon: <Users size={20} />,
          borderColor: 'border-l-4 border-green-500',
        },
        {
          title: 'Highest Month',
          value: 'April',
          description: '242 employees',
          icon: <BarChart3 size={20} />,
          borderColor: 'border-l-4 border-blue-500',
        },
        {
          title: 'Attendance Rate',
          value: '95.2%',
          description: 'Overall performance',
          trend: { direction: 'up' as const, percentage: 1.5 },
          icon: <TrendingUp size={20} />,
          borderColor: 'border-l-4 border-emerald-500',
        },
        {
          title: 'Lowest Month',
          value: 'January',
          description: '225 employees',
          icon: <BarChart3 size={20} />,
          borderColor: 'border-l-4 border-orange-500',
        },
      ];
    } else if (reportType === 'payroll') {
      return [
        {
          title: 'Total Payroll',
          value: '₱14.7M',
          description: 'Last 6 periods',
          trend: { direction: 'up' as const, percentage: 3.2 },
          icon: <DollarSign size={20} />,
          borderColor: 'border-l-4 border-green-500',
        },
        {
          title: 'Average Period',
          value: '₱2.45M',
          description: 'Per period',
          icon: <TrendingUp size={20} />,
          borderColor: 'border-l-4 border-blue-500',
        },
        {
          title: 'Highest Period',
          value: '₱2.67M',
          description: 'June 2026',
          icon: <BarChart3 size={20} />,
          borderColor: 'border-l-4 border-emerald-500',
        },
        {
          title: 'Growth Rate',
          value: '8.9%',
          description: 'Year-over-year',
          trend: { direction: 'up' as const, percentage: 8.9 },
          icon: <TrendingUp size={20} />,
          borderColor: 'border-l-4 border-purple-500',
        },
      ];
    } else {
      return [
        {
          title: 'Total Employees',
          value: '248',
          description: 'Active staff',
          trend: { direction: 'up' as const, percentage: 2.1 },
          icon: <Users size={20} />,
          borderColor: 'border-l-4 border-green-500',
        },
        {
          title: 'New Hires',
          value: '12',
          description: 'This year',
          trend: { direction: 'up' as const, percentage: 5.3 },
          icon: <Users size={20} />,
          borderColor: 'border-l-4 border-blue-500',
        },
        {
          title: 'Retention Rate',
          value: '94.8%',
          description: 'Employee retention',
          trend: { direction: 'up' as const, percentage: 1.2 },
          icon: <TrendingUp size={20} />,
          borderColor: 'border-l-4 border-emerald-500',
        },
        {
          title: 'Turnover',
          value: '3',
          description: 'Employees left',
          trend: { direction: 'down' as const, percentage: 1.2 },
          icon: <BarChart3 size={20} />,
          borderColor: 'border-l-4 border-red-500',
        },
      ];
    }
  };

  const stats = getStats();

  return (
    <ErrorBoundary>
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="px-6 md:px-12 py-12 w-full max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="mb-10">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent mb-2">Reports & Analytics</h1>
            <p className="text-lg text-slate-400">Generate and view detailed reports for your organization</p>
          </div>
          {/* Filter Bar */}
          <FilterBar
            fields={[
              {
                key: 'reportType',
                label: 'Report Type',
                type: 'select',
                value: reportType,
                onChange: setReportType,
                options: [
                  { label: 'Attendance Report', value: 'attendance' },
                  { label: 'Payroll Report', value: 'payroll' },
                  { label: 'Employees Report', value: 'employees' },
                ],
              },
              {
                key: 'dateRange',
                label: 'Date Range',
                type: 'select',
                value: dateRange,
                onChange: setDateRange,
                options: [
                  { label: 'This Month', value: 'this-month' },
                  { label: 'Last Month', value: 'last-month' },
                  { label: 'This Year', value: 'this-year' },
                  { label: 'Custom', value: 'custom' },
                ],
              },
              {
                key: 'department',
                label: 'Department',
                type: 'select',
                value: department,
                onChange: setDepartment,
                options: [
                  { label: 'All Departments', value: '' },
                  { label: 'Sales', value: 'Sales' },
                  { label: 'HR', value: 'HR' },
                  { label: 'IT', value: 'IT' },
                  { label: 'Finance', value: 'Finance' },
                  { label: 'Operations', value: 'Operations' },
                ],
              },
            ]}
            onReset={() => {
              setDateRange('this-month');
              setDepartment('');
            }}
            hasActiveFilters={dateRange !== 'this-month' || department !== ''}
            className="mb-8"
          />

          {/* KPI Cards */}
          {loading ? (
            <LoadingState variant="kpi" className="mb-8" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, idx) => (
                <KPICard
                  key={idx}
                  title={stat.title}
                  value={stat.value}
                  description={stat.description}
                  trend={stat.trend}
                  borderColor={stat.borderColor}
                  icon={stat.icon}
                />
              ))}
            </div>
          )}

          {/* Detailed Metrics Section */}
          {reportType === 'attendance' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Attendance by Department</h3>
                {loading ? (
                  <LoadingState variant="cards" rows={3} />
                ) : (
                  <div className="space-y-4">
                    {[
                      { dept: 'Sales', count: 82 },
                      { dept: 'HR', count: 65 },
                      { dept: 'IT', count: 78 },
                      { dept: 'Finance', count: 71 },
                      { dept: 'Operations', count: 88 },
                    ].map(({ dept, count }) => (
                      <div key={dept} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-900">{dept}</span>
                        <span className="text-lg font-bold text-blue-600">{count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Attendance</h3>
                {loading ? (
                  <LoadingState variant="cards" rows={3} />
                ) : (
                  <div className="space-y-4">
                    {[
                      { month: 'January', rate: 92.3 },
                      { month: 'February', rate: 94.1 },
                      { month: 'March', rate: 93.8 },
                      { month: 'April', rate: 95.2 },
                      { month: 'May', rate: 94.6 },
                    ].map(({ month, rate }) => (
                      <div key={month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-900">{month}</span>
                        <span className="text-lg font-bold text-green-600">{rate}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {reportType === 'payroll' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Payroll by Period</h3>
                {loading ? (
                  <LoadingState variant="cards" rows={3} />
                ) : (
                  <div className="space-y-4">
                    {[
                      { month: 'January', amount: 2.35 },
                      { month: 'February', amount: 2.41 },
                      { month: 'March', amount: 2.38 },
                      { month: 'April', amount: 2.52 },
                      { month: 'May', amount: 2.48 },
                      { month: 'June', amount: 2.67 },
                    ].map(({ month, amount }) => (
                      <div key={month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-900">{month}</span>
                        <span className="text-lg font-bold text-green-600">₱{amount.toFixed(2)}M</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Salary Distribution</h3>
                {loading ? (
                  <LoadingState variant="cards" rows={3} />
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-900">Gross Payroll</span>
                      <span className="text-lg font-bold text-gray-900">₱14.7M</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-900">Total Deductions</span>
                      <span className="text-lg font-bold text-red-600">₱2.2M</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-900">Net Payroll</span>
                      <span className="text-lg font-bold text-green-600">₱12.5M</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {reportType === 'employees' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Employees by Department</h3>
                {loading ? (
                  <LoadingState variant="cards" rows={3} />
                ) : (
                  <div className="space-y-4">
                    {[
                      { dept: 'Sales', count: 42 },
                      { dept: 'HR', count: 28 },
                      { dept: 'IT', count: 38 },
                      { dept: 'Finance', count: 32 },
                      { dept: 'Operations', count: 45 },
                      { dept: 'Admin', count: 21 },
                    ].map(({ dept, count }) => (
                      <div key={dept} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-900">{dept}</span>
                        <span className="text-lg font-bold text-blue-600">{count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Employee Status</h3>
                {loading ? (
                  <LoadingState variant="cards" rows={3} />
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-900">Active</span>
                      <span className="text-lg font-bold text-green-600">241</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-900">On Leave</span>
                      <span className="text-lg font-bold text-yellow-600">5</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-900">Inactive</span>
                      <span className="text-lg font-bold text-gray-600">2</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Export Buttons */}
          <div className="mt-8 flex gap-2 justify-end">
            <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors flex items-center gap-2">
              <Download size={16} />
              Download CSV
            </button>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2">
              <Download size={16} />
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
