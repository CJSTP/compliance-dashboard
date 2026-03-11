import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Navbar, ComplianceTable } from '../components';
import { complianceApi } from '../services/api';
export const CompliancePage = () => {
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState();
    useEffect(() => {
        loadComplianceAreas();
    }, [filter]);
    const loadComplianceAreas = async () => {
        try {
            setLoading(true);
            const response = await complianceApi.getAreas(filter);
            setAreas(response.data);
        }
        catch (error) {
            console.error('Error loading compliance areas:', error);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { children: [_jsx(Navbar, {}), _jsxs("div", { style: { padding: '24px' }, children: [_jsxs("div", { style: { marginBottom: '24px' }, children: [_jsx("h2", { style: { fontSize: '28px', fontWeight: 'bold', marginBottom: '16px', color: '#1e293b' }, children: "Compliance Areas" }), _jsxs("div", { style: { display: 'flex', gap: '12px' }, children: [_jsx("button", { onClick: () => setFilter(undefined), style: {
                                            padding: '8px 16px',
                                            borderRadius: '4px',
                                            border: 'none',
                                            background: !filter ? '#3b82f6' : '#e2e8f0',
                                            color: !filter ? 'white' : '#1e293b',
                                            cursor: 'pointer',
                                            fontWeight: '500',
                                        }, children: "All" }), _jsx("button", { onClick: () => setFilter('compliant'), style: {
                                            padding: '8px 16px',
                                            borderRadius: '4px',
                                            border: 'none',
                                            background: filter === 'compliant' ? '#10b981' : '#e2e8f0',
                                            color: filter === 'compliant' ? 'white' : '#1e293b',
                                            cursor: 'pointer',
                                            fontWeight: '500',
                                        }, children: "Compliant" }), _jsx("button", { onClick: () => setFilter('non_compliant'), style: {
                                            padding: '8px 16px',
                                            borderRadius: '4px',
                                            border: 'none',
                                            background: filter === 'non_compliant' ? '#ef4444' : '#e2e8f0',
                                            color: filter === 'non_compliant' ? 'white' : '#1e293b',
                                            cursor: 'pointer',
                                            fontWeight: '500',
                                        }, children: "Non-Compliant" }), _jsx("button", { onClick: () => setFilter('pending_review'), style: {
                                            padding: '8px 16px',
                                            borderRadius: '4px',
                                            border: 'none',
                                            background: filter === 'pending_review' ? '#f59e0b' : '#e2e8f0',
                                            color: filter === 'pending_review' ? 'white' : '#1e293b',
                                            cursor: 'pointer',
                                            fontWeight: '500',
                                        }, children: "Pending Review" })] })] }), _jsx(ComplianceTable, { areas: areas, loading: loading })] })] }));
};
