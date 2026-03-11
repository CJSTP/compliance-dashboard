import React from 'react';
import { RiskLevel, RiskAssessment } from '../types';
import { RISK_COLORS } from '../config';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'small' | 'medium' | 'large';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'medium' }) => {
  const sizeMap = {
    small: { padding: '4px 8px', fontSize: '12px' },
    medium: { padding: '6px 12px', fontSize: '14px' },
    large: { padding: '8px 16px', fontSize: '16px' },
  };

  return (
    <span
      style={{
        background: RISK_COLORS[level as keyof typeof RISK_COLORS],
        color: 'white',
        borderRadius: '4px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        ...sizeMap[size],
      }}
    >
      {level}
    </span>
  );
};

interface RiskListProps {
  risks: RiskAssessment[];
  maxItems?: number;
}

export const RiskList: React.FC<RiskListProps> = ({ risks, maxItems = 5 }) => {
  const displayRisks = risks.slice(0, maxItems);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {displayRisks.map((risk) => (
        <div
          key={risk.id}
          style={{
            background: 'white',
            padding: '12px',
            borderRadius: '6px',
            borderLeft: `4px solid ${RISK_COLORS[risk.risk_level]}`,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: '600' }}>
                Compliance Area ID: {risk.compliance_area_id}
              </div>
              {risk.risk_description && (
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  {risk.risk_description}
                </div>
              )}
            </div>
            <RiskBadge level={risk.risk_level} size="small" />
          </div>
        </div>
      ))}
      {risks.length > maxItems && (
        <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>
          +{risks.length - maxItems} more risks
        </div>
      )}
    </div>
  );
};
