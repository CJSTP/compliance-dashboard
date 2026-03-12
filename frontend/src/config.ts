// API configuration
export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'https://compliance-dashboard-1-9d7l.onrender.com';

// Risk level colors
export const RISK_COLORS = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#ef4444',
  critical: '#7c2d12',
};

// Compliance status colors
export const STATUS_COLORS = {
  compliant: '#10b981',
  non_compliant: '#ef4444',
  pending_review: '#f59e0b',
  under_monitoring: '#3b82f6',
};
