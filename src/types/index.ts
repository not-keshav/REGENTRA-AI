/**
 * REGENTRA AI - Data Types and Schemas
 * Integrated AICTE Approval Workflow Automation, Compliance Monitoring and Alert Management System
 * Problem Statement: SIH 26262 | Team: 555_DIAMOND | Smart India Hackathon 2026
 */

export type UserRole =
  | 'INSTITUTION_ADMIN'
  | 'SCRUTINY_OFFICER'
  | 'SENIOR_OFFICER'
  | 'COMPLIANCE_ADMIN'
  | 'SUPER_ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  institutionId?: string;
  department?: string;
  designation?: string;
  phone?: string;
  createdAt: string;
  active: boolean;
}

export type InstitutionType =
  | 'Engineering & Technology'
  | 'Management (MBA/PGDM)'
  | 'Pharmacy'
  | 'Architecture & Planning'
  | 'Applied Arts & Crafts'
  | 'Hotel Management & Catering'
  | 'Polytechnic Diploma';

export interface Institution {
  id: string;
  institutionId: string; // e.g. "AICTE-1-332456789"
  name: string;
  type: InstitutionType;
  state: string;
  district: string;
  address: string;
  contactPerson: string;
  email: string;
  phone: string;
  affiliationUniversity: string;
  establishmentYear: number;
  totalLandAcres: number;
  builtUpAreaSqM: number;
  totalApprovedIntake: number;
  complianceScore: number; // 0 - 100
  status: 'Active' | 'Pending Verification' | 'Deficient' | 'Suspended';
  createdAt: string;
}

export type ApplicationCategory =
  | 'New Technical Institution'
  | 'Extension of Approval (EoA)'
  | 'Increase in Intake'
  | 'Introduction of New Courses'
  | 'Change in Name / Site'
  | 'Closure of Course / Institute'
  | 'NRI / OCI / FN Quota';

export type ApplicationStatus =
  | 'Submitted'
  | 'Document Pre-Scrutiny'
  | 'Under Scrutiny'
  | 'Deficiency Identified'
  | 'Correction Required'
  | 'Resubmitted'
  | 'Pending EVC'
  | 'Senior Review'
  | 'Approved'
  | 'Rejected'
  | 'Returned';

export type RiskCategory = 'Low' | 'Medium' | 'High' | 'Critical';

export interface CourseIntake {
  courseName: string;
  degreeLevel: 'UG' | 'PG' | 'Diploma';
  durationYears: number;
  proposedIntake: number;
  existingIntake?: number;
}

export interface Application {
  id: string;
  applicationId: string; // e.g. "REG-2026-00001"
  institutionId: string;
  institutionName: string;
  category: ApplicationCategory;
  academicYear: string; // e.g. "2026-2027"
  courses: CourseIntake[];
  intakeCapacity: number;
  existingApprovalNumber?: string;
  description: string;
  status: ApplicationStatus;
  currentStageId: string;
  currentStageName: string;
  assignedOfficerId?: string;
  assignedOfficerName?: string;
  assignedOfficerEmail?: string;
  riskScore: number; // 0 - 100
  riskCategory: RiskCategory;
  submittedAt: string;
  updatedAt: string;
  deadlineDate: string;
  pendingDays: number;
  deficiencyNotes?: string[];
  finalRemarks?: string;
  correctionCycles: number;
  declarationAccepted: boolean;
}

export type DocumentCategory =
  | 'Application Form'
  | 'Land Documents'
  | 'Building Documents'
  | 'Faculty Details'
  | 'Infrastructure Certificates'
  | 'Financial Documents'
  | 'Fire Safety Certificate'
  | 'Undertakings'
  | 'Other Supporting Documents';

export type DocumentStatus =
  | 'Valid'
  | 'Invalid'
  | 'Incomplete'
  | 'Needs Manual Review'
  | 'Processing Failed';

export interface DocumentRecord {
  id: string;
  applicationId: string;
  category: DocumentCategory;
  name: string;
  fileName: string;
  fileSize: number; // in bytes
  fileType: string;
  fileDataUrl?: string; // Base64 or mock preview URL
  uploadDate: string;
  status: DocumentStatus;
  ocrExtractedText: string;
  aiSummary: string;
  missingFields: string[];
  mismatchWarnings: string[];
  confidenceScore: number; // 0 - 100
  officerVerified: boolean;
  officerVerificationDate?: string;
  officerRemarks?: string;
  officerOverrideReason?: string;
  expiryDate?: string;
  extractedMetadata?: {
    issuingAuthority?: string;
    certificateNumber?: string;
    validTill?: string;
    registeredArea?: string;
    surveyNumber?: string;
    principalName?: string;
  };
}

