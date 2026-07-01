import React, { useState, useMemo } from 'react';
import StatTable from '@/components/features/StatTable';
import FilterBar from '@/components/features/FilterBar';
import EmptyState from '@/components/features/EmptyState';
import LoadingState from '@/components/features/LoadingState';
import ErrorBoundary from '@/components/features/ErrorBoundary';
import AddEmployeeModal from '@/components/AddEmployeeModal';
import { useFilters } from '@/hooks/use-filters';
import { usePagination } from '@/hooks/use-pagination';
import { useApi } from '@/hooks/use-api';
import { formatDate, statusBadgeClass } from '@/utils/formatters';
import { Download, UserPlus } from 'lucide-react';

interface Employee {
  id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  department: string;
  position: string;
  status: string;
  joinDate?: string;
}

export default function Employees() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState('first_name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [employeesList, setEmployeesList] = useState<Employee[]>([]);

  // Mock data - in production, fetch from API
  const mockEmployees: Employee[] = [
    { id: 1, employee_id: 'EMP001', first_name: 'Juan', last_name: 'Dela Cruz', department: 'Sales', position: 'Sales Manager', status: 'Active', email: 'juan@affirm.com', joinDate: '2024-01-15' },
    { id: 2, employee_id: 'EMP002', first_name: 'Maria', last_name: 'Santos', department: 'HR', position: 'HR Officer', status: 'Active', email: 'maria@affirm.com', joinDate: '2023-06-20' },
    { id: 3, employee_id: 'EMP003', first_name: 'Pedro', last_name: 'Lopez', department: 'IT', position: 'Developer', status: 'Active', email: 'pedro@affirm.com', joinDate: '2023-09-10' },
    { id: 4, employee_id: 'EMP004', first_name: 'Ana', last_name: 'Rodriguez', department: 'Finance', position: 'Accountant', status: 'Active', email: 'ana@affirm.com', joinDate: '2024-02-01' },
    { id: 5, employee_id: 'EMP005', first_name: 'Carlos', last_name: 'Reyes', department: 'Operations', position: 'Operations Lead', status: 'Inactive', email: 'carlos@affirm.com', joinDate: '2022-11-05' },
    { id: 6, employee_id: 'EMP006', first_name: 'Lisa', last_name: 'Wong', department: 'IT', position: 'Senior Developer', status: 'Active', email: 'lisa@affirm.com', joinDate: '2023-03-15' },
    { id: 7, employee_id: 'EMP007', first_name: 'Michael', last_name: 'Johnson', department: 'Finance', position: 'Finance Manager', status: 'Active', email: 'michael@affirm.com', joinDate: '2023-07-20' },
  ];

  // Hooks
  const { filters, setSearchTerm, setDepartment, setStatus, reset: resetFilters, hasActiveFilters } = useFilters();
  const { data: apiEmployees, loading } = useApi('/api/employees/list', { autoFetch: true });

  // Use API data or mock, then merge with newly added employees
  const baseEmployees = Array.isArray(apiEmployees) ? apiEmployees : mockEmployees;
  const employees = [...baseEmployees, ...employeesList];

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchSearch = !filters.searchTerm || 
        emp.first_name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        emp.last_name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        emp.employee_id.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      const matchDept = !filters.department || emp.department === filters.department;
      const matchStatus = !filters.status || emp.status === filters.status;
      
      return matchSearch && matchDept && matchStatus;
    });
  }, [employees, filters]);

  // Sort employees
  const sortedEmployees = useMemo(() => {
    const sorted = [...filteredEmployees].sort((a, b) => {
      let aVal = '';
      let bVal = '';

      if (sortBy === 'name') {
        aVal = `${a.first_name} ${a.last_name}`;
        bVal = `${b.first_name} ${b.last_name}`;
      } else if (sortBy === 'department') {
        aVal = a.department;
        bVal = b.department;
      } else if (sortBy === 'status') {
        aVal = a.status;
        bVal = b.status;
      } else if (sortBy === 'join_date') {
        aVal = a.joinDate || '';
        bVal = b.joinDate || '';
      }

      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

    return sorted;
  }, [filteredEmployees, sortBy, sortOrder]);

  // Table columns
  const columns = [
    {
      key: 'employee_id',
      label: 'Employee ID',
      sortable: true,
      render: (value: unknown) => <span className="text-sm font-mono text-gray-600">{value}</span>,
    },
    {
      key: 'first_name',
      label: 'Name',
      sortable: true,
      render: (_: unknown, row: Employee) => (
        <div>
          <p className="font-medium text-gray-900">{row.first_name} {row.last_name}</p>
          <p className="text-sm text-gray-500">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'department',
      label: 'Department',
      sortable: true,
    },
    {
      key: 'position',
      label: 'Position',
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: unknown) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadgeClass(String(value))}`}>
          {value}
        </span>
      ),
    },
    {
      key: 'joinDate',
      label: 'Join Date',
      sortable: true,
      render: (value: unknown) => formatDate(String(value)),
    },
  ];

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const handleAddEmployee = (newEmployee: Employee) => {
    setEmployeesList(prev => [...prev, newEmployee]);
    alert(`✅ Employee "${newEmployee.first_name} ${newEmployee.last_name}" added successfully!`);
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    const dataToExport = sortedEmployees.map((emp) => ({
      'Employee ID': emp.employee_id,
      'Name': `${emp.first_name} ${emp.last_name}`,
      'Department': emp.department,
      'Position': emp.position,
      'Email': emp.email,
      'Status': emp.status,
      'Join Date': formatDate(emp.joinDate),
    }));

    if (format === 'csv') {
      const headers = Object.keys(dataToExport[0]);
      const csv = [
        headers.join(','),
        ...dataToExport.map((row) => headers.map((h) => `"${row[h as keyof typeof row]}"`).join(',')),
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `employees-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    }
  };

  return (
    <ErrorBoundary>
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="px-6 md:px-12 py-12 w-full max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent mb-2">Employee Directory</h1>
              <p className="text-lg text-slate-400">Manage and view all employees in your organization</p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-lg hover:shadow-lg font-medium transition-all flex items-center gap-2 w-fit shadow-lg"
            >
              <UserPlus size={18} />
              Add Employee
            </button>
          </div>

          {/* Filter Bar */}
          <FilterBar
            fields={[
              {
                key: 'searchTerm',
                label: 'Search',
                type: 'text',
                placeholder: 'Search by name, ID, or email...',
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
              {
                key: 'status',
                label: 'Status',
                type: 'select',
                value: filters.status || '',
                onChange: setStatus,
                options: [
                  { label: 'All Status', value: '' },
                  { label: 'Active', value: 'Active' },
                  { label: 'Inactive', value: 'Inactive' },
                ],
              },
            ]}
            onReset={resetFilters}
            hasActiveFilters={hasActiveFilters()}
            className="mb-8"
          />

          {/* Bulk Actions */}
          {selectedRows.length > 0 && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <span className="text-blue-900 font-semibold">{selectedRows.length} employee(s) selected</span>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                  Bulk Edit
                </button>
                <button
                  onClick={() => handleExport('csv')}
                  className="px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <Download size={16} />
                  Export
                </button>
              </div>
            </div>
          )}

          {/* Employee Table */}
          {loading ? (
            <LoadingState variant="table" rows={6} columns={6} />
          ) : sortedEmployees.length === 0 ? (
            <EmptyState
              title="No employees found"
              description="Try adjusting your search or filters to find employees."
              illustration="search"
              action={{
                label: 'Add New Employee',
                onClick: () => alert('Add employee dialog'),
              }}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <StatTable
                data={sortedEmployees}
                columns={columns as any}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
                emptyMessage="No employees found"
                variant="default"
              />

              {/* Table Footer with Export */}
              <div className="px-6 py-4 border-t border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gray-50">
                <span className="text-sm text-gray-600">
                  Showing {sortedEmployees.length} of {employees.length} total employees
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleExport('csv')}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-white transition-colors flex items-center gap-1"
                  >
                    <Download size={14} />
                    Export CSV
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddEmployee}
      />
    </ErrorBoundary>
  );
}
