import React, { useState, useMemo } from 'react';
import KPICard from '@/components/features/KPICard';
import StatTable from '@/components/features/StatTable';
import LoadingState from '@/components/features/LoadingState';
import ErrorBoundary from '@/components/features/ErrorBoundary';
import { useApi, useMutation } from '@/hooks/use-api';
import { formatCurrency } from '@/utils/formatters';
import { TrendingUp, Download, FileText, DollarSign, PieChart } from 'lucide-react';

interface Payslip {
  id: number;
  employee_id: string;
  employee?: { first_name: string; last_name: string };
  gross_salary: number;
  deductions: number;
  net_salary: number;
  status: string;
  period: string;
}

const mockPayslips: Payslip[] = [
  {
    id: 1,
    employee_id: 'EMP001',
    employee: { first_name: 'Juan', last_name: 'Dela Cruz' },
    gross_salary: 45000,
    deductions: 6750,
    net_salary: 38250,
    status: 'Paid',
    period: 'June 2024',
  },
  {
    id: 2,
    employee_id: 'EMP002',
    employee: { first_name: 'Maria', last_name: 'Santos' },
    gross_salary: 38000,
    deductions: 5700,
    net_salary: 32300,
    status: 'Pending',
    period: 'June 2024',
  },
  {
    id: 3,
    employee_id: 'EMP003',
    employee: { first_name: 'Pedro', last_name: 'Lopez' },
    gross_salary: 52000,
    deductions: 7800,
    net_salary: 44200,
    status: 'Approved',
    period: 'June 2024',
  },
];

