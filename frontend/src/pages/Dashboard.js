import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, StatCard, RiskList, PositionTable, ComplianceTable } from '../components';
import { complianceApi, positionsApi, mtlApi, remedialApi, bsaApi } from '../services/api';
const SummaryCard = ({ title, to, items }) => (_jsxs("div", { style: {
        background: 'white',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsx("h3", { style: { fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: 0 }, children: title }), _jsx(Link, { to: to, style: { fontSize: '12px', color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }, children: "View all \u2192" })] }), _jsx("div", { style: { display: 'flex', gap: '16px', flexWrap: 'wrap' }, children: items.map((item) => (_jsxs("div", { style: { flex: '1', minWidth: '80px' }, children: [_jsx("div", { style: { fontSize: '22px', fontWeight: '700', color: item.color }, children: item.value }), _jsx("div", { style: { fontSize: '12px', color: '#64748b' }, children: item.label })] }, item.label))) })] }));
export const Dashboard = () => {
    const [complianceAreas, setComplianceAreas] = useState([]);
    const [positions, setPositions] = useState([]);
    const [riskItems, setRiskItems] = useState([]);
    const [licenses, setLicenses] = useState([]);
    const [actions, setActions] = useState([]);
    const [indicators, setIndicators] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const [areasRes, positionsRes, risksRes, licensesRes, actionsRes, indicatorsRes] = await Promise.all([
                    complianceApi.getAreas(),
                    positionsApi.getLimits(),
                    complianceApi.getHighRiskItems(),
                    mtlApi.getLicenses(),
                    remedialApi.getActions(),
                    bsaApi.getIndicators(),
                ]);
                setComplianceAreas(areasRes.data);
                setPositions(positionsRes.data);
                setRiskItems(risksRes.data);
                setLicenses(licensesRes.data);
                setActions(actionsRes.data);
                setIndicators(indicatorsRes.data);
            }
            catch (error) {
                console.error('Error loading dashboard:', error);
            }
            finally {
                setLoading(false);
            }
        };
        load();
    }, []);
    const compliantAreas = complianceAreas.filter((a) => a.status === 'compliant').length;
    const nonCompliantAreas = complianceAreas.filter((a) => a.status === 'non_compliant').length;
    const atRiskPositions = positions.filter((p) => p.current_utilization >= 80).length;
    const nonCompliantPositions = positions.filter((p) => p.compliance_status === 'non_compliant').length;
    // MTL
    const activeLicenses = licenses.filter((l) => l.status === 'active').length;
    const expiredLicenses = licenses.filter((l) => l.status === 'expired').length;
    const expiringSoon = licenses.filter((l) => {
        if (l.status !== 'active' || !l.renewal_due_date)
            return false;
        const days = Math.ceil((new Date(l.renewal_due_date).getTime() - Date.now()) / 86400000);
        return days <= 90;
    }).length;
    // Remedial
    const openActions = actions.filter((a) => a.status === 'open').length;
    const overdueActions = actions.filter((a) => a.status === 'overdue').length;
    const criticalActions = actions.filter((a) => a.priority === 'critical' && !['completed', 'closed'].includes(a.status)).length;
    // BSA/AML
    const currentIndicators = indicators.filter((i) => i.status === 'current').length;
    const atRiskIndicators = indicators.filter((i) => i.status === 'at_risk').length;
    const deficientIndicators = indicators.filter((i) => i.status === 'deficient').length;
    return (_jsxs("div", { children: [_jsx(Navbar, {}), _jsxs("div", { style: { padding: '24px' }, children: [_jsx("h2", { style: { color: '#1e293b', marginBottom: '20px', fontSize: '28px', fontWeight: 'bold' }, children: "Dashboard Overview" }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }, children: [_jsx(StatCard, { label: "Compliance Areas", value: complianceAreas.length, color: "#3b82f6" }), _jsx(StatCard, { label: "Compliant", value: compliantAreas, color: "#10b981" }), _jsx(StatCard, { label: "Non-Compliant", value: nonCompliantAreas, color: "#ef4444" }), _jsx(StatCard, { label: "High Risk Items", value: riskItems.length, color: "#f59e0b" }), _jsx(StatCard, { label: "At-Risk Positions", value: atRiskPositions, color: "#f59e0b" }), _jsx(StatCard, { label: "Positions Breached", value: nonCompliantPositions, color: "#ef4444" })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '32px' }, children: [_jsx(SummaryCard, { title: "MTL Licenses", to: "/mtl", items: [
                                    { label: 'Active', value: activeLicenses, color: '#10b981' },
                                    { label: 'Expired', value: expiredLicenses, color: '#ef4444' },
                                    { label: 'Renewing ≤90d', value: expiringSoon, color: '#f59e0b' },
                                    { label: 'Pending', value: licenses.filter((l) => l.status === 'pending').length, color: '#3b82f6' },
                                ] }), _jsx(SummaryCard, { title: "Remedial Actions", to: "/remedial", items: [
                                    { label: 'Open', value: openActions, color: '#3b82f6' },
                                    { label: 'Overdue', value: overdueActions, color: '#ef4444' },
                                    { label: 'Critical (open)', value: criticalActions, color: '#7c3aed' },
                                    { label: 'In Progress', value: actions.filter((a) => a.status === 'in_progress').length, color: '#f59e0b' },
                                ] }), _jsx(SummaryCard, { title: "BSA / AML Program", to: "/bsa-aml", items: [
                                    { label: 'Current', value: currentIndicators, color: '#10b981' },
                                    { label: 'At Risk', value: atRiskIndicators, color: '#f59e0b' },
                                    { label: 'Deficient', value: deficientIndicators, color: '#ef4444' },
                                    { label: 'Total Metrics', value: indicators.length, color: '#64748b' },
                                ] })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }, children: [_jsxs("div", { children: [_jsxs("h3", { style: { fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#1e293b' }, children: ["Compliance Areas (", complianceAreas.length, ")"] }), _jsx(ComplianceTable, { areas: complianceAreas.slice(0, 5), loading: loading })] }), _jsxs("div", { children: [_jsxs("h3", { style: { fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#1e293b' }, children: ["High Risk Items (", riskItems.length, ")"] }), _jsx(RiskList, { risks: riskItems, maxItems: 5 })] })] }), _jsxs("div", { children: [_jsxs("h3", { style: { fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#1e293b' }, children: ["Position Limits (", positions.length, ")"] }), _jsx(PositionTable, { positions: positions.slice(0, 10), loading: loading })] })] })] }));
};
