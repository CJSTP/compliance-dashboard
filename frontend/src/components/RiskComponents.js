import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { RISK_COLORS } from '../config';
export const RiskBadge = ({ level, size = 'medium' }) => {
    const sizeMap = {
        small: { padding: '4px 8px', fontSize: '12px' },
        medium: { padding: '6px 12px', fontSize: '14px' },
        large: { padding: '8px 16px', fontSize: '16px' },
    };
    return (_jsx("span", { style: {
            background: RISK_COLORS[level],
            color: 'white',
            borderRadius: '4px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            ...sizeMap[size],
        }, children: level }));
};
export const RiskList = ({ risks, maxItems = 5 }) => {
    const displayRisks = risks.slice(0, maxItems);
    return (_jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '8px' }, children: [displayRisks.map((risk) => (_jsx("div", { style: {
                    background: 'white',
                    padding: '12px',
                    borderRadius: '6px',
                    borderLeft: `4px solid ${RISK_COLORS[risk.risk_level]}`,
                }, children: _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsxs("div", { children: [_jsxs("div", { style: { fontWeight: '600' }, children: ["Compliance Area ID: ", risk.compliance_area_id] }), risk.risk_description && (_jsx("div", { style: { fontSize: '12px', color: '#64748b', marginTop: '4px' }, children: risk.risk_description }))] }), _jsx(RiskBadge, { level: risk.risk_level, size: "small" })] }) }, risk.id))), risks.length > maxItems && (_jsxs("div", { style: { fontSize: '12px', color: '#64748b', fontStyle: 'italic' }, children: ["+", risks.length - maxItems, " more risks"] }))] }));
};
