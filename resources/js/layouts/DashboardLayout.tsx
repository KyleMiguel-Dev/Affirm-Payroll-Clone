import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

interface LayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function DashboardLayout({ children, title }: LayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const isDark = document.documentElement.classList.contains('dark');
        setDarkMode(isDark);
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', !darkMode ? 'dark' : 'light');
    };

    const navItems = [
        { label: 'Dashboard', href: '/dashboard', icon: '📊' },
        { label: 'Employees', href: '/employees', icon: '👥' },
        { label: 'Attendance', href: '/attendance', icon: '📍' },
        { label: 'Payroll', href: '/payroll', icon: '💰' },
        { label: 'Reports', href: '/reports', icon: '📈' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
            {/* Premium Header */}
            <header className="sticky top-0 z-50 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 dark:from-purple-900 dark:via-slate-800 dark:to-indigo-900 text-white shadow-2xl border-b border-purple-400/20">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo Section */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <span className="text-2xl">☰</span>
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="text-3xl font-bold">🏢</div>
                                <div className="hidden sm:block">
                                    <h1 className="text-xl font-bold tracking-tight">Affirm Payroll</h1>
                                    <p className="text-purple-200 text-xs">Enterprise HR & Payroll</p>
                                </div>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors duration-200 flex items-center gap-2"
                                >
                                    <span>{item.icon}</span>
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </nav>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                title={darkMode ? 'Light Mode' : 'Dark Mode'}
                            >
                                <span className="text-xl">{darkMode ? '☀️' : '🌙'}</span>
                            </button>
                            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-white/20">
                                <div className="text-right">
                                    <p className="text-sm font-semibold">Test User</p>
                                    <p className="text-xs text-purple-200">Administrator</p>
                                </div>
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                                    T
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {sidebarOpen && (
                        <div className="lg:hidden pb-4 space-y-1 border-t border-white/10">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="block px-4 py-3 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors duration-200"
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    {item.icon} {item.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {title && (
                        <div className="mb-8 animate-fade-in">
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
                            <div className="h-1 w-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"></div>
                            <p className="text-gray-600 dark:text-gray-400 mt-3 text-sm">
                                Last updated: {new Date().toLocaleString()}
                            </p>
                        </div>
                    )}
                    {children}
                </div>
            </main>

            {/* Premium Footer */}
            <footer className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-slate-800 dark:to-slate-900 border-t border-gray-200 dark:border-slate-700 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <p className="text-gray-700 dark:text-gray-300 font-semibold">
                            Affirm Payroll System v3.0
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                            Enterprise HR & Payroll Management Platform
                        </p>
                        <p className="text-gray-500 dark:text-gray-500 text-xs mt-3">
                            © 2026 Affirm Technology Inc. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
