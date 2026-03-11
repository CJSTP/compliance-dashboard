import axios from 'axios';
import { API_BASE_URL } from '../config';
import {
  ComplianceArea,
  RiskAssessment,
  PositionLimit,
  AuditLog,
  Jurisdiction,
  MTLLicense,
  RemedialAction,
  BSAAMLIndicator,
} from '../types';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Compliance API
export const complianceApi = {
  getAreas: (status?: string) =>
    api.get<ComplianceArea[]>('/api/compliance/areas', { params: { status } }),
  getArea: (id: number) => api.get<ComplianceArea>(`/api/compliance/areas/${id}`),
  createArea: (data: Partial<ComplianceArea>) =>
    api.post<ComplianceArea>('/api/compliance/areas', data),
  updateArea: (id: number, data: Partial<ComplianceArea>) =>
    api.put<ComplianceArea>(`/api/compliance/areas/${id}`, data),
  getOverdueReviews: () =>
    api.get<ComplianceArea[]>('/api/compliance/areas/overdue-reviews'),
  getRiskAssessments: (areaId: number) =>
    api.get<RiskAssessment[]>(`/api/compliance/risk-assessments/area/${areaId}`),
  createRiskAssessment: (data: Partial<RiskAssessment>) =>
    api.post<RiskAssessment>('/api/compliance/risk-assessments', data),
  getHighRiskItems: () =>
    api.get<RiskAssessment[]>('/api/compliance/risk-assessments/high-risk'),
};

// Position Limits API
export const positionsApi = {
  getLimits: (activeOnly?: boolean) =>
    api.get<PositionLimit[]>('/api/positions/limits', { params: { active_only: activeOnly } }),
  getLimit: (id: number) => api.get<PositionLimit>(`/api/positions/limits/${id}`),
  getLimitBySymbol: (symbol: string) =>
    api.get<PositionLimit>(`/api/positions/limits/symbol/${symbol}`),
  createLimit: (data: Partial<PositionLimit>) =>
    api.post<PositionLimit>('/api/positions/limits', data),
  updateLimit: (id: number, data: Partial<PositionLimit>) =>
    api.put<PositionLimit>(`/api/positions/limits/${id}`, data),
  getAtRiskPositions: () =>
    api.get<PositionLimit[]>('/api/positions/at-risk'),
  getNonCompliantPositions: () =>
    api.get<PositionLimit[]>('/api/positions/non-compliant'),
};

// Audit Logs API
export const auditApi = {
  getLogs: (limit?: number, offset?: number) =>
    api.get<AuditLog[]>('/api/audit/logs', { params: { limit, offset } }),
  createLog: (data: Partial<AuditLog>) =>
    api.post<AuditLog>('/api/audit/logs', data),
  getEntityLogs: (entityType: string, entityId: number) =>
    api.get<AuditLog[]>(`/api/audit/logs/entity/${entityType}/${entityId}`),
};

// MTL Licenses API
export const mtlApi = {
  getLicenses: (status?: string) =>
    api.get<MTLLicense[]>('/api/mtl/licenses', { params: { status } }),
  getLicense: (id: number) => api.get<MTLLicense>(`/api/mtl/licenses/${id}`),
  getExpiringSoon: (days?: number) =>
    api.get<MTLLicense[]>('/api/mtl/licenses/expiring-soon', { params: { days } }),
  createLicense: (data: Partial<MTLLicense>) =>
    api.post<MTLLicense>('/api/mtl/licenses', data),
  updateLicense: (id: number, data: Partial<MTLLicense>) =>
    api.put<MTLLicense>(`/api/mtl/licenses/${id}`, data),
};

// Remedial Actions API
export const remedialApi = {
  getActions: (status?: string, priority?: string) =>
    api.get<RemedialAction[]>('/api/remedial/actions', { params: { status, priority } }),
  getAction: (id: number) => api.get<RemedialAction>(`/api/remedial/actions/${id}`),
  getOverdue: () => api.get<RemedialAction[]>('/api/remedial/actions/overdue'),
  getOpenCritical: () => api.get<RemedialAction[]>('/api/remedial/actions/open-critical'),
  createAction: (data: Partial<RemedialAction>) =>
    api.post<RemedialAction>('/api/remedial/actions', data),
  updateAction: (id: number, data: Partial<RemedialAction>) =>
    api.put<RemedialAction>(`/api/remedial/actions/${id}`, data),
};

// BSA/AML Indicators API
export const bsaApi = {
  getIndicators: (status?: string, programArea?: string) =>
    api.get<BSAAMLIndicator[]>('/api/bsa/indicators', { params: { status, program_area: programArea } }),
  getIndicator: (id: number) => api.get<BSAAMLIndicator>(`/api/bsa/indicators/${id}`),
  getDeficient: () => api.get<BSAAMLIndicator[]>('/api/bsa/indicators/deficient'),
  createIndicator: (data: Partial<BSAAMLIndicator>) =>
    api.post<BSAAMLIndicator>('/api/bsa/indicators', data),
  updateIndicator: (id: number, data: Partial<BSAAMLIndicator>) =>
    api.put<BSAAMLIndicator>(`/api/bsa/indicators/${id}`, data),
};

export default api;
