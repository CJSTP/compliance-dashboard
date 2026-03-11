import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const StatCard = ({ label, value, color = '#3b82f6', icon, }) => {
    return (_jsx("div", { style: {
            background: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: `2px solid ${color}`,
            minWidth: '200px',
        }, children: _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '12px' }, children: [icon && _jsx("div", { style: { fontSize: '24px' }, children: icon }), _jsxs("div", { style: { flex: 1 }, children: [_jsx("div", { style: { fontSize: '12px', color: '#64748b', fontWeight: '500' }, children: label }), _jsx("div", { style: {
                                fontSize: '28px',
                                fontWeight: 'bold',
                                color,
                                marginTop: '4px',
                            }, children: value })] })] }) }));
};
