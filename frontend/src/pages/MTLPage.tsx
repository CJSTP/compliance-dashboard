import React, { useEffect, useState } from 'react';
import { Navbar, StatCard } from '../components';
import { mtlApi } from '../services/api';
import { MTLLicense, MTLStatus } from '../types';

const STATUS_COLORS: Record<MTLStatus, string> = {
  active: '#10b981',
  pending: '#3b82f6',
  expired: '#ef4444',
  surrendered: '#6b7280',
  exempted: '#8b5cf6',
};

const STATUS_LABELS: Record<MTLStatus, string> = {
  active: 'Active',
  pending: 'Pending',
  expired: 'Expired',
  surrendered: 'Surrendered',
  exempted: 'Exempted',
};

const StatusBadge: React.FC<{ status: MTLStatus }> = ({ status }) => (
  <span
    style={{
      background: STATUS_COLORS[status] + '20',
      color: STATUS_COLORS[status],
      border: `1px solid ${STATUS_COLORS[status]}40`,
      padding: '3px 10px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
      whiteSpace: 'nowrap',
    }}
  >
    {STATUS_LABELS[status]}
  </span>
);

const formatDate = (iso?: string) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const daysUntil = (iso?: string): number | null => {
  if (!iso) return null;
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
};

const RenewalCell: React.FC<{ license: MTLLicense }> = ({ license }) => {
  if (license.status !== 'active') return <span style={{ color: '#94a3b8' }}>—</span>;
  const days = daysUntil(license.renewal_due_date);
  if (days === null) return <span style={{ color: '#94a3b8' }}>—</span>;
  const color = days < 30 ? '#ef4444' : days < 90 ? '#f59e0b' : '#10b981';
  return (
    <span style={{ color, fontWeight: '600' }}>
      {formatDate(license.renewal_due_date)}
      <span style={{ fontSize: '11px', marginLeft: '6px', opacity: 0.8 }}>
        ({days < 0 ? `${Math.abs(days)}d overdue` : `in ${days}d`})
      </span>
    </span>
  );
};

const FILTERS: { label: string; value: string }[] = [
  { label: 'All', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Pending', value: 'pending' },
  { label: 'Expired', value: 'expired' },
];

export const MTLPage: React.FC = () => {
  const [licenses, setLicenses] = useState<MTLLicense[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mtlApi.getLicenses().then((res) => {
      setLicenses(res.data);
      setLoading(false);
    });
  }, []);

  const displayed = filter ? licenses.filter((l) => l.status === filter) : licenses;

  const active = licenses.filter((l) => l.status === 'active').length;
  const pending = licenses.filter((l) => l.status === 'pending').length;
  const expired = licenses.filter((l) => l.status === 'expired').length;
  const expiringSoon = licenses.filter((l) => {
    const d = daysUntil(l.renewal_due_date);
    return l.status === 'active' && d !== null && d <= 90;
  }).length;

  return (
    <div>
      <Navbar />
      <div style={{ padding: '24px' }}>
        <h2 style={{ color: '#1e293b', marginBottom: '8px', fontSize: '28px', fontWeight: 'bold' }}>
          MTL License Tracker
        </h2>
        <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '14px' }}>
          Money Transmitter License status by state
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          <StatCard label="Total Licenses" value={licenses.length} color="#3b82f6" />
          <StatCard label="Active" value={active} color="#10b981" />
          <StatCard label="Pending" value={pending} color="#3b82f6" />
          <StatCard label="Expired" value={expired} color="#ef4444" />
          <StatCard label="Renewing ≤ 90 Days" value={expiringSoon} color="#f59e0b" />
        </div>

        {/* Filter buttons */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                padding: '6px 16px',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: filter === f.value ? '#3b82f6' : '#e2e8f0',
                background: filter === f.value ? '#eff6ff' : 'white',
                color: filter === f.value ? '#3b82f6' : '#475569',
                fontWeight: filter === f.value ? '600' : '400',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['State', 'Regulator', 'License No.', 'Status', 'Issue Date', 'Expiry Date', 'Renewal Due', 'Notes'].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading…</td></tr>
              ) : displayed.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No licenses found.</td></tr>
              ) : (
                displayed.map((l, i) => (
                  <tr key={l.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '600', color: '#1e293b' }}>
                      <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>{l.state_code}</span>
                      {l.state}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#475569', fontSize: '13px' }}>{l.regulator ?? '—'}</td>
                    <td style={{ padding: '12px 16px', color: '#475569', fontSize: '13px', fontFamily: 'monospace' }}>{l.license_number ?? '—'}</td>
                    <td style={{ padding: '12px 16px' }}><StatusBadge status={l.status} /></td>
                    <td style={{ padding: '12px 16px', color: '#475569', fontSize: '13px' }}>{formatDate(l.issue_date)}</td>
                    <td style={{ padding: '12px 16px', color: '#475569', fontSize: '13px' }}>{formatDate(l.expiry_date)}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }}><RenewalCell license={l} /></td>
                    <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '12px', maxWidth: '200px' }}>
                      <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {l.notes ?? '—'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
