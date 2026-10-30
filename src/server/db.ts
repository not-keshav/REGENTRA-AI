/**
 * REGENTRA AI - Database Persistence Manager
 * Persistent local file-backed JSON database matching Firestore Collections schema
 */

import fs from 'fs';
import path from 'path';
import {
  User,
  Institution,
  Application,
  DocumentRecord,
  ComplianceRule,
  ComplianceResult,
  WorkflowStage,
  WorkflowHistoryItem,
  OfficerAssignment,
  RiskAssessment,
  SimulationResults,
  NotificationItem,
  AuditLog,
  SystemSettings
} from '../types/index.ts';
import {
  INITIAL_USERS,
  INITIAL_INSTITUTIONS,
  INITIAL_APPLICATIONS,
  INITIAL_DOCUMENTS,
  INITIAL_COMPLIANCE_RULES,
  INITIAL_COMPLIANCE_RESULTS,
  INITIAL_WORKFLOW_STAGES,
  INITIAL_WORKFLOW_HISTORY,
  INITIAL_OFFICER_ASSIGNMENTS,
  INITIAL_RISK_ASSESSMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SYSTEM_SETTINGS
} from '../../data/seedData.ts';

export interface DatabaseSchema {
  users: User[];
  institutions: Institution[];
  applications: Application[];
  documents: DocumentRecord[];
  complianceRules: ComplianceRule[];
  complianceResults: Record<string, ComplianceResult>; // key: applicationId
  workflowStages: WorkflowStage[];
  workflowHistory: WorkflowHistoryItem[];
  officerAssignments: OfficerAssignment[];
  riskAssessments: RiskAssessment[];
  simulationResults: SimulationResults[];
  notifications: NotificationItem[];
  auditLogs: AuditLog[];
  systemSettings: SystemSettings;
}

