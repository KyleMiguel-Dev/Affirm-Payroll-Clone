# 🚀 Quick Start Guide - Affirm Payroll System

## 5-Minute Setup

### Prerequisites
```
✅ PHP 8.2+
✅ Node.js 18+
✅ MySQL 8.0+
✅ Composer
✅ npm or pnpm
```

---

## Step 1: Install Dependencies (2 min)

```bash
cd c:\Users\Kyle\Herd\Affirm-Payroll-Clone

# Install PHP packages
composer install

# Install Node packages
pnpm install
# or: npm install
```

---

## Step 2: Configure Environment (1 min)

```bash
# Copy environment file
cp .env.example .env

# Generate app key
php artisan key:generate

# Configure database in .env:
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=affirm_payroll
DB_USERNAME=root
DB_PASSWORD=
```

---

## Step 3: Database Setup (1 min)

```bash
# Create database
mysql -u root -e "CREATE DATABASE IF NOT EXISTS affirm_payroll;"

# Run migrations
php artisan migrate

# Seed sample data (important!)
php artisan db:seed --class=AffirmPayrollSeeder
```

---

## Step 4: Run Development Servers (1 min)

### Terminal 1: Laravel Server
```bash
php artisan serve
```
Server runs at: http://localhost:8000

### Terminal 2: Vite Dev Server
```bash
npm run dev
```

---

## Step 5: Login 🎉

**URL**: http://localhost:8000

**Credentials**:
- Email: `admin@affirm.com`
- Password: `password`

Or use test account:
- Email: `test@example.com`
- Password: `password`

---

## 📊 What You'll See

### Dashboard
- 248 Total Employees (Green card)
- 235 Present Today at 94.8% (Blue card)
- ₱2.4M Pending Payroll (Orange card)
- ₱2.45M Monthly Payroll (Purple card)
- Weekly attendance chart (Mon-Sat)
- 4 upcoming HR events
- Payroll trends chart
- Recent activities

### Navigation
1. **Dashboard** - System overview
2. **Employees** - 248 staff with filters
3. **Attendance** - Daily tracking
4. **Payroll** - Salary processing
5. **Reports** - Analytics

---

## 🎨 Sample Data

✅ **248 Employees** with:
- Multiple departments (Sales, HR, IT, Finance, Operations)
- Various positions and statuses
- Realistic salary data

✅ **6 Payroll Periods** with:
- Gross salaries, allowances, deductions
- Complete payslip details
- Sample: Juan Dela Cruz earning ₱37,750 net

✅ **Weekly Attendance** (Mon-Sat):
- 248, 236, 224, 228, 235, 98 employees

✅ **4 Upcoming Events**:
- Payroll Cut-off (June 30)
- Salary Release (July 10)
- SSS Payment (July 15)
- PhilHealth Payment (July 20)

---

## 🛠️ Common Commands

```bash
# Build for production
npm run build

# Check TypeScript
npm run types:check

# Lint code
npm run lint

# Format code
npm run format

# Run tests
php artisan test

# Clear cache
php artisan cache:clear

# View logs
tail -f storage/logs/laravel.log
```

---

## 🌙 Dark Mode

Click the **☀️ Light** or **🌙 Dark** button in the header to toggle theme.

---

## 🔄 Auto-Refresh

Dashboard refreshes every 30 seconds. Toggle **🔄 Live** / **⏸ Paused** button in top-right.

---

## 📱 Responsive Design

Works on:
- ✅ Desktop (1025px+)
- ✅ Tablet (641px-1024px)
- ✅ Mobile (375px-640px)

---

## 🐛 Troubleshooting

### "Connection refused"
```bash
# Make sure Laravel is running
php artisan serve
```

### Database errors
```bash
# Reset database
php artisan migrate:fresh
php artisan db:seed --class=AffirmPayrollSeeder
```

### CSS/JS not loading
```bash
# Rebuild assets
npm run build
```

### No data showing
```bash
# Verify seeder ran
php artisan db:seed --class=AffirmPayrollSeeder
# Check: php artisan tinker
# Then: >>> Employee::count()
```

---

## 📊 API Endpoints

All endpoints return JSON:

```
GET  /api/dashboard/stats       - Dashboard data
GET  /api/employees/list        - Employee list
GET  /api/attendance/list       - Attendance records
GET  /api/payroll/list          - Payslips
GET  /api/reports/attendance    - Attendance report
GET  /api/reports/payroll       - Payroll report
GET  /api/reports/employees     - Employee report
```

---

## 🎯 Next Steps

1. ✅ **Explore the Dashboard** - See all KPIs and charts
2. ✅ **Filter Employees** - Try different department/status filters
3. ✅ **Check Payroll** - View sample payslip details
4. ✅ **Review Reports** - See different report types
5. ✅ **Dark Mode** - Toggle dark mode theme

---

## 💡 Tips

- **Search**: Use search box to find employees by name or ID
- **Filters**: Combine multiple filters for better results
- **Charts**: Hover over charts for tooltips
- **Details**: Click "View" to see payslip details
- **Responsive**: Resize browser to test mobile layout

---

## 📚 Documentation

- 📖 **SYSTEM_CLONE_GUIDE.md** - Full system documentation
- ✅ **IMPLEMENTATION_CHECKLIST.md** - Feature completion status
- 🚀 **This file** - Quick start guide

---

## 🆘 Support

**For issues:**
1. Check Laravel logs: `tail -f storage/logs/laravel.log`
2. Check browser console: Press F12 → Console tab
3. Verify database: Run `php artisan tinker` and check model counts

---

## ✨ Features Implemented

✅ Purple gradient header
✅ 5-page navigation
✅ KPI cards (4 colored)
✅ Weekly attendance chart
✅ Upcoming events list
✅ Quick actions (4 buttons)
✅ Employee management
✅ Attendance tracking
✅ Payroll processing
✅ Reports & analytics
✅ Dark mode
✅ Responsive design
✅ Sample data (248 employees)
✅ Auto-refresh

---

## 🎉 You're Ready!

```bash
# One-liner to get started:
composer install && npm install && php artisan migrate && php artisan db:seed --class=AffirmPayrollSeeder && php artisan serve
```

Then in another terminal:
```bash
npm run dev
```

Visit: http://localhost:8000 🚀

---

**Happy coding! 💻**

*Affirm Payroll System v3.0 | Production Ready ✅*
