import React from 'react';

interface StatCardProps {
  label: string;
  value: number | string;
  color?: string;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  color = '#3b82f6',
  icon,
}) => {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: `2px solid ${color}`,
        minWidth: '200px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {icon && <div style={{ fontSize: '24px' }}>{icon}</div>}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
            {label}
          </div>
          <div
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color,
              marginTop: '4px',
            }}
          >
            {value}
          </div>
        </div>
      </div>
    </div>
  );
};
