import React, { useEffect, useState } from 'react';
import { Navbar, ComplianceTable } from '../components';
import { complianceApi } from '../services/api';
import { ComplianceArea } from '../types';

export const CompliancePage: React.FC = () => {
  const [areas, setAreas] = useState<ComplianceArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | undefined>();

  useEffect(() => {
    loadComplianceAreas();
  }, [filter]);

  const loadComplianceAreas = async () => {
    try {
      setLoading(true);
      const response = await complianceApi.getAreas(filter);
      setAreas(response.data);
    } catch (error) {
      console.error('Error loading compliance areas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px', color: '#1e293b' }}>
            Compliance Areas
          </h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setFilter(undefined)}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                border: 'none',
                background: !filter ? '#3b82f6' : '#e2e8f0',
                color: !filter ? 'white' : '#1e293b',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              All
            </button>
            <button
              onClick={() => setFilter('compliant')}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                border: 'none',
                background: filter === 'compliant' ? '#10b981' : '#e2e8f0',
                color: filter === 'compliant' ? 'white' : '#1e293b',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              Compliant
            </button>
            <button
              onClick={() => setFilter('non_compliant')}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                border: 'none',
                background: filter === 'non_compliant' ? '#ef4444' : '#e2e8f0',
                color: filter === 'non_compliant' ? 'white' : '#1e293b',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              Non-Compliant
            </button>
            <button
              onClick={() => setFilter('pending_review')}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                border: 'none',
                background: filter === 'pending_review' ? '#f59e0b' : '#e2e8f0',
                color: filter === 'pending_review' ? 'white' : '#1e293b',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              Pending Review
            </button>
          </div>
        </div>

        <ComplianceTable areas={areas} loading={loading} />
      </div>
    </div>
  );
};
