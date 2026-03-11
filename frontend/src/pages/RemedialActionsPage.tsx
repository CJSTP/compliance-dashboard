import React, { useEffect, useState } from 'react';
import { Navbar, StatCard } from '../components';
import { remedialApi } from '../services/api';
import { RemedialAction, ActionStatus, RiskLevel } from '../types';

const PRIORITY_COLORS: Record<RiskLevel, string> = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#ef4444',
  critical: '#7c3aed',
};

const STATUS_COLORS: Record<ActionStatus, string> = {
  open: '#3b82f6',
  in_progress: '#f59e0b',
  completed: '#10b981',
  overdue: '#ef4444',
  closed: '#6b7280',
};

const STATUS_LABELS: Record<ActionStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  completed: 'Completed',
  overdue: 'Overdue',
  closed: 'Closed',
};

const SOURCE_LABELS: Record<string, string> = {
  exam: 'Exam',
  self_identified: 'Self-ID',
  audit: 'Audit',
  regulatory_inquiry: 'Reg. Inquiry',
  complaint: 'Complaint',
};

const Badge: React.FC<{ label: string; color: string }> = ({ label, color }) => (
  <span
    style={{
      background: color + '18',
      color,
      border: `1px solid ${color}40`,
      padding: '3px 9px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
      whiteSpace: 'nowrap',
    }}
  >
    {label}
  </span>
);

const formatDate = (iso?: string) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const DueCell: React.FC<{ action: RemedialAction }> = ({ action }) => {
  if (!action.due_date) return <span style={{ color: '#94a3b8' }}>—</span>;
  const days = Math.ceil((new Date(action.due_date).getTime() - Date.now()) / 86400000);
  const done = ['completed', 'closed'].includes(action.status);
  if (done) return <span style={{ color: '#10b981' }}>{formatDate(action.due_date)}</span>;
  const color = days < 0 ? '#ef4444' : days <= 14 ? '#f59e0b' : '#475569';
  return (
    <span style={{ color, fontWeight: days < 0 ? '600' : '400' }}>
      {formatDate(action.due_date)}
      {days < 0 && <span style={{ fontSize: '11px', marginLeft: '5px' }}>({Math.abs(days)}d overdue)</span>}
      {days >= 0 && days <= 14 && <span style={{ fontSize: '11px', marginLeft: '5px' }}>(in {days}d)</span>}
    </span>
  );
};

const STATUS_FILTERS = ['', 'open', 'in_progress', 'overdue', 'completed', 'closed'];
const STATUS_FILTER_LABELS: Record<string, string> = {
  '': 'All',
  open: 'Open',
  in_progress: 'In Progress',
  overdue: 'Overdue',
  completed: 'Completed',
  closed: 'Closed',
};

export const RemedialActionsPage: React.FC = () => {
  const [actions, setActions] = useState<RemedialAction[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    remedialApi.getActions().then((res) => {
      setActions(res.data);
      setLoading(false);
    });
  }, []);

  const displayed = filter ? actions.filter((a) => a.status === filter) : actions;

  const open = actions.filter((a) => a.status === 'open').length;
  const inProgress = actions.filter((a) => a.status === 'in_progress').length;
  const overdue = actions.filter((a) => a.status === 'overdue').length;
  const critical = actions.filter((a) => a.priority === 'critical' && !['completed', 'closed'].includes(a.status)).length;
  const completed = actions.filter((a) => a.status === 'completed').length;

  return (
    <div>
      <Navbar />
      <div style={{ padding: '24px' }}>
        <h2 style={{ color: '#1e293b', marginBottom: '8px', fontSize: '28px', fontWeight: 'bold' }}>
          Remedial Actions
        </h2>
        <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '14px' }}>
          Exam findings, audit issues, and self-identified gaps
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          <StatCard label="Total Actions" value={actions.length} color="#3b82f6" />
          <StatCard label="Open" value={open} color="#3b82f6" />
          <StatCard label="In Progress" value={inProgress} color="#f59e0b" />
          <StatCard label="Overdue" value={overdue} color="#ef4444" />
          <StatCard label="Critical (Open)" value={critical} color="#7c3aed" />
          <StatCard label="Completed" value={completed} color="#10b981" />
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: filter === s ? '#3b82f6' : '#e2e8f0',
                background: filter === s ? '#eff6ff' : 'white',
                color: filter === s ? '#3b82f6' : '#475569',
                fontWeight: filter === s ? '600' : '400',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              {STATUS_FILTER_LABELS[s]}
            </button>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Title / Area', 'Source', 'Priority', 'Status', 'Owner', 'Regulator', 'Due Date', 'Description'].map((h) => (
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
                <tr><td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No actions found.</td></tr>
              ) : (
                displayed.map((a, i) => (
                  <tr key={a.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                    <td style={{ padding: '12px 16px', maxWidth: '220px' }}>
                      <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '13px', marginBottom: '2px' }}>{a.title}</div>
                      {a.related_area && <span style={{ fontSize: '11px', color: '#64748b', background: '#f1f5f9', padding: '1px 6px', borderRadius: '4px' }}>{a.related_area}</span>}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <Badge label={SOURCE_LABELS[a.source] ?? a.source} color="#64748b" />
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <Badge label={a.priority.charAt(0).toUpperCase() + a.priority.slice(1)} color={PRIORITY_COLORS[a.priority]} />
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <Badge label={STATUS_LABELS[a.status]} color={STATUS_COLORS[a.status]} />
                    </td>
                    <td style={{ padding: '12px 16px', color: '#475569', fontSize: '13px' }}>{a.owner ?? '—'}</td>
                    <td style={{ padding: '12px 16px', color: '#475569', fontSize: '13px' }}>{a.regulator ?? '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }}><DueCell action={a} /></td>
                    <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '12px', maxWidth: '220px' }}>
                      <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {a.description ?? '—'}
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