export default function PayrollPage() {
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedPayslipId, setSelectedPayslipId] = useState<number | null>(null);

  // Fetch payroll data
  const { data: payslipsData, loading: payslipsLoading } = useApi(
    '/api/payroll/list',
    { autoFetch: true }
  );

  // Fetch summary data
  const { data: summaryData, loading: summaryLoading } = useApi(
    '/api/payroll/summary',
    { autoFetch: true }
  );

  const payslips = Array.isArray(payslipsData) ? payslipsData : mockPayslips;

  // Parse summary data
  const stats = {
    totalPayroll: summaryData?.total_payroll || 237000,
    totalDeductions: summaryData?.total_deductions || 35550,
    netPayroll: summaryData?.total_net_payroll || 201450,
    processedCount: summaryData?.processed_count || 0,
    pendingCount: summaryData?.pending_count || 1,
    approvedCount: summaryData?.approved_count || 2,
  };

  // Filter payslips
  const filteredPayslips = filterStatus
    ? payslips.filter((p) => p.status === filterStatus)
    : payslips;

  // Table columns
  const columns = [
    {
      key: 'employee_id',
      label: 'Employee',
      sortable: true,
      render: (_: unknown, row: Payslip) => (
        <div>
          <p className="font-medium text-gray-900">
            {row.employee?.first_name} {row.employee?.last_name}
          </p>
          <p className="text-sm text-gray-500">{row.employee_id}</p>
        </div>
      ),
    },
    {
      key: 'gross_salary',
      label: 'Gross Salary',
      sortable: true,
      render: (value: unknown) => (
        <span className="font-medium text-gray-900">{formatCurrency(Number(value))}</span>
      ),
    },
    {
      key: 'deductions',
      label: 'Deductions',
      sortable: true,
      render: (value: unknown) => (
        <span className="text-red-600 font-medium">{formatCurrency(Number(value))}</span>
      ),
    },
    {
      key: 'net_salary',
      label: 'Net Salary',
      sortable: true,
      render: (value: unknown) => (
        <span className="text-green-600 font-bold">{formatCurrency(Number(value))}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: unknown) => {
        const status = String(value);
        const statusColors: { [key: string]: string } = {
          Paid: 'bg-green-100 text-green-800',
          Pending: 'bg-yellow-100 text-yellow-800',
          Approved: 'bg-blue-100 text-blue-800',
        };
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
          </span>
        );
      },
    },
  ];

  const selectedPayslip = payslips.find((p) => p.id === selectedPayslipId);

  return (
    <ErrorBoundary>
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="px-6 md:px-12 py-12 w-full max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="mb-10">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent mb-2">Payroll Management</h1>
            <p className="text-lg text-slate-400">Manage employee salaries, deductions, and payslips</p>
          </div>
          {/* KPI Cards */}
          {summaryLoading ? (
            <LoadingState variant="kpi" className="mb-8" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <KPICard
                title="Total Payroll"
                value={formatCurrency(stats.totalPayroll)}
                description="Gross payroll amount"
                borderColor="border-l-4 border-teal-500"
                icon={<DollarSign size={20} />}
              />
              <KPICard
                title="Total Deductions"
                value={formatCurrency(stats.totalDeductions)}
                description="SSS, PhilHealth, Pagibig"
                trend={{ direction: 'up', percentage: 1.2 }}
                borderColor="border-l-4 border-orange-500"
                icon={<PieChart size={20} />}
              />
              <KPICard
                title="Net Payroll"
                value={formatCurrency(stats.netPayroll)}
                description="Take-home pay"
                trend={{ direction: 'up', percentage: 2.5 }}
                borderColor="border-l-4 border-green-500"
                icon={<TrendingUp size={20} />}
              />
              <KPICard
                title="Status"
                value={`${stats.processedCount} Paid`}
                description={`${stats.pendingCount} pending, ${stats.approvedCount} approved`}
                borderColor="border-l-4 border-blue-500"
              />
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payslips Table */}
            <div className="lg:col-span-2">
              {/* Filter Bar */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Filter by Status</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">All Status</option>
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                    </select>
                  </div>
                  <div className="flex gap-2 md:mt-6">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2">
                      <Download size={16} />
                      Export
                    </button>
                  </div>
                </div>
              </div>

              {/* Payslips Table */}
              {payslipsLoading ? (
                <LoadingState variant="table" rows={5} columns={5} />
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        {columns.map((col) => (
                          <th key={col.key} className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                            {col.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredPayslips.map((payslip) => (
                        <tr
                          key={payslip.id}
                          onClick={() => setSelectedPayslipId(payslip.id)}
                          className="hover:bg-gray-50 cursor-pointer"
                        >
                          {columns.map((col) => (
                            <td key={col.key} className="px-6 py-4 text-sm text-gray-900">
                              {col.render
                                ? col.render((payslip as any)[col.key], payslip)
                                : (payslip as any)[col.key]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Detail Panel */}
            <div className="lg:col-span-1">
              {selectedPayslip ? (
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 sticky top-20">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Payslip Details</h3>

                  {/* Employee Info */}
                  <div className="mb-6">
                    <p className="text-xs text-gray-600 mb-1">EMPLOYEE</p>
                    <p className="text-lg font-bold text-gray-900">
                      {selectedPayslip.employee?.first_name} {selectedPayslip.employee?.last_name}
                    </p>
                  </div>

                  {/* Salary Breakdown */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200 mb-6">
                    <p className="text-xs text-gray-600 mb-1">GROSS PAY</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {formatCurrency(selectedPayslip.gross_salary)}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-lg border border-red-200 mb-6">
                    <p className="text-xs text-gray-600 mb-1">DEDUCTIONS</p>
                    <p className="text-3xl font-bold text-red-600">
                      {formatCurrency(selectedPayslip.deductions)}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200 mb-6">
                    <p className="text-xs text-gray-600 mb-1">NET PAY</p>
                    <p className="text-3xl font-bold text-green-600">
                      {formatCurrency(selectedPayslip.net_salary)}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-2">Status</p>
                    <span
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        selectedPayslip.status === 'Paid'
                          ? 'bg-green-100 text-green-800'
                          : selectedPayslip.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : selectedPayslip.status === 'Approved'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {selectedPayslip.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center justify-center gap-2">
                      <FileText size={16} />
                      View Full
                    </button>
                    <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 font-medium transition-colors flex items-center justify-center gap-2">
                      <Download size={16} />
                      Download
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
                  <p className="text-gray-600">Select a payslip to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
