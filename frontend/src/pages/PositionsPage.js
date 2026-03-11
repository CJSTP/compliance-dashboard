import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Navbar, PositionTable } from '../components';
import { positionsApi } from '../services/api';
export const PositionsPage = () => {
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    useEffect(() => {
        loadPositions();
    }, [filter]);
    const loadPositions = async () => {
        try {
            setLoading(true);
            let response;
            switch (filter) {
                case 'at-risk':
                    response = await positionsApi.getAtRiskPositions();
                    break;
                case 'non-compliant':
                    response = await positionsApi.getNonCompliantPositions();
                    break;
                default:
                    response = await positionsApi.getLimits();
            }
            setPositions(response.data);
        }
        catch (error) {
            console.error('Error loading positions:', error);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { children: [_jsx(Navbar, {}), _jsxs("div", { style: { padding: '24px' }, children: [_jsxs("div", { style: { marginBottom: '24px' }, children: [_jsx("h2", { style: { fontSize: '28px', fontWeight: 'bold', marginBottom: '16px', color: '#1e293b' }, children: "Position Limits" }), _jsxs("div", { style: { display: 'flex', gap: '12px' }, children: [_jsx("button", { onClick: () => setFilter('all'), style: {
                                            padding: '8px 16px',
                                            borderRadius: '4px',
                                            border: 'none',
                                            background: filter === 'all' ? '#3b82f6' : '#e2e8f0',
                                            color: filter === 'all' ? 'white' : '#1e293b',
                                            cursor: 'pointer',
                                            fontWeight: '500',
                                        }, children: "All Positions" }), _jsx("button", { onClick: () => setFilter('at-risk'), style: {
                                            padding: '8px 16px',
                                            borderRadius: '4px',
                                            border: 'none',
                                            background: filter === 'at-risk' ? '#f59e0b' : '#e2e8f0',
                                            color: filter === 'at-risk' ? 'white' : '#1e293b',
                                            cursor: 'pointer',
                                            fontWeight: '500',
                                        }, children: "At Risk" }), _jsx("button", { onClick: () => setFilter('non-compliant'), style: {
                                            padding: '8px 16px',
                                            borderRadius: '4px',
                                            border: 'none',
                                            background: filter === 'non-compliant' ? '#ef4444' : '#e2e8f0',
                                            color: filter === 'non-compliant' ? 'white' : '#1e293b',
                                            cursor: 'pointer',
                                            fontWeight: '500',
                                        }, children: "Non-Compliant" })] })] }), _jsx(PositionTable, { positions: positions, loading: loading })] })] }));
};
