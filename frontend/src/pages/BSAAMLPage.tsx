import React, { useEffect, useState } from 'react';
import { Navbar, StatCard } from '../components';
import { bsaApi } from '../services/api';
import { BSAAMLIndicator, BSAIndicatorStatus, BSAProgramArea } from '../types';

const STATUS_COLORS: Record<BSAIndicatorStatus, string> = {
  current: '#10b981',
  at_risk: '#f59e0b',
  deficient: '#ef4444',
  not_applicable: '#94a3b8',
};

const STATUS_LABELS: Record<BSAIndicatorStatus, string> = {
  current: 'Current',
  at_risk: 'At Risk',
  deficient: 'Deficient',
  not_applicable: 'N/A',
};

const AREA_LABELS: Record<BSAProgramArea, string> = {
  sar_filing: 'SAR Filing',
  ctr_filing: 'CTR Filing',
  ofac_screening: 'OFAC Screening',
  kyc_cip: 'KYC / CIP',
  transaction_monitoring: 'Transaction Monitoring',
  customer_due_diligence: 'CDD',
  enhanced_due_diligence: 'EDD',
  record_retention: 'Record Retention',
  training: 'Training',
  independent_testing: 'Independent Testing',
};

const StatusBadge: React.FC<{ status: BSAIndicatorStatus }> = ({ status }) => (
  <span
    style={{
      background: STATUS_COLORS[status] + '18',
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

const StatusDot: React.FC<{ status: BSAIndicatorStatus }> = ({ status }) => (
  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: STATUS_COLORS[status], marginRight: '8px' }} />
);

const formatDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

// Group indicators by program area
const groupByArea = (indicators: BSAAMLIndicator[]) => {
  const map: Partial<Record<BSAProgramArea, BSAAMLIndicator[]>> = {};
  for (const ind of indicators) {
    if (!map[ind.program_area]) map[ind.program_area] = [];
    map[ind.program_area]!.push(ind);
  }
  return map;
};

// Summarize the worst status in a group
const worstStatus = (indicators: BSAAMLIndicator[]): BSAIndicatorStatus => {
  if (indicators.some((i) => i.status === 'deficient')) return 'deficient';
  if (indicators.some((i) => i.status === 'at_risk')) return 'at_risk';
  if (indicators.some((i) => i.status === 'current')) return 'current';
  return 'not_applicable';
};

const FILTER_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Deficient', value: 'deficient' },
  { label: 'At Risk', value: 'at_risk' },
  { label: 'Current', value: 'current' },
];

export const BSAAMLPage: React.FC = () => {
  const [indicators, setIndicators] = useState<BSAAMLIndicator[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bsaApi.getIndicators().then((res) => {
      setIndicators(res.data);
      setLoading(false);
    });
  }, []);

  const displayed = filter ? indicators.filter((i) => i.status === filter) : indicators;
  const grouped = groupByArea(displayed);

  const current = indicators.filter((i) => i.status === 'current').length;
  const atRisk = indicators.filter((i) => i.status === 'at_risk').length;
  const deficient = indicators.filter((i) => i.status === 'deficient').length;

  return (
    <div>
      <Navbar />
      <div style={{ padding: '24px' }}>
        <h2 style={{ color: '#1e293b', marginBottom: '8px', fontSize: '28px', fontWeight: 'bold' }}>
          BSA / AML Program Status
        </h2>
        <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '14px' }}>
          Health indicators across all BSA/AML program pillars
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          <StatCard label="Total Metrics" value={indicators.length} color="#3b82f6" />
          <StatCard label="Current" value={current} color="#10b981" />
          <StatCard label="At Risk" value={atRisk} color="#f59e0b" />
          <StatCard label="Deficient" value={deficient} color="#ef4444" />
        </div>

        {/* Program area summary row */}
        <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '16px 20px', marginBottom: '24px' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
            Program Area Overview
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {(Object.keys(AREA_LABELS) as BSAProgramArea[]).map((area) => {
              const items = indicators.filter((i) => i.program_area === area);
              if (items.length === 0) return null;
              const ws = worstStatus(items);
              return (
                <div
                  key={area}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: `1px solid ${STATUS_COLORS[ws]}30`,
                    background: STATUS_COLORS[ws] + '10',
                  }}
                >
                  <StatusDot status={ws} />
                  <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: '500' }}>{AREA_LABELS[area]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                padding: '6px 14px',
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

        {/* Grouped by program area */}
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading…</div>
        ) : (
          (Object.keys(grouped) as BSAProgramArea[]).map((area) => {
            const items = grouped[area]!;
            return (
              <div key={area} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <StatusDot status={worstStatus(items)} />
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                    {AREA_LABELS[area] ?? area}
                  </h3>
                </div>
                <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        {['Metric', 'Current Value', 'Threshold / Target', 'Status', 'Team', 'Last Review', 'Next Review', 'Notes'].map((h) => (
                          <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((ind, i) => (
                        <tr key={ind.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                          <td style={{ padding: '12px 16px', fontWeight: '600', color: '#1e293b', fontSize: '13px', maxWidth: '200px' }}>
                            {ind.metric_name}
                          </td>
                          <td style={{ padding: '12px 16px', color: '#1e293b', fontSize: '13px', fontWeight: '500' }}>
                            {ind.metric_value ?? '—'}
                          </td>
                          <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '13px' }}>
                            {ind.threshold ?? '—'}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <StatusBadge status={ind.status} />
                          </td>
                          <td style={{ padding: '12px 16px', color: '#475569', fontSize: '13px' }}>
                            {ind.responsible_team ?? '—'}
                          </td>
                          <td style={{ padding: '12px 16px', color: '#475569', fontSize: '13px' }}>
                            {formatDate(ind.last_review_date)}
                          </td>
                          <td style={{ padding: '12px 16px', color: '#475569', fontSize: '13px' }}>
                            {formatDate(ind.next_review_date)}
                          </td>
                          <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '12px', maxWidth: '200px' }}>
                            <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {ind.notes ?? '—'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
