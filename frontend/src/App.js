import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { CompliancePage } from './pages/CompliancePage';
import { PositionsPage } from './pages/PositionsPage';
import { AuditPage } from './pages/AuditPage';
import { MTLPage } from './pages/MTLPage';
import { RemedialActionsPage } from './pages/RemedialActionsPage';
import { BSAAMLPage } from './pages/BSAAMLPage';
import './styles/global.css';
function App() {
    return (_jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/compliance", element: _jsx(CompliancePage, {}) }), _jsx(Route, { path: "/positions", element: _jsx(PositionsPage, {}) }), _jsx(Route, { path: "/audit", element: _jsx(AuditPage, {}) }), _jsx(Route, { path: "/mtl", element: _jsx(MTLPage, {}) }), _jsx(Route, { path: "/remedial", element: _jsx(RemedialActionsPage, {}) }), _jsx(Route, { path: "/bsa-aml", element: _jsx(BSAAMLPage, {}) })] }) }));
}
export default App;
