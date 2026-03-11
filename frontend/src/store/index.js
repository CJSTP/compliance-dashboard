import { create } from 'zustand';
export const useAppStore = create((set) => ({
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
