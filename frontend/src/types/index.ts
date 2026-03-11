// Type definitions for the API

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum ComplianceStatus {
  COMPLIANT = 'compliant',
  NON_COMPLIANT = 'non_compliant',
  PENDING_REVIEW = 'pending_review',
  UNDER_MONITORING = 'under_monitoring',
}

export interface Jurisdiction {
  id: number;
  name: string;
  code: string;
  region?: string;
  created_at: string;
}

export interface ComplianceArea {
  id: number;
  name: string;
  description?: string;
  jurisdiction_id: number;
  status: ComplianceStatus;
  last_review_date?: string;
  next_review_date?: string;
  responsible_team?: string;
  created_at: string;
  updated_at: string;
}

export interface RiskAssessment {
  id: number;
  compliance_area_id: number;
  risk_level: RiskLevel;
  risk_description?: string;
  mitigation_strategy?: string;
  assessed_by?: string;
  assessed_date: string;
  next_assessment_date?: string;
  created_at: string;
  updated_at: string;
}

export interface PositionLimit {
  id: number;
  asset_symbol: string;
  jurisdiction_id?: number;
  max_position_usd: number;
  current_position_usd: number;
  limit_percentage?: number;
  warning_threshold?: number;
  current_utilization: number;
  is_active: boolean;
  compliance_status: ComplianceStatus;
  last_checked: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: number;
  timestamp: string;
  action: string;
  entity_type?: string;
  entity_id?: number;
  user?: string;
  details?: string;
  severity: RiskLevel;
  created_at: string;
}

export interface DashboardStats {
  total_compliance_areas: number;
  compliant_areas: number;
  non_compliant_areas: number;
  pending_reviews: number;
  high_risk_items: number;
  at_risk_positions: number;
  non_compliant_positions: number;
}

// ── MTL License ───────────────────────────────────────────────────────────────

export type MTLStatus = 'active' | 'expired' | 'pending' | 'surrendered' | 'exempted';

export interface MTLLicense {
  id: number;
  state: string;
  state_code: string;
  license_number?: string;
  regulator?: string;
  status: MTLStatus;
  issue_date?: string;
  expiry_date?: string;
  renewal_due_date?: string;
  application_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// ── Remedial Actions ──────────────────────────────────────────────────────────

export type ActionSource = 'exam' | 'self_identified' | 'audit' | 'regulatory_inquiry' | 'complaint';
export type ActionStatus = 'open' | 'in_progress' | 'completed' | 'overdue' | 'closed';

export interface RemedialAction {
  id: number;
  title: string;
  description?: string;
  source: ActionSource;
  priority: RiskLevel;
  status: ActionStatus;
  owner?: string;
  regulator?: string;
  related_area?: string;
  due_date?: string;
  completion_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// ── BSA/AML Indicators ────────────────────────────────────────────────────────

export type BSAIndicatorStatus = 'current' | 'at_risk' | 'deficient' | 'not_applicable';
export type BSAProgramArea =
  | 'sar_filing'
  | 'ctr_filing'
  | 'ofac_screening'
  | 'kyc_cip'
  | 'transaction_monitoring'
  | 'customer_due_diligence'
  | 'enhanced_due_diligence'
  | 'record_retention'
  | 'training'
  | 'independent_testing';

export interface BSAAMLIndicator {
  id: number;
  program_area: BSAProgramArea;
  metric_name: string;
  metric_value?: string;
  threshold?: string;
  status: BSAIndicatorStatus;
  responsible_team?: string;
  last_review_date?: string;
  next_review_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}