const DB_FILE_PATH = path.resolve(process.cwd(), 'data', 'regentra_db.json');

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private getDefaultData(): DatabaseSchema {
    return {
      users: [...INITIAL_USERS],
      institutions: [...INITIAL_INSTITUTIONS],
      applications: [...INITIAL_APPLICATIONS],
      documents: [...INITIAL_DOCUMENTS],
      complianceRules: [...INITIAL_COMPLIANCE_RULES],
      complianceResults: { ...INITIAL_COMPLIANCE_RESULTS },
      workflowStages: [...INITIAL_WORKFLOW_STAGES],
      workflowHistory: [...INITIAL_WORKFLOW_HISTORY],
      officerAssignments: [...INITIAL_OFFICER_ASSIGNMENTS],
      riskAssessments: [...INITIAL_RISK_ASSESSMENTS],
      simulationResults: [],
      notifications: [...INITIAL_NOTIFICATIONS],
      auditLogs: [...INITIAL_AUDIT_LOGS],
      systemSettings: { ...INITIAL_SYSTEM_SETTINGS }
    };
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(fileContent);
        return {
          ...this.getDefaultData(),
          ...parsed
        };
      }
    } catch (err) {
      console.warn('Could not read existing database file, initializing with fresh seed data.', err);
    }

    const defaultData = this.getDefaultData();
    this.saveDatabase(defaultData);
    return defaultData;
  }

  private saveDatabase(dataToSave?: DatabaseSchema): void {
    try {
      const data = dataToSave || this.data;
      const dir = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save database file:', err);
    }
  }

  public resetToDefault(): void {
    this.data = this.getDefaultData();
    this.saveDatabase();
  }

  // --- Collection Getters & Setters ---

  public getUsers(): User[] {
    return this.data.users;
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public addUser(user: User): User {
    this.data.users.unshift(user);
    this.saveDatabase();
    return user;
  }

  public getInstitutions(): Institution[] {
    return this.data.institutions;
  }

  public getInstitutionById(id: string): Institution | undefined {
    return this.data.institutions.find(i => i.id === id || i.institutionId === id);
  }

  public addInstitution(inst: Institution): Institution {
    this.data.institutions.unshift(inst);
    this.saveDatabase();
    return inst;
  }

  public updateInstitution(id: string, updates: Partial<Institution>): Institution | undefined {
    const idx = this.data.institutions.findIndex(i => i.id === id || i.institutionId === id);
    if (idx === -1) return undefined;
    this.data.institutions[idx] = { ...this.data.institutions[idx], ...updates };
    this.saveDatabase();
    return this.data.institutions[idx];
  }

  public getApplications(): Application[] {
    return this.data.applications;
  }

  public getApplicationById(id: string): Application | undefined {
    return this.data.applications.find(a => a.id === id || a.applicationId === id);
  }

  public addApplication(app: Application): Application {
    this.data.applications.unshift(app);
    this.saveDatabase();
    return app;
  }

  public updateApplication(id: string, updates: Partial<Application>): Application | undefined {
    const idx = this.data.applications.findIndex(a => a.id === id || a.applicationId === id);
    if (idx === -1) return undefined;
    this.data.applications[idx] = {
      ...this.data.applications[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveDatabase();
    return this.data.applications[idx];
  }

  public getDocuments(applicationId?: string): DocumentRecord[] {
    if (applicationId) {
      return this.data.documents.filter(d => d.applicationId === applicationId);
    }
    return this.data.documents;
  }

  public getDocumentById(id: string): DocumentRecord | undefined {
    return this.data.documents.find(d => d.id === id);
  }

  public addDocument(doc: DocumentRecord): DocumentRecord {
    this.data.documents.unshift(doc);
    this.saveDatabase();
    return doc;
  }

  public updateDocument(id: string, updates: Partial<DocumentRecord>): DocumentRecord | undefined {
    const idx = this.data.documents.findIndex(d => d.id === id);
    if (idx === -1) return undefined;
    this.data.documents[idx] = { ...this.data.documents[idx], ...updates };
    this.saveDatabase();
    return this.data.documents[idx];
  }

  public getComplianceRules(): ComplianceRule[] {
    return this.data.complianceRules;
  }

  public getComplianceRuleById(id: string): ComplianceRule | undefined {
    return this.data.complianceRules.find(r => r.id === id || r.ruleId === id);
  }

  public addComplianceRule(rule: ComplianceRule): ComplianceRule {
    this.data.complianceRules.push(rule);
    this.saveDatabase();
    return rule;
  }

  public updateComplianceRule(id: string, updates: Partial<ComplianceRule>): ComplianceRule | undefined {
    const idx = this.data.complianceRules.findIndex(r => r.id === id || r.ruleId === id);
    if (idx === -1) return undefined;
    this.data.complianceRules[idx] = { ...this.data.complianceRules[idx], ...updates };
    this.saveDatabase();
    return this.data.complianceRules[idx];
  }

  public getComplianceResult(applicationId: string): ComplianceResult | undefined {
    return this.data.complianceResults[applicationId];
  }

  public setComplianceResult(applicationId: string, result: ComplianceResult): ComplianceResult {
    this.data.complianceResults[applicationId] = result;
    this.saveDatabase();
    return result;
  }

  public getWorkflowStages(): WorkflowStage[] {
    return this.data.workflowStages.sort((a, b) => a.sequence - b.sequence);
  }

  public updateWorkflowStage(id: string, updates: Partial<WorkflowStage>): WorkflowStage | undefined {
    const idx = this.data.workflowStages.findIndex(s => s.id === id || s.stageId === id);
    if (idx === -1) return undefined;
    this.data.workflowStages[idx] = { ...this.data.workflowStages[idx], ...updates };
    this.saveDatabase();
    return this.data.workflowStages[idx];
  }

  public getWorkflowHistory(applicationId?: string): WorkflowHistoryItem[] {
    if (applicationId) {
      return this.data.workflowHistory
        .filter(w => w.applicationId === applicationId)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }
    return this.data.workflowHistory.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public addWorkflowHistoryItem(item: WorkflowHistoryItem): WorkflowHistoryItem {
    this.data.workflowHistory.push(item);
    this.saveDatabase();
    return item;
  }

  public getOfficerAssignments(): OfficerAssignment[] {
    return this.data.officerAssignments;
  }

  public updateOfficerAssignment(officerId: string, updates: Partial<OfficerAssignment>): OfficerAssignment | undefined {
    const idx = this.data.officerAssignments.findIndex(o => o.officerId === officerId || o.id === officerId);
    if (idx === -1) return undefined;
    this.data.officerAssignments[idx] = { ...this.data.officerAssignments[idx], ...updates };
    this.saveDatabase();
    return this.data.officerAssignments[idx];
  }

  public getRiskAssessments(): RiskAssessment[] {
    return this.data.riskAssessments;
  }

  public getRiskAssessment(applicationId: string): RiskAssessment | undefined {
    return this.data.riskAssessments.find(r => r.applicationId === applicationId);
  }

  public setRiskAssessment(assessment: RiskAssessment): RiskAssessment {
    const idx = this.data.riskAssessments.findIndex(r => r.applicationId === assessment.applicationId);
    if (idx >= 0) {
      this.data.riskAssessments[idx] = assessment;
    } else {
      this.data.riskAssessments.push(assessment);
    }
    this.saveDatabase();
    return assessment;
  }

  public getSimulationResults(): SimulationResults[] {
    return this.data.simulationResults;
  }

  public addSimulationResult(result: SimulationResults): SimulationResults {
    this.data.simulationResults.unshift(result);
    this.saveDatabase();
    return result;
  }

  public getNotifications(userId?: string, role?: string): NotificationItem[] {
    return this.data.notifications.filter(n => {
      if (userId && n.userId === userId) return true;
      if (role && n.targetRole === role) return true;
      if (!n.userId && !n.targetRole) return true;
      return false;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public addNotification(notification: NotificationItem): NotificationItem {
    this.data.notifications.unshift(notification);
    this.saveDatabase();
    return notification;
  }

  public markNotificationAsRead(id: string): boolean {
    const notif = this.data.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.saveDatabase();
      return true;
    }
    return false;
  }

  public markAllNotificationsAsRead(userId?: string, role?: string): void {
    this.data.notifications.forEach(n => {
      if (!userId && !role) {
        n.read = true;
      } else if (userId && n.userId === userId) {
        n.read = true;
      } else if (role && n.targetRole === (role as any)) {
        n.read = true;
      }
    });
    this.saveDatabase();
  }

  public getAuditLogs(applicationId?: string): AuditLog[] {
    if (applicationId) {
      return this.data.auditLogs
        .filter(l => l.applicationId === applicationId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
    return this.data.auditLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public addAuditLog(log: AuditLog): AuditLog {
    this.data.auditLogs.unshift(log);
    this.saveDatabase();
    return log;
  }

  public getSystemSettings(): SystemSettings {
    return this.data.systemSettings;
  }

  public updateSystemSettings(updates: Partial<SystemSettings>): SystemSettings {
    this.data.systemSettings = { ...this.data.systemSettings, ...updates };
    this.saveDatabase();
    return this.data.systemSettings;
  }
}

export const dbManager = new DatabaseManager();
