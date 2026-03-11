import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { STATUS_COLORS } from '../config';
export const PositionTable = ({ positions = [], loading = false }) => {
    const getStatusColor = (utilizationPercent) => {
        if (utilizationPercent > 100)
            return STATUS_COLORS.non_compliant;
        if (utilizationPercent > 80)
            return STATUS_COLORS.under_monitoring;
        return STATUS_COLORS.compliant;
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
            }, children: [_jsx("thead", { children: _jsxs("tr", { style: { background: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }, children: [_jsx("th", { style: { padding: '12px', textAlign: 'left', fontWeight: '600' }, children: "Asset" }), _jsx("th", { style: { padding: '12px', textAlign: 'right', fontWeight: '600' }, children: "Max Position" }), _jsx("th", { style: { padding: '12px', textAlign: 'right', fontWeight: '600' }, children: "Current Position" }), _jsx("th", { style: { padding: '12px', textAlign: 'center', fontWeight: '600' }, children: "Utilization" }), _jsx("th", { style: { padding: '12px', textAlign: 'center', fontWeight: '600' }, children: "Status" })] }) }), _jsx("tbody", { children: loading ? (_jsx("tr", { children: _jsx("td", { colSpan: 5, style: { padding: '20px', textAlign: 'center', color: '#64748b' }, children: "Loading positions..." }) })) : positions.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 5, style: { padding: '20px', textAlign: 'center', color: '#64748b' }, children: "No positions found" }) })) : (positions.map((position) => (_jsxs("tr", { style: {
                            borderBottom: '1px solid #e2e8f0',
                            '&:hover': { background: '#f8fafc' },
                        }, children: [_jsx("td", { style: { padding: '12px' }, children: _jsx("span", { style: { fontWeight: '600', color: '#0f172a' }, children: position.asset_symbol }) }), _jsxs("td", { style: { padding: '12px', textAlign: 'right' }, children: ["$", position.max_position_usd.toLocaleString('en-US', { maximumFractionDigits: 2 })] }), _jsxs("td", { style: { padding: '12px', textAlign: 'right' }, children: ["$", position.current_position_usd.toLocaleString('en-US', { maximumFractionDigits: 2 })] }), _jsx("td", { style: { padding: '12px', textAlign: 'center' }, children: _jsxs("div", { style: {
                                        background: '#e2e8f0',
                                        borderRadius: '4px',
                                        overflow: 'hidden',
                                        height: '24px',
                                        position: 'relative',
                                    }, children: [_jsx("div", { style: {
                                                background: getStatusColor(position.current_utilization),
                                                height: '100%',
                                                width: `${Math.min(position.current_utilization, 100)}%`,
                                            } }), _jsxs("div", { style: {
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                                color: position.current_utilization > 50 ? 'white' : '#0f172a',
                                            }, children: [position.current_utilization.toFixed(1), "%"] })] }) }), _jsx("td", { style: { padding: '12px', textAlign: 'center' }, children: _jsx("span", { style: {
                                        background: getStatusColor(position.current_utilization),
                                        color: 'white',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        textTransform: 'capitalize',
                                    }, children: position.compliance_status }) })] }, position.id)))) })] }) }));
};
