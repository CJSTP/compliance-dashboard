import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Navbar, StatCard } from '../components';
import { remedialApi } from '../services/api';
const PRIORITY_COLORS = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#ef4444',
    critical: '#7c3aed',
};
const STATUS_COLORS = {
    open: '#3b82f6',
    in_progress: '#f59e0b',
    completed: '#10b981',
    overdue: '#ef4444',
    closed: '#6b7280',
};
const STATUS_LABELS = {
    open: 'Open',
    in_progress: 'In Progress',
    completed: 'Completed',
    overdue: 'Overdue',
    closed: 'Closed',
};
const SOURCE_LABELS = {
    exam: 'Exam',
    self_identified: 'Self-ID',
    audit: 'Audit',
    regulatory_inquiry: 'Reg. Inquiry',
    complaint: 'Complaint',
};
const Badge = ({ label, color }) => (_jsx("span", { style: {
        background: color + '18',
        color,
        border: `1px solid ${color}40`,
        padding: '3px 9px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        whiteSpace: 'nowrap',
    }, children: label }));
const formatDate = (iso) => {
    if (!iso)
        return '—';
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
const DueCell = ({ action }) => {
    if (!action.due_date)
        return _jsx("span", { style: { color: '#94a3b8' }, children: "\u2014" });
    const days = Math.ceil((new Date(action.due_date).getTime() - Date.now()) / 86400000);
    const done = ['completed', 'closed'].includes(action.status);
    if (done)
        return _jsx("span", { style: { color: '#10b981' }, children: formatDate(action.due_date) });
    const color = days < 0 ? '#ef4444' : days <= 14 ? '#f59e0b' : '#475569';
    return (_jsxs("span", { style: { color, fontWeight: days < 0 ? '600' : '400' }, children: [formatDate(action.due_date), days < 0 && _jsxs("span", { style: { fontSize: '11px', marginLeft: '5px' }, children: ["(", Math.abs(days), "d overdue)"] }), days >= 0 && days <= 14 && _jsxs("span", { style: { fontSize: '11px', marginLeft: '5px' }, children: ["(in ", days, "d)"] })] }));
};
const STATUS_FILTERS = ['', 'open', 'in_progress', 'overdue', 'completed', 'closed'];
const STATUS_FILTER_LABELS = {
    '': 'All',
    open: 'Open',
    in_progress: 'In Progress',
    overdue: 'Overdue',
    completed: 'Completed',
    closed: 'Closed',
};
export const RemedialActionsPage = () => {
    const [actions, setActions] = useState([]);
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        remedialApi.getActions().then((res) => {
            setActions(res.data);
            setLoading(false);
        });
    }, []);
    const displayed = filter ? actions.filter((a) => a.status === filter) : actions;
    const open = actions.filter((a) => a.status === 'open').length;
    const inProgress = actions.filter((a) => a.status === 'in_progress').length;
    const overdue = actions.filter((a) => a.status === 'overdue').length;
    const critical = actions.filter((a) => a.priority === 'critical' && !['completed', 'closed'].includes(a.status)).length;
    const completed = actions.filter((a) => a.status === 'completed').length;
    return (_jsxs("div", { children: [_jsx(Navbar, {}), _jsxs("div", { style: { padding: '24px' }, children: [_jsx("h2", { style: { color: '#1e293b', marginBottom: '8px', fontSize: '28px', fontWeight: 'bold' }, children: "Remedial Actions" }), _jsx("p", { style: { color: '#64748b', marginBottom: '24px', fontSize: '14px' }, children: "Exam findings, audit issues, and self-identified gaps" }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '28px' }, children: [_jsx(StatCard, { label: "Total Actions", value: actions.length, color: "#3b82f6" }), _jsx(StatCard, { label: "Open", value: open, color: "#3b82f6" }), _jsx(StatCard, { label: "In Progress", value: inProgress, color: "#f59e0b" }), _jsx(StatCard, { label: "Overdue", value: overdue, color: "#ef4444" }), _jsx(StatCard, { label: "Critical (Open)", value: critical, color: "#7c3aed" }), _jsx(StatCard, { label: "Completed", value: completed, color: "#10b981" })] }), _jsx("div", { style: { display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }, children: STATUS_FILTERS.map((s) => (_jsx("button", { onClick: () => setFilter(s), style: {
                                padding: '6px 14px',
                                borderRadius: '6px',
                                border: '1px solid',
                                borderColor: filter === s ? '#3b82f6' : '#e2e8f0',
                                background: filter === s ? '#eff6ff' : 'white',
                                color: filter === s ? '#3b82f6' : '#475569',
                                fontWeight: filter === s ? '600' : '400',
                                cursor: 'pointer',
                                fontSize: '13px',
                            }, children: STATUS_FILTER_LABELS[s] }, s))) }), _jsx("div", { style: { background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }, children: _jsxs("table", { style: { width: '100%', borderCollapse: 'collapse' }, children: [_jsx("thead", { children: _jsx("tr", { style: { background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }, children: ['Title / Area', 'Source', 'Priority', 'Status', 'Owner', 'Regulator', 'Due Date', 'Description'].map((h) => (_jsx("th", { style: { padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }, children: h }, h))) }) }), _jsx("tbody", { children: loading ? (_jsx("tr", { children: _jsx("td", { colSpan: 8, style: { padding: '40px', textAlign: 'center', color: '#94a3b8' }, children: "Loading\u2026" }) })) : displayed.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 8, style: { padding: '40px', textAlign: 'center', color: '#94a3b8' }, children: "No actions found." }) })) : (displayed.map((a, i) => (_jsxs("tr", { style: { borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fafafa' }, children: [_jsxs("td", { style: { padding: '12px 16px', maxWidth: '220px' }, children: [_jsx("div", { style: { fontWeight: '600', color: '#1e293b', fontSize: '13px', marginBottom: '2px' }, children: a.title }), a.related_area && _jsx("span", { style: { fontSize: '11px', color: '#64748b', background: '#f1f5f9', padding: '1px 6px', borderRadius: '4px' }, children: a.related_area })] }), _jsx("td", { style: { padding: '12px 16px' }, children: _jsx(Badge, { label: SOURCE_LABELS[a.source] ?? a.source, color: "#64748b" }) }), _jsx("td", { style: { padding: '12px 16px' }, children: _jsx(Badge, { label: a.priority.charAt(0).toUpperCase() + a.priority.slice(1), color: PRIORITY_COLORS[a.priority] }) }), _jsx("td", { style: { padding: '12px 16px' }, children: _jsx(Badge, { label: STATUS_LABELS[a.status], color: STATUS_COLORS[a.status] }) }), _jsx("td", { style: { padding: '12px 16px', color: '#475569', fontSize: '13px' }, children: a.owner ?? '—' }), _jsx("td", { style: { padding: '12px 16px', color: '#475569', fontSize: '13px' }, children: a.regulator ?? '—' }), _jsx("td", { style: { padding: '12px 16px', fontSize: '13px' }, children: _jsx(DueCell, { action: a }) }), _jsx("td", { style: { padding: '12px 16px', color: '#64748b', fontSize: '12px', maxWidth: '220px' }, children: _jsx("span", { style: { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }, children: a.description ?? '—' }) })] }, a.id)))) })] }) })] })] }));
};
