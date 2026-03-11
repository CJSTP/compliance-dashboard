import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Navbar } from '../components';
import { auditApi } from '../services/api';
import { format } from 'date-fns';
import { RISK_COLORS } from '../config';
export const AuditPage = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadAuditLogs();
    }, []);
    const loadAuditLogs = async () => {
        try {
            setLoading(true);
            const response = await auditApi.getLogs(100, 0);
            setLogs(response.data);
        }
        catch (error) {
            console.error('Error loading audit logs:', error);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { children: [_jsx(Navbar, {}), _jsxs("div", { style: { padding: '24px' }, children: [_jsx("h2", { style: { fontSize: '28px', fontWeight: 'bold', marginBottom: '24px', color: '#1e293b' }, children: "Audit Logs" }), _jsx("div", { style: {
                            background: 'white',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        }, children: loading ? (_jsx("div", { style: { padding: '20px', textAlign: 'center', color: '#64748b' }, children: "Loading audit logs..." })) : logs.length === 0 ? (_jsx("div", { style: { padding: '20px', textAlign: 'center', color: '#64748b' }, children: "No audit logs found" })) : (_jsx("div", { style: { maxHeight: '600px', overflowY: 'auto' }, children: logs.map((log) => (_jsxs("div", { style: {
                                    padding: '16px',
                                    borderBottom: '1px solid #e2e8f0',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'start',
                                }, children: [_jsxs("div", { style: { flex: 1 }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }, children: [_jsx("div", { style: {
                                                            width: '8px',
                                                            height: '8px',
                                                            borderRadius: '50%',
                                                            background: RISK_COLORS[log.severity],
                                                        } }), _jsx("span", { style: { fontWeight: '600', color: '#0f172a' }, children: log.action }), log.entity_type && (_jsx("span", { style: { fontSize: '12px', color: '#64748b', background: '#f1f5f9', padding: '2px 6px', borderRadius: '3px' }, children: log.entity_type }))] }), log.details && (_jsx("div", { style: { fontSize: '13px', color: '#64748b', marginBottom: '8px' }, children: log.details })), _jsxs("div", { style: { fontSize: '12px', color: '#94a3b8' }, children: [log.user, " \u2022 ", format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm:ss')] })] }), _jsx("span", { style: {
                                            background: RISK_COLORS[log.severity],
                                            color: 'white',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '11px',
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase',
                                            marginLeft: '12px',
                                        }, children: log.severity })] }, log.id))) })) })] })] }));
};
