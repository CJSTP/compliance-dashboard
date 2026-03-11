import axios from 'axios';
import { API_BASE_URL } from '../config';
const api = axios.create({
    baseURL: API_BASE_URL,
});
// Compliance API
export const complianceApi = {
    getAreas: (status) => api.get('/api/compliance/areas', { params: { status } }),
    getArea: (id) => api.get(`/api/compliance/areas/${id}`),
    createArea: (data) => api.post('/api/compliance/areas', data),
    updateArea: (id, data) => api.put(`/api/compliance/areas/${id}`, data),
    getOverdueReviews: () => api.get('/api/compliance/areas/overdue-reviews'),
    getRiskAssessments: (areaId) => api.get(`/api/compliance/risk-assessments/area/${areaId}`),
    createRiskAssessment: (data) => api.post('/api/compliance/risk-assessments', data),
    getHighRiskItems: () => api.get('/api/compliance/risk-assessments/high-risk'),
};
// Position Limits API
export const positionsApi = {
    getLimits: (activeOnly) => api.get('/api/positions/limits', { params: { active_only: activeOnly } }),
    getLimit: (id) => api.get(`/api/positions/limits/${id}`),
    getLimitBySymbol: (symbol) => api.get(`/api/positions/limits/symbol/${symbol}`),
    createLimit: (data) => api.post('/api/positions/limits', data),
    updateLimit: (id, data) => api.put(`/api/positions/limits/${id}`, data),
    getAtRiskPositions: () => api.get('/api/positions/at-risk'),
    getNonCompliantPositions: () => api.get('/api/positions/non-compliant'),
};
// Audit Logs API
export const auditApi = {
    getLogs: (limit, offset) => api.get('/api/audit/logs', { params: { limit, offset } }),
    createLog: (data) => api.post('/api/audit/logs', data),
    getEntityLogs: (entityType, entityId) => api.get(`/api/audit/logs/entity/${entityType}/${entityId}`),
};
// MTL Licenses API
export const mtlApi = {
    getLicenses: (status) => api.get('/api/mtl/licenses', { params: { status } }),
    getLicense: (id) => api.get(`/api/mtl/licenses/${id}`),
    getExpiringSoon: (days) => api.get('/api/mtl/licenses/expiring-soon', { params: { days } }),
    createLicense: (data) => api.post('/api/mtl/licenses', data),
    updateLicense: (id, data) => api.put(`/api/mtl/licenses/${id}`, data),
};
// Remedial Actions API
export const remedialApi = {
    getActions: (status, priority) => api.get('/api/remedial/actions', { params: { status, priority } }),
    getAction: (id) => api.get(`/api/remedial/actions/${id}`),
    getOverdue: () => api.get('/api/remedial/actions/overdue'),
    getOpenCritical: () => api.get('/api/remedial/actions/open-critical'),
    createAction: (data) => api.post('/api/remedial/actions', data),
    updateAction: (id, data) => api.put(`/api/remedial/actions/${id}`, data),
};
// BSA/AML Indicators API
export const bsaApi = {
    getIndicators: (status, programArea) => api.get('/api/bsa/indicators', { params: { status, program_area: programArea } }),
    getIndicator: (id) => api.get(`/api/bsa/indicators/${id}`),
    getDeficient: () => api.get('/api/bsa/indicators/deficient'),
    createIndicator: (data) => api.post('/api/bsa/indicators', data),
    updateIndicator: (id, data) => api.put(`/api/bsa/indicators/${id}`, data),
};
export default api;
