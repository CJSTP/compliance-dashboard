import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, StatCard, RiskList, PositionTable, ComplianceTable } from '../components';
import { complianceApi, positionsApi, mtlApi, remedialApi, bsaApi } from '../services/api';
import { ComplianceArea, RiskAssessment, PositionLimit, MTLLicense, RemedialAction, BSAAMLIndicator } from '../types';

const SummaryCard: React.FC<{
  title: string;
  to: string;
  items: { label: string; value: number | string; color: string }[];
}> = ({ title, to, items }) => (
  <div
    style={{
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: 0 }}>{title}</h3>
      <Link to={to} style={{ fontSize: '12px', color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>
        View all →
      </Link>
    </div>
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      {items.map((item) => (
        <div key={item.label} style={{ flex: '1', minWidth: '80px' }}>
          <div style={{ fontSize: '22px', fontWeight: '700', color: item.color }}>{item.value}</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>{item.label}</div>
        </div>
      ))}
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const [complianceAreas, setComplianceAreas] = useState<ComplianceArea[]>([]);
  const [positions, setPositions] = useState<PositionLimit[]>([]);
  const [riskItems, setRiskItems] = useState<RiskAssessment[]>([]);
  const [licenses, setLicenses] = useState<MTLLicense[]>([]);
  const [actions, setActions] = useState<RemedialAction[]>([]);
  const [indicators, setIndicators] = useState<BSAAMLIndicator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [areasRes, positionsRes, risksRes, licensesRes, actionsRes, indicatorsRes] = await Promise.all([
          complianceApi.getAreas(),
          positionsApi.getLimits(),
          complianceApi.getHighRiskItems(),
          mtlApi.getLicenses(),
          remedialApi.getActions(),
          bsaApi.getIndicators(),
        ]);
        setComplianceAreas(areasRes.data);
        setPositions(positionsRes.data);
        setRiskItems(risksRes.data);
        setLicenses(licensesRes.data);
        setActions(actionsRes.data);
        setIndicators(indicatorsRes.data);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const compliantAreas = complianceAreas.filter((a) => a.status === 'compliant').length;
  const nonCompliantAreas = complianceAreas.filter((a) => a.status === 'non_compliant').length;
  const atRiskPositions = positions.filter((p) => p.current_utilization >= 80).length;
  const nonCompliantPositions = positions.filter((p) => p.compliance_status === 'non_compliant').length;

  // MTL
  const activeLicenses = licenses.filter((l) => l.status === 'active').length;
  const expiredLicenses = licenses.filter((l) => l.status === 'expired').length;
  const expiringSoon = licenses.filter((l) => {
    if (l.status !== 'active' || !l.renewal_due_date) return false;
    const days = Math.ceil((new Date(l.renewal_due_date).getTime() - Date.now()) / 86400000);
    return days <= 90;
  }).length;

  // Remedial
  const openActions = actions.filter((a) => a.status === 'open').length;
  const overdueActions = actions.filter((a) => a.status === 'overdue').length;
  const criticalActions = actions.filter((a) => a.priority === 'critical' && !['completed', 'closed'].includes(a.status)).length;

  // BSA/AML
  const currentIndicators = indicators.filter((i) => i.status === 'current').length;
  const atRiskIndicators = indicators.filter((i) => i.status === 'at_risk').length;
  const deficientIndicators = indicators.filter((i) => i.status === 'deficient').length;

  return (
    <div>
      <Navbar />
      <div style={{ padding: '24px' }}>
        <h2 style={{ color: '#1e293b', marginBottom: '20px', fontSize: '28px', fontWeight: 'bold' }}>
          Dashboard Overview
        </h2>

        {/* Top stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          <StatCard label="Compliance Areas" value={complianceAreas.length} color="#3b82f6" />
          <StatCard label="Compliant" value={compliantAreas} color="#10b981" />
          <StatCard label="Non-Compliant" value={nonCompliantAreas} color="#ef4444" />
          <StatCard label="High Risk Items" value={riskItems.length} color="#f59e0b" />
          <StatCard label="At-Risk Positions" value={atRiskPositions} color="#f59e0b" />
          <StatCard label="Positions Breached" value={nonCompliantPositions} color="#ef4444" />
        </div>

        {/* New feature summary row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <SummaryCard
            title="MTL Licenses"
            to="/mtl"
            items={[
              { label: 'Active', value: activeLicenses, color: '#10b981' },
              { label: 'Expired', value: expiredLicenses, color: '#ef4444' },
              { label: 'Renewing ≤90d', value: expiringSoon, color: '#f59e0b' },
              { label: 'Pending', value: licenses.filter((l) => l.status === 'pending').length, color: '#3b82f6' },
            ]}
          />
          <SummaryCard
            title="Remedial Actions"
            to="/remedial"
            items={[
              { label: 'Open', value: openActions, color: '#3b82f6' },
              { label: 'Overdue', value: overdueActions, color: '#ef4444' },
              { label: 'Critical (open)', value: criticalActions, color: '#7c3aed' },
              { label: 'In Progress', value: actions.filter((a) => a.status === 'in_progress').length, color: '#f59e0b' },
            ]}
          />
          <SummaryCard
            title="BSA / AML Program"
            to="/bsa-aml"
            items={[
              { label: 'Current', value: currentIndicators, color: '#10b981' },
              { label: 'At Risk', value: atRiskIndicators, color: '#f59e0b' },
              { label: 'Deficient', value: deficientIndicators, color: '#ef4444' },
              { label: 'Total Metrics', value: indicators.length, color: '#64748b' },
            ]}
          />
        </div>

        {/* Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#1e293b' }}>
              Compliance Areas ({complianceAreas.length})
            </h3>
            <ComplianceTable areas={complianceAreas.slice(0, 5)} loading={loading} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#1e293b' }}>
              High Risk Items ({riskItems.length})
            </h3>
            <RiskList risks={riskItems} maxItems={5} />
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#1e293b' }}>
            Position Limits ({positions.length})
          </h3>
          <PositionTable positions={positions.slice(0, 10)} loading={loading} />
        </div>
      </div>
    </div>
  );
};
