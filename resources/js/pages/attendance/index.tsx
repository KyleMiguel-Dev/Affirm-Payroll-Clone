import React, { useState, useMemo } from 'react';
import KPICard from '@/components/features/KPICard';
import StatTable from '@/components/features/StatTable';
import FilterBar from '@/components/features/FilterBar';
import LoadingState from '@/components/features/LoadingState';
import ErrorBoundary from '@/components/features/ErrorBoundary';
import { useFilters } from '@/hooks/use-filters';
import { useRealTimeData } from '@/hooks/use-real-time-data';
import { useApi } from '@/hooks/use-api';
import { formatDate, formatTime } from '@/utils/formatters';
import { Users, Clock, AlertCircle, Calendar, Download } from 'lucide-react';

interface AttendanceRecord {
  id: number;
  employee_id: string;
  employee?: { first_name: string; last_name: string };
  date: string;
  check_in: string;
  check_out?: string;
  status: 'present' | 'absent' | 'late' | 'on_leave';
  hours_worked?: number;
  department?: string;
}

interface AttendanceStats {
  present: number;
  absent: number;
  late: number;
  on_leave: number;
  attendance_rate: number;
  date: string;
}

export default function AttendancePage() {
  const [currentPage] = useState('Attendance');

  // Real-time attendance status (updates every 30 seconds)
  const { data: liveStatus } = useRealTimeData('attendance.status', {
    pollingInterval: 30000,
  });

  // Fetch full attendance records
  const { data: recordsData, loading: recordsLoading } = useApi(
    '/api/attendance/list',
    { autoFetch: true }
  );

  // Mock data
  const mockRecords: AttendanceRecord[] = [
    { id: 1, employee_id: 'EMP001', employee: { first_name: 'Juan', last_name: 'Dela Cruz' }, date: '2026-07-01', check_in: '08:15', check_out: '17:30', status: 'present', hours_worked: 9.25, department: 'Sales' },
    { id: 2, employee_id: 'EMP002', employee: { first_name: 'Maria', last_name: 'Santos' }, date: '2026-07-01', check_in: '08:30', check_out: '17:45', status: 'present', hours_worked: 9.25, department: 'HR' },
    { id: 3, employee_id: 'EMP003', employee: { first_name: 'Pedro', last_name: 'Lopez' }, date: '2026-07-01', check_in: undefined, status: 'absent', hours_worked: 0, department: 'IT' },
    { id: 4, employee_id: 'EMP004', employee: { first_name: 'Ana', last_name: 'Rodriguez' }, date: '2026-07-01', check_in: '09:10', check_out: '18:00', status: 'late', hours_worked: 8.83, department: 'Finance' },
    { id: 5, employee_id: 'EMP005', employee: { first_name: 'Carlos', last_name: 'Reyes' }, date: '2026-07-01', check_in: undefined, status: 'on_leave', hours_worked: 0, department: 'Operations' },
  ];

  const records = Array.isArray(recordsData) ? recordsData : mockRecords;

  // Hooks
  const { filters, setSearchTerm, setDepartment, reset: resetFilters, hasActiveFilters } = useFilters();

  // Stats (real-time or fallback)
  const stats: AttendanceStats = {
    present: liveStatus?.present || 235,
    absent: liveStatus?.absent || 8,
    late: liveStatus?.late || 3,
    on_leave: liveStatus?.on_leave || 2,
    attendance_rate: liveStatus?.attendance_rate || 94.8,
    date: liveStatus?.date || new Date().toISOString().split('T')[0],
  };

  // Filter records
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const matchSearch = !filters.searchTerm ||
        rec.employee?.first_name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        rec.employee?.last_name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        rec.employee_id.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const matchDept = !filters.department || rec.department === filters.department;

      return matchSearch && matchDept;
    });
  }, [records, filters]);

  // Table columns
  const columns = [
    {
      key: 'employee_id',
      label: 'Employee',
      sortable: true,
      render: (_: unknown, row: AttendanceRecord) => (
        <div>
          <p className="font-medium text-gray-900">
            {row.employee?.first_name} {row.employee?.last_name}
          </p>
          <p className="text-sm text-gray-500">{row.employee_id}</p>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (value: unknown) => formatDate(String(value)),
    },
    {
      key: 'check_in',
      label: 'Check In',
      render: (value: unknown) => value ? formatTime(String(value)) : '-',
    },
    {
      key: 'check_out',
      label: 'Check Out',
      render: (value: unknown) => value ? formatTime(String(value)) : '-',
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: unknown) => {
        const status = String(value);
        const colors = {
          present: 'bg-green-100 text-green-800',
          absent: 'bg-red-100 text-red-800',
          late: 'bg-yellow-100 text-yellow-800',
          on_leave: 'bg-blue-100 text-blue-800',
        };
        const labels = {
          present: '✓ Present',
          absent: '✗ Absent',
          late: '⚠ Late',
          on_leave: '📅 On Leave',
        };
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
            {labels[status as keyof typeof labels] || status}
          </span>
        );
      },
    },
    {
      key: 'hours_worked',
      label: 'Hours',
      render: (value: unknown) => value ? `${Number(value).toFixed(2)}h` : '-',
    },
  ];

  return (
    <ErrorBoundary>
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="px-6 md:px-12 py-12 w-full max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="mb-10">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent mb-2">Attendance Tracking</h1>
            <p className="text-lg text-slate-400">Monitor real-time attendance and employee presence</p>
          </div>

          {/* Real-Time KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KPICard
              title="Present Today"
              value={stats.present}
              description={`${stats.attendance_rate}% attendance rate`}
              trend={{ direction: 'up', percentage: 1.2 }}
              borderColor="border-l-4 border-green-500"
              icon={<Users size={20} />}
            />

            <KPICard
              title="Absent Today"
              value={stats.absent}
              description="Not clocked in"
              borderColor="border-l-4 border-red-500"
              icon={<AlertCircle size={20} />}
            />

            <KPICard
              title="Late Arrivals"
              value={stats.late}
              description="After 9:00 AM"
              borderColor="border-l-4 border-yellow-500"
              icon={<Clock size={20} />}
            />

            <KPICard
              title="On Leave"
              value={stats.on_leave}
              description="Approved leaves"
              borderColor="border-l-4 border-blue-500"
              icon={<Calendar size={20} />}
            />
          </div>

          {/* Filter Bar */}
          <FilterBar
            fields={[
              {
                key: 'searchTerm',
                label: 'Search',
                type: 'text',
                placeholder: 'Search by name or ID...',
                value: filters.searchTerm || '',
                onChange: setSearchTerm,
              },
              {
                key: 'department',
                label: 'Department',
                type: 'select',
                value: filters.department || '',
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
            onReset={resetFilters}
            hasActiveFilters={hasActiveFilters()}
            className="mb-8"
          />

          {/* Export Button */}
          <div className="mb-6 flex justify-end">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2">
              <Download size={16} />
              Export Report
            </button>
          </div>

          {/* Attendance Records Table */}
          {recordsLoading ? (
            <LoadingState variant="table" rows={6} columns={6} />
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <StatTable
                data={filteredRecords}
                columns={columns as any}
                emptyMessage="No attendance records found"
              />

              {/* Table Footer */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Showing {filteredRecords.length} of {records.length} records
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
