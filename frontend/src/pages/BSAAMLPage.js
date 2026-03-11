import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Navbar, StatCard } from '../components';
import { bsaApi } from '../services/api';
const STATUS_COLORS = {
    current: '#10b981',
    at_risk: '#f59e0b',
    deficient: '#ef4444',
    not_applicable: '#94a3b8',
};
const STATUS_LABELS = {
    current: 'Current',
    at_risk: 'At Risk',
    deficient: 'Deficient',
    not_applicable: 'N/A',
};
const AREA_LABELS = {
    sar_filing: 'SAR Filing',
    ctr_filing: 'CTR Filing',
    ofac_screening: 'OFAC Screening',
    kyc_cip: 'KYC / CIP',
    transaction_monitoring: 'Transaction Monitoring',
    customer_due_diligence: 'CDD',
    enhanced_due_diligence: 'EDD',
    record_retention: 'Record Retention',
    training: 'Training',
    independent_testing: 'Independent Testing',
};
const StatusBadge = ({ status }) => (_jsx("span", { style: {
        background: STATUS_COLORS[status] + '18',
        color: STATUS_COLORS[status],
        border: `1px solid ${STATUS_COLORS[status]}40`,
        padding: '3px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        whiteSpace: 'nowrap',
    }, children: STATUS_LABELS[status] }));
const StatusDot = ({ status }) => (_jsx("span", { style: { display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: STATUS_COLORS[status], marginRight: '8px' } }));
const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
// Group indicators by program area
const groupByArea = (indicators) => {
    const map = {};
    for (const ind of indicators) {
        if (!map[ind.program_area])
            map[ind.program_area] = [];
        map[ind.program_area].push(ind);
    }
    return map;
};
// Summarize the worst status in a group
const worstStatus = (indicators) => {
    if (indicators.some((i) => i.status === 'deficient'))
        return 'deficient';
    if (indicators.some((i) => i.status === 'at_risk'))
        return 'at_risk';
    if (indicators.some((i) => i.status === 'current'))
        return 'current';
    return 'not_applicable';
};
const FILTER_OPTIONS = [
    { label: 'All', value: '' },
    { label: 'Deficient', value: 'deficient' },
    { label: 'At Risk', value: 'at_risk' },
    { label: 'Current', value: 'current' },
];
export const BSAAMLPage = () => {
    const [indicators, setIndicators] = useState([]);
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        bsaApi.getIndicators().then((res) => {
            setIndicators(res.data);
            setLoading(false);
        });
    }, []);
    const displayed = filter ? indicators.filter((i) => i.status === filter) : indicators;
    const grouped = groupByArea(displayed);
    const current = indicators.filter((i) => i.status === 'current').length;
    const atRisk = indicators.filter((i) => i.status === 'at_risk').length;
    const deficient = indicators.filter((i) => i.status === 'deficient').length;
    return (_jsxs("div", { children: [_jsx(Navbar, {}), _jsxs("div", { style: { padding: '24px' }, children: [_jsx("h2", { style: { color: '#1e293b', marginBottom: '8px', fontSize: '28px', fontWeight: 'bold' }, children: "BSA / AML Program Status" }), _jsx("p", { style: { color: '#64748b', marginBottom: '24px', fontSize: '14px' }, children: "Health indicators across all BSA/AML program pillars" }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '28px' }, children: [_jsx(StatCard, { label: "Total Metrics", value: indicators.length, color: "#3b82f6" }), _jsx(StatCard, { label: "Current", value: current, color: "#10b981" }), _jsx(StatCard, { label: "At Risk", value: atRisk, color: "#f59e0b" }), _jsx(StatCard, { label: "Deficient", value: deficient, color: "#ef4444" })] }), _jsxs("div", { style: { background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '16px 20px', marginBottom: '24px' }, children: [_jsx("div", { style: { fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }, children: "Program Area Overview" }), _jsx("div", { style: { display: 'flex', flexWrap: 'wrap', gap: '10px' }, children: Object.keys(AREA_LABELS).map((area) => {
                                    const items = indicators.filter((i) => i.program_area === area);
                                    if (items.length === 0)
                                        return null;
                                    const ws = worstStatus(items);
                                    return (_jsxs("div", { style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '6px 12px',
                                            borderRadius: '6px',
                                            border: `1px solid ${STATUS_COLORS[ws]}30`,
                                            background: STATUS_COLORS[ws] + '10',
                                        }, children: [_jsx(StatusDot, { status: ws }), _jsx("span", { style: { fontSize: '13px', color: '#1e293b', fontWeight: '500' }, children: AREA_LABELS[area] })] }, area));
                                }) })] }), _jsx("div", { style: { display: 'flex', gap: '8px', marginBottom: '16px' }, children: FILTER_OPTIONS.map((f) => (_jsx("button", { onClick: () => setFilter(f.value), style: {
                                padding: '6px 14px',
                                borderRadius: '6px',
                                border: '1px solid',
                                borderColor: filter === f.value ? '#3b82f6' : '#e2e8f0',
                                background: filter === f.value ? '#eff6ff' : 'white',
                                color: filter === f.value ? '#3b82f6' : '#475569',
                                fontWeight: filter === f.value ? '600' : '400',
                                cursor: 'pointer',
                                fontSize: '13px',
                            }, children: f.label }, f.value))) }), loading ? (_jsx("div", { style: { padding: '40px', textAlign: 'center', color: '#94a3b8' }, children: "Loading\u2026" })) : (Object.keys(grouped).map((area) => {
                        const items = grouped[area];
                        return (_jsxs("div", { style: { marginBottom: '20px' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }, children: [_jsx(StatusDot, { status: worstStatus(items) }), _jsx("h3", { style: { fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: 0 }, children: AREA_LABELS[area] ?? area })] }), _jsx("div", { style: { background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }, children: _jsxs("table", { style: { width: '100%', borderCollapse: 'collapse' }, children: [_jsx("thead", { children: _jsx("tr", { style: { background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }, children: ['Metric', 'Current Value', 'Threshold / Target', 'Status', 'Team', 'Last Review', 'Next Review', 'Notes'].map((h) => (_jsx("th", { style: { padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }, children: h }, h))) }) }), _jsx("tbody", { children: items.map((ind, i) => (_jsxs("tr", { style: { borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fafafa' }, children: [_jsx("td", { style: { padding: '12px 16px', fontWeight: '600', color: '#1e293b', fontSize: '13px', maxWidth: '200px' }, children: ind.metric_name }), _jsx("td", { style: { padding: '12px 16px', color: '#1e293b', fontSize: '13px', fontWeight: '500' }, children: ind.metric_value ?? '—' }), _jsx("td", { style: { padding: '12px 16px', color: '#64748b', fontSize: '13px' }, children: ind.threshold ?? '—' }), _jsx("td", { style: { padding: '12px 16px' }, children: _jsx(StatusBadge, { status: ind.status }) }), _jsx("td", { style: { padding: '12px 16px', color: '#475569', fontSize: '13px' }, children: ind.responsible_team ?? '—' }), _jsx("td", { style: { padding: '12px 16px', color: '#475569', fontSize: '13px' }, children: formatDate(ind.last_review_date) }), _jsx("td", { style: { padding: '12px 16px', color: '#475569', fontSize: '13px' }, children: formatDate(ind.next_review_date) }), _jsx("td", { style: { padding: '12px 16px', color: '#64748b', fontSize: '12px', maxWidth: '200px' }, children: _jsx("span", { style: { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }, children: ind.notes ?? '—' }) })] }, ind.id))) })] }) })] }, area));
                    }))] })] }));
};
