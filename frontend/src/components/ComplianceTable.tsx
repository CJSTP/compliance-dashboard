import React from 'react';
import { ComplianceArea } from '../types';
import { STATUS_COLORS } from '../config';
import { format } from 'date-fns';

interface ComplianceTableProps {
  areas?: ComplianceArea[];
  loading?: boolean;
}

export const ComplianceTable: React.FC<ComplianceTableProps> = ({ areas = [], loading = false }) => {
  const getStatusColor = (status: string) => {
    return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || '#3b82f6';
  };

  return (
    <div
      style={{
        background: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '14px',
        }}
      >
        <thead>
          <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }}>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Area</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Team</th>
            <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Status</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>
              Last Review
            </th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>
              Next Review
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                Loading compliance areas...
              </td>
            </tr>
          ) : areas.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                No compliance areas found
              </td>
            </tr>
          ) : (
            areas.map((area) => (
              <tr
                key={area.id}
                style={{
                  borderBottom: '1px solid #e2e8f0',
                }}
              >
                <td style={{ padding: '12px' }}>
                  <div style={{ fontWeight: '600', color: '#0f172a' }}>{area.name}</div>
                  {area.description && (
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                      {area.description}
                    </div>
                  )}
                </td>
                <td style={{ padding: '12px' }}>
                  {area.responsible_team || '-'}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <span
                    style={{
                      background: getStatusColor(area.status),
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      textTransform: 'capitalize',
                    }}
                  >
                    {area.status.replace('_', ' ')}
                  </span>
                </td>
                <td style={{ padding: '12px', fontSize: '12px', color: '#64748b' }}>
                  {area.last_review_date
                    ? format(new Date(area.last_review_date), 'MMM dd, yyyy')
                    : '-'}
                </td>
                <td style={{ padding: '12px', fontSize: '12px', color: '#64748b' }}>
                  {area.next_review_date
                    ? format(new Date(area.next_review_date), 'MMM dd, yyyy')
                    : '-'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
