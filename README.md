# Affirm Payroll System

A modern, professional HR and payroll management system built with Laravel 13, React 18, and TypeScript. Features real-time data updates, employee management, attendance tracking, payroll processing, and comprehensive reporting.

## Features

- 🎯 **Employee Management** - Add, view, and manage employees with export functionality
- 💰 **Payroll Management** - Track salaries, deductions, and process payslips
- 📊 **Attendance Tracking** - Real-time attendance monitoring with live statistics
- 📈 **Reports & Analytics** - Generate comprehensive reports with custom filters
- 🔐 **Authentication** - Secure Fortify authentication with email verification
- 🎨 **Modern UI** - Professional dark theme with responsive design
- ⚡ **Real-time Updates** - Live data polling for up-to-date metrics

## Technology Stack

- **Backend**: Laravel 13 with Fortify authentication
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite 8.0.16
- **Styling**: Tailwind CSS v4 + Radix UI
- **Icons**: Lucide React
- **Database**: MySQL

## Getting Started

### Prerequisites

- PHP 8.2+
- Node.js 18+
- Composer
- MySQL 8.0+

### Installation

1. **Clone and install dependencies**
```bash
composer install
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
php artisan key:generate
```

3. **Setup database**
```bash
php artisan migrate:fresh --seed
```

4. **Start development servers**
```bash
# Terminal 1: Laravel development server
php artisan serve --host affirm-payroll-clone.test --port 8000

# Terminal 2: Vite development server
npm run dev
```

5. **Access the application**
Navigate to `http://affirm-payroll-clone.test:8000`

## Available Scripts

- `npm run dev` - Start Vite development server with HMR
- `npm run build` - Build for production
- `php artisan serve` - Start Laravel development server

## Project Structure

```
resources/
├── js/
│   ├── pages/           # Page components (Dashboard, Employees, Payroll, etc.)
│   ├── components/      # Reusable UI components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API and real-time services
│   └── utils/          # Utility functions
├── css/                # Tailwind CSS
└── views/              # Blade templates
```

## Key Pages

- **Dashboard** - Overview with KPIs and charts
- **Employees** - Employee directory with search and export
- **Payroll** - Salary and payslip management
- **Attendance** - Real-time attendance tracking
- **Reports** - Custom report generation
- **Settings** - System configuration

## Performance

- Build time: ~10-35 seconds
- 2300+ modules optimized
- Responsive design with full mobile support
- Real-time data updates with 30-60 second polling

## License

Proprietary - All rights reserved
