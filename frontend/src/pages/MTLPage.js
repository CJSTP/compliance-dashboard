import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Navbar, StatCard } from '../components';
import { mtlApi } from '../services/api';
const STATUS_COLORS = {
    active: '#10b981',
    pending: '#3b82f6',
    expired: '#ef4444',
    surrendered: '#6b7280',
    exempted: '#8b5cf6',
};
const STATUS_LABELS = {
    active: 'Active',
    pending: 'Pending',
    expired: 'Expired',
    surrendered: 'Surrendered',
    exempted: 'Exempted',
};
const StatusBadge = ({ status }) => (_jsx("span", { style: {
        background: STATUS_COLORS[status] + '20',
        color: STATUS_COLORS[status],
        border: `1px solid ${STATUS_COLORS[status]}40`,
        padding: '3px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        whiteSpace: 'nowrap',
    }, children: STATUS_LABELS[status] }));
const formatDate = (iso) => {
    if (!iso)
        return '—';
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
const daysUntil = (iso) => {
    if (!iso)
        return null;
    return Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
};
const RenewalCell = ({ license }) => {
    if (license.status !== 'active')
        return _jsx("span", { style: { color: '#94a3b8' }, children: "\u2014" });
    const days = daysUntil(license.renewal_due_date);
    if (days === null)
        return _jsx("span", { style: { color: '#94a3b8' }, children: "\u2014" });
    const color = days < 30 ? '#ef4444' : days < 90 ? '#f59e0b' : '#10b981';
    return (_jsxs("span", { style: { color, fontWeight: '600' }, children: [formatDate(license.renewal_due_date), _jsxs("span", { style: { fontSize: '11px', marginLeft: '6px', opacity: 0.8 }, children: ["(", days < 0 ? `${Math.abs(days)}d overdue` : `in ${days}d`, ")"] })] }));
};
const FILTERS = [
    { label: 'All', value: '' },
    { label: 'Active', value: 'active' },
    { label: 'Pending', value: 'pending' },
    { label: 'Expired', value: 'expired' },
];
export const MTLPage = () => {
    const [licenses, setLicenses] = useState([]);
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        mtlApi.getLicenses().then((res) => {
            setLicenses(res.data);
            setLoading(false);
        });
    }, []);
    const displayed = filter ? licenses.filter((l) => l.status === filter) : licenses;
    const active = licenses.filter((l) => l.status === 'active').length;
    const pending = licenses.filter((l) => l.status === 'pending').length;
    const expired = licenses.filter((l) => l.status === 'expired').length;
    const expiringSoon = licenses.filter((l) => {
        const d = daysUntil(l.renewal_due_date);
        return l.status === 'active' && d !== null && d <= 90;
    }).length;
    return (_jsxs("div", { children: [_jsx(Navbar, {}), _jsxs("div", { style: { padding: '24px' }, children: [_jsx("h2", { style: { color: '#1e293b', marginBottom: '8px', fontSize: '28px', fontWeight: 'bold' }, children: "MTL License Tracker" }), _jsx("p", { style: { color: '#64748b', marginBottom: '24px', fontSize: '14px' }, children: "Money Transmitter License status by state" }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }, children: [_jsx(StatCard, { label: "Total Licenses", value: licenses.length, color: "#3b82f6" }), _jsx(StatCard, { label: "Active", value: active, color: "#10b981" }), _jsx(StatCard, { label: "Pending", value: pending, color: "#3b82f6" }), _jsx(StatCard, { label: "Expired", value: expired, color: "#ef4444" }), _jsx(StatCard, { label: "Renewing \u2264 90 Days", value: expiringSoon, color: "#f59e0b" })] }), _jsx("div", { style: { display: 'flex', gap: '8px', marginBottom: '16px' }, children: FILTERS.map((f) => (_jsx("button", { onClick: () => setFilter(f.value), style: {
                                padding: '6px 16px',
                                borderRadius: '6px',
                                border: '1px solid',
                                borderColor: filter === f.value ? '#3b82f6' : '#e2e8f0',
                                background: filter === f.value ? '#eff6ff' : 'white',
                                color: filter === f.value ? '#3b82f6' : '#475569',
                                fontWeight: filter === f.value ? '600' : '400',
                                cursor: 'pointer',
                                fontSize: '13px',
                            }, children: f.label }, f.value))) }), _jsx("div", { style: { background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }, children: _jsxs("table", { style: { width: '100%', borderCollapse: 'collapse' }, children: [_jsx("thead", { children: _jsx("tr", { style: { background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }, children: ['State', 'Regulator', 'License No.', 'Status', 'Issue Date', 'Expiry Date', 'Renewal Due', 'Notes'].map((h) => (_jsx("th", { style: { padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }, children: h }, h))) }) }), _jsx("tbody", { children: loading ? (_jsx("tr", { children: _jsx("td", { colSpan: 8, style: { padding: '40px', textAlign: 'center', color: '#94a3b8' }, children: "Loading\u2026" }) })) : displayed.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 8, style: { padding: '40px', textAlign: 'center', color: '#94a3b8' }, children: "No licenses found." }) })) : (displayed.map((l, i) => (_jsxs("tr", { style: { borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fafafa' }, children: [_jsxs("td", { style: { padding: '12px 16px', fontWeight: '600', color: '#1e293b' }, children: [_jsx("span", { style: { fontSize: '11px', color: '#64748b', display: 'block' }, children: l.state_code }), l.state] }), _jsx("td", { style: { padding: '12px 16px', color: '#475569', fontSize: '13px' }, children: l.regulator ?? '—' }), _jsx("td", { style: { padding: '12px 16px', color: '#475569', fontSize: '13px', fontFamily: 'monospace' }, children: l.license_number ?? '—' }), _jsx("td", { style: { padding: '12px 16px' }, children: _jsx(StatusBadge, { status: l.status }) }), _jsx("td", { style: { padding: '12px 16px', color: '#475569', fontSize: '13px' }, children: formatDate(l.issue_date) }), _jsx("td", { style: { padding: '12px 16px', color: '#475569', fontSize: '13px' }, children: formatDate(l.expiry_date) }), _jsx("td", { style: { padding: '12px 16px', fontSize: '13px' }, children: _jsx(RenewalCell, { license: l }) }), _jsx("td", { style: { padding: '12px 16px', color: '#64748b', fontSize: '12px', maxWidth: '200px' }, children: _jsx("span", { style: { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }, children: l.notes ?? '—' }) })] }, l.id)))) })] }) })] })] }));
};
