import React, { useEffect, useState } from 'react';
import { PositionLimit } from '../types';
import { STATUS_COLORS } from '../config';
import { positionsApi } from '../services/api';

interface PositionTableProps {
  positions?: PositionLimit[];
  loading?: boolean;
}

export const PositionTable: React.FC<PositionTableProps> = ({ positions = [], loading = false }) => {
  const getStatusColor = (utilizationPercent: number) => {
    if (utilizationPercent > 100) return STATUS_COLORS.non_compliant;
    if (utilizationPercent > 80) return STATUS_COLORS.under_monitoring;
    return STATUS_COLORS.compliant;
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
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Asset</th>
            <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>
              Max Position
            </th>
            <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>
              Current Position
            </th>
            <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>
              Utilization
            </th>
            <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                Loading positions...
              </td>
            </tr>
          ) : positions.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                No positions found
              </td>
            </tr>
          ) : (
            positions.map((position) => (
              <tr
                key={position.id}
                style={{
                  borderBottom: '1px solid #e2e8f0',
                  '&:hover': { background: '#f8fafc' },
                }}
              >
                <td style={{ padding: '12px' }}>
                  <span style={{ fontWeight: '600', color: '#0f172a' }}>
                    {position.asset_symbol}
                  </span>
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  ${position.max_position_usd.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  ${position.current_position_usd.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <div
                    style={{
                      background: '#e2e8f0',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      height: '24px',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        background: getStatusColor(position.current_utilization),
                        height: '100%',
                        width: `${Math.min(position.current_utilization, 100)}%`,
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: position.current_utilization > 50 ? 'white' : '#0f172a',
                      }}
                    >
                      {position.current_utilization.toFixed(1)}%
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <span
                    style={{
                      background: getStatusColor(position.current_utilization),
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      textTransform: 'capitalize',
                    }}
                  >
                    {position.compliance_status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
