import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { STATUS_COLORS } from '../config';
import { format } from 'date-fns';
export const ComplianceTable = ({ areas = [], loading = false }) => {
    const getStatusColor = (status) => {
        return STATUS_COLORS[status] || '#3b82f6';
    };
    return (_jsx("div", { style: {
            background: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }, children: _jsxs("table", { style: {
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '14px',
            }, children: [_jsx("thead", { children: _jsxs("tr", { style: { background: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }, children: [_jsx("th", { style: { padding: '12px', textAlign: 'left', fontWeight: '600' }, children: "Area" }), _jsx("th", { style: { padding: '12px', textAlign: 'left', fontWeight: '600' }, children: "Team" }), _jsx("th", { style: { padding: '12px', textAlign: 'center', fontWeight: '600' }, children: "Status" }), _jsx("th", { style: { padding: '12px', textAlign: 'left', fontWeight: '600' }, children: "Last Review" }), _jsx("th", { style: { padding: '12px', textAlign: 'left', fontWeight: '600' }, children: "Next Review" })] }) }), _jsx("tbody", { children: loading ? (_jsx("tr", { children: _jsx("td", { colSpan: 5, style: { padding: '20px', textAlign: 'center', color: '#64748b' }, children: "Loading compliance areas..." }) })) : areas.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 5, style: { padding: '20px', textAlign: 'center', color: '#64748b' }, children: "No compliance areas found" }) })) : (areas.map((area) => (_jsxs("tr", { style: {
                            borderBottom: '1px solid #e2e8f0',
                        }, children: [_jsxs("td", { style: { padding: '12px' }, children: [_jsx("div", { style: { fontWeight: '600', color: '#0f172a' }, children: area.name }), area.description && (_jsx("div", { style: { fontSize: '12px', color: '#64748b', marginTop: '4px' }, children: area.description }))] }), _jsx("td", { style: { padding: '12px' }, children: area.responsible_team || '-' }), _jsx("td", { style: { padding: '12px', textAlign: 'center' }, children: _jsx("span", { style: {
                                        background: getStatusColor(area.status),
                                        color: 'white',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        textTransform: 'capitalize',
                                    }, children: area.status.replace('_', ' ') }) }), _jsx("td", { style: { padding: '12px', fontSize: '12px', color: '#64748b' }, children: area.last_review_date
                                    ? format(new Date(area.last_review_date), 'MMM dd, yyyy')
                                    : '-' }), _jsx("td", { style: { padding: '12px', fontSize: '12px', color: '#64748b' }, children: area.next_review_date
                                    ? format(new Date(area.next_review_date), 'MMM dd, yyyy')
                                    : '-' })] }, area.id)))) })] }) }));
};