export type ComplianceSeverity = 'Critical' | 'High' | 'Medium' | 'Low';

export interface ComplianceRule {
  id: string;
  ruleId: string; // e.g. "CR-LAND-01"
  name: string;
  description: string;
  applicableCategory: ApplicationCategory | 'All Categories';
  requiredCondition: string;
  severity: ComplianceSeverity;
  validationLogicDescription: string;
  effectiveDate: string;
  version: string;
  active: boolean;
}

export interface RuleViolation {
  ruleId: string;
  ruleName: string;
  severity: ComplianceSeverity;
  detail: string;
  recommendedAction: string;
}

export interface ComplianceResult {
  id: string;
  applicationId: string;
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  warningsCount: number;
  checkedAt: string;
  violations: RuleViolation[];
  missingMandatoryDocs: DocumentCategory[];
  compliancePercentage: number;
  recommendedCorrectiveActions: string[];
}

export interface WorkflowStage {
  id: string;
  stageId: string;
  sequence: number;
  name: string;
  description: string;
  defaultAssigneeRole: UserRole;
  slaDays: number;
  autoForwardOnPass: boolean;
}

export interface WorkflowHistoryItem {
  id: string;
  applicationId: string;
  fromStage: string;
  toStage: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  timestamp: string;
  remarks: string;
}

export interface OfficerAssignment {
  id: string;
  officerId: string;
  officerName: string;
  email: string;
  role: UserRole;
  department: string;
  assignedCount: number;
  pendingCount: number;
  completedCount: number;
  avgProcessingDays: number;
  maxCapacity: number;
  active: boolean;
}

export interface RiskFactorItem {
  factor: string;
  impactScore: number; // 0 - 30 contribution
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  observation: string;
}

export interface RiskAssessment {
  id: string;
  applicationId: string;
  score: number; // 0 - 100
  category: RiskCategory;
  factors: RiskFactorItem[];
  pendingDays: number;
  missingDocumentsCount: number;
  deadlineProximityDays: number;
  stageWorkloadScore: number;
  correctionCycles: number;
  recommendation: string;
  evaluatedAt: string;
}

export interface SimulationParameters {
  pendingApplicationsCount: number;
  scrutinyOfficersCount: number;
  avgDocumentVerificationHours: number;
  dailyApplicationInflow: number;
  avgCorrectionCycles: number;
  availableWorkingDays: number;
  priorityProcessingEnabled: boolean;
}

export interface SimulationResults {
  id: string;
  timestamp: string;
  scenarioName: string;
  parameters: SimulationParameters;
  estimatedTotalProcessingDays: number;
  expectedBacklogAtEnd: number;
  avgWaitTimePerApplicationDays: number;
  officerUtilizationRate: number; // percentage
  stageWiseBottlenecks: {
    stageName: string;
    avgQueueSize: number;
    delayImpactHours: number;
  }[];
  scenarioComparison: {
    name: string;
    backlog: number;
    avgDays: number;
    utilization: number;
  }[];
  aiBottleneckRecommendation: string;
}

export type NotificationType =
  | 'MISSING_DOCUMENT'
  | 'DEADLINE_APPROACHING'
  | 'SLA_BREACH'
  | 'HIGH_RISK_ALERT'
  | 'COMPLIANCE_VIOLATION'
  | 'CORRECTION_REQUIRED'
  | 'OFFICER_ASSIGNED'
  | 'APPLICATION_APPROVED'
  | 'APPLICATION_REJECTED'
  | 'STAGE_FORWARDED';

export interface NotificationItem {
  id: string;
  userId?: string;
  targetRole?: UserRole;
  title: string;
  message: string;
  type: NotificationType;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  applicationId?: string;
  institutionName?: string;
  read: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  applicationId?: string;
  previousValue?: string;
  newValue?: string;
  remarks?: string;
  ipAddress?: string;
  timestamp: string;
}

export interface SystemSettings {
  id: string;
  activeAcademicYear: string;
  handbookVersion: string;
  defaultSlaPreScrutinyDays: number;
  defaultSlaScrutinyDays: number;
  defaultSlaEvcDays: number;
  defaultSlaSeniorReviewDays: number;
  riskThresholdLow: number;
  riskThresholdMedium: number;
  riskThresholdHigh: number;
  emailAlertsEnabled: boolean;
  aiAutoScrutinyEnabled: boolean;
  maintenanceMode: boolean;
}
