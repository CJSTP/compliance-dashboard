import React, { useEffect, useState } from 'react';
import { Navbar } from '../components';
import { auditApi } from '../services/api';
import { AuditLog } from '../types';
import { format } from 'date-fns';
import { RISK_COLORS } from '../config';

export const AuditPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      const response = await auditApi.getLogs(100, 0);
      setLogs(response.data);
    } catch (error) {
      console.error('Error loading audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px', color: '#1e293b' }}>
          Audit Logs
        </h2>

        <div
          style={{
            background: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
        >
          {loading ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
              Loading audit logs...
            </div>
          ) : logs.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
              No audit logs found
            </div>
          ) : (
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {logs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    padding: '16px',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: RISK_COLORS[log.severity],
                        }}
                      />
                      <span style={{ fontWeight: '600', color: '#0f172a' }}>{log.action}</span>
                      {log.entity_type && (
                        <span style={{ fontSize: '12px', color: '#64748b', background: '#f1f5f9', padding: '2px 6px', borderRadius: '3px' }}>
                          {log.entity_type}
                        </span>
                      )}
                    </div>
                    {log.details && (
                      <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
                        {log.details}
                      </div>
                    )}
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                      {log.user} • {format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                    </div>
                  </div>
                  <span
                    style={{
                      background: RISK_COLORS[log.severity],
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      marginLeft: '12px',
                    }}
                  >
                    {log.severity}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
