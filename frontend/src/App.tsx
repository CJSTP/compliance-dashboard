import React from 'react';
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
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/compliance" element={<CompliancePage />} />
        <Route path="/positions" element={<PositionsPage />} />
        <Route path="/audit" element={<AuditPage />} />
        <Route path="/mtl" element={<MTLPage />} />
        <Route path="/remedial" element={<RemedialActionsPage />} />
        <Route path="/bsa-aml" element={<BSAAMLPage />} />
      </Routes>
    </Router>
  );
}

export default App;
