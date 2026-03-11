import { create } from 'zustand';
import { ComplianceArea, PositionLimit, RiskAssessment, DashboardStats } from '../types';

interface AppStore {
  // Data
  complianceAreas: ComplianceArea[];
  positionLimits: PositionLimit[];
  riskAssessments: RiskAssessment[];
  stats: DashboardStats | null;
  
  // Loading states
  loading: boolean;
  error: string | null;
  
  // Actions
  setComplianceAreas: (areas: ComplianceArea[]) => void;
  setPositionLimits: (limits: PositionLimit[]) => void;
  setRiskAssessments: (assessments: RiskAssessment[]) => void;
  setStats: (stats: DashboardStats) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  complianceAreas: [],
  positionLimits: [],
  riskAssessments: [],
  stats: null,
  loading: false,
  error: null,
  
  setComplianceAreas: (areas) => set({ complianceAreas: areas }),
  setPositionLimits: (limits) => set({ positionLimits: limits }),
  setRiskAssessments: (assessments) => set({ riskAssessments: assessments }),
  setStats: (stats) => set({ stats }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
