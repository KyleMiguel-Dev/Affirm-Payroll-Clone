import React, { useState } from 'react';
import KPICard from '@/components/features/KPICard';
import LiveClock from '@/components/features/LiveClock';
import LoadingState from '@/components/features/LoadingState';
import ErrorBoundary from '@/components/features/ErrorBoundary';
import { useRealTimeData } from '@/hooks/use-real-time-data';
import { useApi } from '@/hooks/use-api';
import { formatCurrency } from '@/utils/formatters';
import { TrendingUp, TrendingDown, Users, Clock, DollarSign, Calendar } from 'lucide-react';

export default function Dashboard() {
  const [currentPage] = useState('Dashboard');

  // Real-time KPI updates (auto-refresh every 30 seconds)
  const { data: kpiData, isUpdating: kpiUpdating } = useRealTimeData(
    'dashboard.kpi',
    { pollingInterval: 30000 }
  );

  // Fetch full dashboard stats for charts and activities
  const { data: statsData, loading: statsLoading } = useApi(
    '/api/dashboard/stats',
    { autoFetch: true }
  );

  // Fetch pending leave requests
  const { data: pendingLeaves, loading: leavesLoading } = useApi(
    '/api/leave-requests/pending',
    { autoFetch: true }
  );

  // Parse KPI data with fallbacks
  const kpiValues = {
    totalEmployees: kpiData?.total_employees || statsData?.summary?.total_employees || 248,
    presentToday: kpiData?.present_today || 235,
    attendanceRate: kpiData?.attendance_rate || 94.8,
    pendingPayroll: kpiData?.pending_payroll || 0,
    totalPayroll: kpiData?.total_payroll || statsData?.summary?.total_payroll_raw || 0,
    totalDeductions: kpiData?.total_deductions || 0,
    onLeaveToday: kpiData?.on_leave_today || 0,
    lateToday: kpiData?.late_today || 0,
  };

  return (
    <ErrorBoundary>
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="px-6 md:px-12 py-12 w-full max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="mb-10">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-2">Dashboard</h1>
            <p className="text-lg text-slate-400">Unified Payroll Command Center</p>
          </div>
          {/* Real-Time KPI Cards with Loading State */}
          {statsLoading ? (
            <LoadingState variant="kpi" className="mb-8" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <KPICard
                title="Total Employees"
                value={kpiValues.totalEmployees}
                description="+5 this month"
                trend={{
                  direction: 'up',
                  percentage: 2,
                  label: 'vs last month',
                }}
                borderColor="border-l-4 border-green-500"
                icon={<Users size={20} />}
                isLoading={false}
              />

              <KPICard
                title="Present Today"
                value={kpiValues.presentToday}
                description={`${kpiValues.attendanceRate}% attendance rate`}
                trend={{
                  direction: 'up',
                  percentage: 1.2,
                  label: 'improvement',
                }}
                borderColor="border-l-4 border-blue-500"
                icon={<Clock size={20} />}
                isLoading={kpiUpdating}
              />

              <KPICard
                title="Pending Payroll"
                value={formatCurrency(kpiValues.totalPayroll)}
                description={`${kpiValues.pendingPayroll} periods to process`}
                trend={{
                  direction: 'neutral',
                  label: 'processing',
                }}
                borderColor="border-l-4 border-orange-500"
                icon={<DollarSign size={20} />}
                isLoading={kpiUpdating}
              />

              <KPICard
                title="Absent Today"
                value={248 - kpiValues.presentToday - kpiValues.onLeaveToday}
                description={`${kpiValues.onLeaveToday} on leave`}
                trend={{
                  direction: 'down',
                  label: 'vs yesterday',
                }}
                borderColor="border-l-4 border-red-500"
                icon={<Calendar size={20} />}
                isLoading={kpiUpdating}
              />
            </div>
          )}

          {/* Charts and Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Weekly Attendance Chart */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-6">📊 Weekly Attendance</h2>

              {statsLoading ? (
                <LoadingState variant="cards" rows={1} className="mt-4" />
              ) : (
                <div className="flex items-end justify-around gap-3 h-64">
                  {[
                    { day: 'Mon', count: 248, total: 248 },
                    { day: 'Tue', count: 236, total: 248 },
                    { day: 'Wed', count: 224, total: 248 },
                    { day: 'Thu', count: 228, total: 248 },
                    { day: 'Fri', count: 235, total: 248 },
                    { day: 'Sat', count: 98, total: 248 },
                  ].map((day, idx) => {
                    const percentage = (day.count / day.total) * 100;
                    return (
                      <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                        <div className="relative w-full flex items-end justify-center h-48">
                          <div
                            className="w-full max-w-12 bg-gradient-to-t from-blue-600 to-blue-400 rounded-lg transition-all hover:shadow-lg"
                            style={{ height: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-900">{day.day}</span>
                        <span className="text-xs text-gray-500">{percentage.toFixed(0)}%</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Payroll Summary */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-6">💰 Payroll Summary</h2>

              {statsLoading ? (
                <LoadingState variant="cards" rows={3} />
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <p className="text-sm text-gray-600">Gross Payroll</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(kpiValues.totalPayroll)}
                      </p>
                    </div>
                    <TrendingUp className="text-green-600" size={24} />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                    <div>
                      <p className="text-sm text-gray-600">Total Deductions</p>
                      <p className="text-2xl font-bold text-red-600">
                        {formatCurrency(kpiValues.totalDeductions)}
                      </p>
                    </div>
                    <TrendingDown className="text-red-600" size={24} />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div>
                      <p className="text-sm text-gray-600">Net Payroll</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(kpiValues.totalPayroll - kpiValues.totalDeductions)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pending Leave Requests */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-6">🗓️ Pending Leave Requests</h2>

            {leavesLoading ? (
              <LoadingState variant="cards" rows={3} />
            ) : Array.isArray(pendingLeaves) && pendingLeaves.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">
                        Employee
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900 hidden md:table-cell">
                        Leave Type
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900 hidden md:table-cell">
                        Duration
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {pendingLeaves.slice(0, 5).map((leave: any) => (
                      <tr key={leave.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-900 font-medium">
                          {leave.employee_name}
                        </td>
                        <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                          {leave.leave_type}
                        </td>
                        <td className="px-4 py-3 text-gray-600 hidden md:table-cell text-xs">
                          {leave.start_date} → {leave.end_date} ({leave.days} days)
                        </td>
                        <td className="px-4 py-3">
                          <button className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200">
                            Approve
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-600 py-4">No pending leave requests</p>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

