// Types for SmartClaimRx application

export interface Claim {
  id: string;
  patientName: string;
  drugName: string;
  dateSubmitted: string;
  status: 'pending' | 'approved' | 'denied' | 'appealing' | 'resolved';
  amountBilled: number;
  amountApproved: number;
  denialReason?: string;
  appealDeadline?: string;
  insurerName: string;
}

export interface DashboardStats {
  totalClaims: number;
  pendingClaims: number;
  deniedClaims: number;
  appealingClaims: number;
  approvalRate: number;
  totalRevenue: number;
  potentialLoss: number;
}

export interface DenialReason {
  code: string;
  description: string;
  category: 'formulary' | 'patient_info' | 'prior_auth' | 'step_therapy' | 'quantity_limit' | 'other';
  recommendedAction: string;
  appealSuccessRate: number;
}

export interface AppealTemplate {
  id: string;
  name: string;
  denialType: string;
  templateContent: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  npi: string;
  ncpdpId: string;
}
