import React from 'react';
import { Link } from '@inertiajs/react';

interface HeaderProps {
  currentPage?: string;
}

export default function AffirmHeader({ currentPage }: HeaderProps) {
  const pages = ['Dashboard', 'Employees', 'Attendance', 'Payroll', 'Reports'];
  const routes: { [key: string]: string } = {
    Dashboard: '/dashboard',
    Employees: '/employees',
    Attendance: '/attendance',
    Payroll: '/payroll',
    Reports: '/reports',
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-purple-800 text-white">
      <div className="px-8 py-8">
        {/* Logo and Title Section */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
            <span className="text-2xl">🏢</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold">Affirm</h1>
            <h2 className="text-2xl font-bold">Payroll</h2>
            <h3 className="text-2xl font-bold">System</h3>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-6">
          {pages.map((page) => (
            <Link
              key={page}
              href={routes[page]}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currentPage === page
                  ? 'bg-white/25 border border-white/40'
                  : 'hover:bg-white/15'
              }`}
            >
              {page}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
