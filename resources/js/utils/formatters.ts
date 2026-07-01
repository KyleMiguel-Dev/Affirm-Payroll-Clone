/**
 * Utility functions for formatting and type conversion
 */

export const formatCurrency = (value: any, defaultValue = '₱0.00'): string => {
  if (value === null || value === undefined) return defaultValue;
  
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  
  if (isNaN(num)) return defaultValue;
  
  return `₱${num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

export const formatNumber = (value: any, decimals = 0): string => {
  if (value === null || value === undefined) return '0';
  
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  
  if (isNaN(num)) return '0';
  
  return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const formatDate = (date: any, format = 'MMM DD, YYYY'): string => {
  if (!date) return '-';
  
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '-';
    
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  } catch {
    return '-';
  }
};

export const formatTime = (time: any): string => {
  if (!time) return '-';
  
  try {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const min = parseInt(minutes, 10);
    
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    
    return `${displayHour}:${String(min).padStart(2, '0')} ${period}`;
  } catch {
    return time;
  }
};

export const formatPercentage = (value: any, decimals = 1): string => {
  if (value === null || value === undefined) return '0%';
  
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  
  if (isNaN(num)) return '0%';
  
  return `${num.toFixed(decimals)}%`;
};

export const truncateText = (text: any, length = 50): string => {
  if (!text) return '';
  
  const str = String(text);
  return str.length > length ? `${str.substring(0, length)}...` : str;
};

export const capitalize = (text: any): string => {
  if (!text) return '';
  
  const str = String(text).toLowerCase();
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const statusBadgeClass = (status: any): string => {
  const normalized = String(status).toLowerCase();
  
  const statusMap: { [key: string]: string } = {
    active: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    inactive: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300',
    present: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300',
    absent: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
    late: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300',
    onleave: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    approved: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    rejected: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
  };
  
  return statusMap[normalized] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
};
