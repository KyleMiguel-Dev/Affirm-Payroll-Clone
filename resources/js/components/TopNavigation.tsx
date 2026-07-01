import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, Users, DollarSign, Clock, BarChart3, Settings, LogOut, User, ChevronDown } from 'lucide-react';

export default function TopNavigation() {
  const page = usePage();
  const currentPage = page.component;
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, component: 'dashboard' },
    { name: 'Employees', href: '/employees', icon: Users, component: 'employees/index' },
    { name: 'Payroll', href: '/payroll', icon: DollarSign, component: 'payroll/index' },
    { name: 'Attendance', href: '/attendance', icon: Clock, component: 'attendance/index' },
    { name: 'Reports', href: '/reports', icon: BarChart3, component: 'reports/index' },
    { name: 'Settings', href: '/settings', icon: Settings, component: 'settings/index' },
  ];

  const isActive = (component: string) => {
    return currentPage?.includes(component);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 shadow-lg">
      <div className="px-6 py-4 max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo/Brand - Enterprise Payroll Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 mr-8 hover:opacity-85 transition-opacity">
          {/* Professional Payroll System Logo - Document, Person, Peso */}
          <div className="w-11 h-11 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-xl relative overflow-hidden border border-blue-400/30">
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"></div>
            
            {/* Main logo design - Document, Person, Peso */}
            <svg className="w-7 h-7 text-white relative z-10" viewBox="0 0 24 24" fill="currentColor">
              {/* Document/Paper Icon (left) */}
              <rect x="2" y="2" width="7" height="10" rx="0.5" fillOpacity="0.9"/>
              <line x1="3.5" y1="4" x2="7.5" y2="4" stroke="white" strokeWidth="0.8" strokeOpacity="0.7"/>
              <line x1="3.5" y1="6" x2="7.5" y2="6" stroke="white" strokeWidth="0.8" strokeOpacity="0.7"/>
              
              {/* Person Icon (center) */}
              <circle cx="12" cy="5" r="2" fillOpacity="0.95"/>
              <path d="M 10 8.5 Q 12 9.5 14 8.5 L 14 12 Q 12 13 10 12 Z" fillOpacity="0.9"/>
              
              {/* Peso Symbol Circle (right) */}
              <circle cx="19" cy="10" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.8"/>
              <circle cx="19" cy="10" r="4" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5"/>
              {/* Peso symbol ₱ */}
              <text x="19" y="11.5" fontSize="5" fontWeight="bold" textAnchor="middle" fill="currentColor" opacity="0.95">₱</text>
            </svg>
            
            {/* Premium accent dots */}
            <div className="absolute top-1 right-1 w-2 h-2 bg-gradient-to-r from-cyan-300 to-blue-400 rounded-full shadow-lg"></div>
            <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-amber-300 rounded-full opacity-70"></div>
          </div>
          
          <div className="hidden md:flex flex-col">
            <span className="text-base font-bold text-white leading-tight tracking-tight">Affirm</span>
            <span className="text-xs font-semibold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent leading-tight">Payroll System</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.component);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  active
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon size={18} />
                <span className="hidden md:inline">{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* User Menu */}
        <div className="ml-4 flex items-center gap-3 relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-slate-700/60 to-slate-700/40 hover:from-slate-700 hover:to-slate-600 transition-all border border-slate-600/50 group shadow-lg"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-md">
              A
            </div>
            <span className="text-sm font-semibold text-white group-hover:text-blue-200 transition-colors">Admin</span>
            <ChevronDown size={16} className="text-slate-300 group-hover:text-slate-100 transition-colors" />
          </button>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-700/50">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Logged in as</p>
                <p className="text-sm font-bold text-white mt-1">Administrator</p>
              </div>
              <Link href="/settings" className="flex items-center gap-3 px-4 py-2.5 text-slate-200 hover:bg-slate-700/50 hover:text-blue-300 transition-all group">
                <User size={16} className="group-hover:text-blue-400" />
                <span className="text-sm">Profile & Settings</span>
              </Link>
              <button
                onClick={() => {
                  window.location.href = '/logout';
                }}
                className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-slate-200 hover:bg-red-900/40 hover:text-red-300 transition-all border-t border-slate-700/50 mt-1 group"
              >
                <LogOut size={16} className="group-hover:text-red-400" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
