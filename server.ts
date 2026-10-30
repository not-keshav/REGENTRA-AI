/**
 * REGENTRA AI - Full-Stack Express Server & REST API
 * Integrated AICTE Approval Workflow Automation, Compliance Monitoring and Alert Management System
 * Problem Statement: SIH 26262 | Team: 555_DIAMOND | Smart India Hackathon 2026
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

import { dbManager } from './src/server/db.ts';
import {
  analyzeDocumentWithGemini,
  evaluateExplainableRisk,
  runComplianceAudit
} from './src/server/aiService.ts';
import { runDigitalTwinSimulation } from './src/server/simulationService.ts';
import {
  Application,
  DocumentRecord,
  User,
  WorkflowHistoryItem,
  AuditLog,
  NotificationItem
} from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Body parser with 50mb limit for base64 documents and scanned certificates
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ---------------- REST API ROUTES ----------------

// 1. AUTHENTICATION & DEMO PERSONAS
app.get('/api/auth/users', (req, res) => {
  const users = dbManager.getUsers();
  res.json({ success: true, users });
});

app.post('/api/auth/login', (req, res) => {
  const { email, role } = req.body;
  const users = dbManager.getUsers();
  let user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  
  if (!user && role) {
    user = users.find(u => u.role === role);
  }

  if (!user) {
    user = users[0]; // fallback to super admin
  }

  dbManager.addAuditLog({
    id: `audit-${Date.now()}`,
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    action: 'USER_LOGIN',
    remarks: `User logged in from web portal session`,
    timestamp: new Date().toISOString()
  });

  res.json({ success: true, user, token: `regentra-jwt-${user.id}` });
});

// 2. INSTITUTION MANAGEMENT
app.get('/api/institutions', (req, res) => {
  const institutions = dbManager.getInstitutions();
  res.json({ success: true, institutions });
});

app.get('/api/institutions/:id', (req, res) => {
  const inst = dbManager.getInstitutionById(req.params.id);
  if (!inst) {
    return res.status(404).json({ success: false, message: 'Institution not found' });
  }
  res.json({ success: true, institution: inst });
});

app.post('/api/institutions', (req, res) => {
  const body = req.body;
  const newInst = {
    ...body,
    id: `inst-${Date.now()}`,
    institutionId: body.institutionId || `AICTE-1-${Math.floor(100000000 + Math.random() * 900000000)}`,
    complianceScore: 100,
    status: 'Active',
    createdAt: new Date().toISOString(),
  };
  const created = dbManager.addInstitution(newInst);

  dbManager.addAuditLog({
    id: `audit-${Date.now()}`,
    userId: req.body.actorId || 'usr-inst-admin',
    userName: req.body.actorName || 'Institution Admin',
    userRole: 'INSTITUTION_ADMIN',
    action: 'INSTITUTION_REGISTERED',
    newValue: created.name,
    remarks: `New technical institution registered: ${created.name}`,
    timestamp: new Date().toISOString()
  });

  res.json({ success: true, institution: created });
});

// 3. APPLICATIONS
app.get('/api/applications', (req, res) => {
  let apps = dbManager.getApplications();
  const { status, category, risk, institutionId, search } = req.query;

  if (status && typeof status === 'string' && status !== 'ALL') {
    apps = apps.filter(a => a.status === status);
  }
  if (category && typeof category === 'string' && category !== 'ALL') {
    apps = apps.filter(a => a.category === category);
  }
  if (risk && typeof risk === 'string' && risk !== 'ALL') {
    apps = apps.filter(a => a.riskCategory === risk);
  }
  if (institutionId && typeof institutionId === 'string') {
    apps = apps.filter(a => a.institutionId === institutionId);
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    apps = apps.filter(a =>
      a.applicationId.toLowerCase().includes(q) ||
      a.institutionName.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, applications: apps });
});

app.get('/api/applications/:id', (req, res) => {
  const appItem = dbManager.getApplicationById(req.params.id);
  if (!appItem) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }

  const docs = dbManager.getDocuments(appItem.id);
  const history = dbManager.getWorkflowHistory(appItem.id);
  const risk = dbManager.getRiskAssessment(appItem.id);
  const compliance = dbManager.getComplianceResult(appItem.id);
  const institution = dbManager.getInstitutionById(appItem.institutionId);

  res.json({
    success: true,
    application: appItem,
    documents: docs,
    workflowHistory: history,
    riskAssessment: risk,
    complianceResult: compliance,
    institution
  });
});

app.post('/api/applications', async (req, res) => {
  const body = req.body;
  const count = dbManager.getApplications().length + 1;
  const formattedId = `REG-2026-${String(count).padStart(5, '0')}`;

  const officers = dbManager.getOfficerAssignments();
  // Assign to least loaded scrutiny officer
  const assignedOfficer = officers.reduce((prev, curr) =>
    curr.pendingCount < prev.pendingCount ? curr : prev
  , officers[0]);

  const newApp: Application = {
    id: `app-${Date.now()}`,
    applicationId: formattedId,
    institutionId: body.institutionId || 'inst-001',
    institutionName: body.institutionName || 'Aryabhatta Institute of Technology',
    category: body.category || 'Extension of Approval (EoA)',
    academicYear: body.academicYear || '2026-2027',
    courses: body.courses || [],
    intakeCapacity: body.intakeCapacity || 120,
    existingApprovalNumber: body.existingApprovalNumber,
    description: body.description || 'Application submitted via REGENTRA AI portal',
    status: 'Submitted',
    currentStageId: 'SUBMITTED',
    currentStageName: 'Application Submitted',
    assignedOfficerId: assignedOfficer.officerId,
    assignedOfficerName: assignedOfficer.officerName,
    assignedOfficerEmail: assignedOfficer.email,
    riskScore: 20,
    riskCategory: 'Low',
    submittedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deadlineDate: body.deadlineDate || '2026-04-15',
    pendingDays: 0,
    correctionCycles: 0,
    declarationAccepted: true,
  };

  const created = dbManager.addApplication(newApp);

  // If initial documents were attached in submission
  if (Array.isArray(body.documents)) {
    for (const d of body.documents) {
      dbManager.addDocument({
        id: `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        applicationId: created.id,
        category: d.category || 'Other Supporting Documents',
        name: d.name || d.fileName,
        fileName: d.fileName || 'uploaded_document.pdf',
        fileSize: d.fileSize || 1024000,
        fileType: d.fileType || 'application/pdf',
        fileDataUrl: d.fileDataUrl,
        uploadDate: new Date().toISOString(),
        status: 'Needs Manual Review',
        ocrExtractedText: `Document received for ${d.category}. Awaiting automated OCR extraction.`,
        aiSummary: `Uploaded certificate under category ${d.category}.`,
        missingFields: [],
        mismatchWarnings: [],
        confidenceScore: 90,
        officerVerified: false,
      });
    }
  }

  // Update officer workload
  dbManager.updateOfficerAssignment(assignedOfficer.officerId, {
    pendingCount: assignedOfficer.pendingCount + 1,
    assignedCount: assignedOfficer.assignedCount + 1,
  });

  // Record workflow history
  dbManager.addWorkflowHistoryItem({
    id: `wf-${Date.now()}`,
    applicationId: created.id,
    fromStage: 'Draft',
    toStage: 'Application Submitted',
    actorId: body.actorId || 'usr-inst-1',
    actorName: body.actorName || created.institutionName,
    actorRole: 'INSTITUTION_ADMIN',
    action: 'Application Submitted',
    timestamp: new Date().toISOString(),
    remarks: 'Application submitted with statutory undertaking and attached institutional records.',
  });

  // Create Audit Log
  dbManager.addAuditLog({
    id: `audit-${Date.now()}`,
    userId: body.actorId || 'usr-inst-1',
    userName: body.actorName || created.institutionName,
    userRole: 'INSTITUTION_ADMIN',
    action: 'APPLICATION_SUBMITTED',
    applicationId: created.id,
    newValue: created.applicationId,
    remarks: `Application ${created.applicationId} submitted by ${created.institutionName}`,
    timestamp: new Date().toISOString(),
  });

  // Create Notification for assigned scrutiny officer
  dbManager.addNotification({
    id: `notif-${Date.now()}`,
    userId: assignedOfficer.officerId,
    targetRole: 'SCRUTINY_OFFICER',
    title: `New Application Assigned: ${created.applicationId}`,
    message: `${created.institutionName} has submitted application ${created.applicationId} (${created.category}). Pre-scrutiny initiated.`,
    type: 'OFFICER_ASSIGNED',
    priority: 'Medium',
    applicationId: created.id,
    institutionName: created.institutionName,
    read: false,
    createdAt: new Date().toISOString(),
  });

  res.json({ success: true, application: created });
});

// 4. WORKFLOW ACTIONS: Forward, Deficiency, Resubmit, Decision
app.post('/api/applications/:id/forward', async (req, res) => {
  const { id } = req.params;
  const { nextStageId, nextStageName, remarks, actorId, actorName, actorRole } = req.body;

  const appItem = dbManager.getApplicationById(id);
  if (!appItem) return res.status(404).json({ success: false, message: 'Application not found' });

  const prevStage = appItem.currentStageName;
  const updatedStatus = nextStageId === 'FINAL_DECISION' ? 'Senior Review' : (nextStageId === 'SCRUTINY' ? 'Under Scrutiny' : (nextStageId === 'EVC' ? 'Pending EVC' : 'Under Review'));

  const updated = dbManager.updateApplication(id, {
    currentStageId: nextStageId,
    currentStageName: nextStageName,
    status: updatedStatus as any,
  });

  dbManager.addWorkflowHistoryItem({
    id: `wf-${Date.now()}`,
    applicationId: id,
    fromStage: prevStage,
    toStage: nextStageName,
    actorId: actorId || 'usr-officer',
    actorName: actorName || 'Scrutiny Officer',
    actorRole: actorRole || 'SCRUTINY_OFFICER',
    action: `Forwarded to ${nextStageName}`,
    timestamp: new Date().toISOString(),
    remarks: remarks || 'Stage verification cleared and forwarded for next review level.',
  });

  dbManager.addAuditLog({
    id: `audit-${Date.now()}`,
    userId: actorId || 'usr-officer',
    userName: actorName || 'Scrutiny Officer',
    userRole: actorRole || 'SCRUTINY_OFFICER',
    action: 'STAGE_FORWARDED',
    applicationId: id,
    previousValue: prevStage,
    newValue: nextStageName,
    remarks: remarks || `Application advanced to ${nextStageName}`,
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, application: updated });
});

app.post('/api/applications/:id/raise-deficiency', (req, res) => {
  const { id } = req.params;
  const { deficiencyNotes, remarks, actorId, actorName, actorRole } = req.body;

  const appItem = dbManager.getApplicationById(id);
  if (!appItem) return res.status(404).json({ success: false, message: 'Application not found' });

  const updated = dbManager.updateApplication(id, {
    status: 'Deficiency Identified',
    currentStageId: 'DEFICIENCY',
    currentStageName: 'Deficiency Identification & Resubmission',
    deficiencyNotes: deficiencyNotes || ['Deficiency queries raised by Scrutiny Committee.'],
    correctionCycles: (appItem.correctionCycles || 0) + 1,
    riskScore: Math.min(100, (appItem.riskScore || 20) + 20),
    riskCategory: 'High'
  });

  dbManager.addWorkflowHistoryItem({
    id: `wf-${Date.now()}`,
    applicationId: id,
    fromStage: appItem.currentStageName,
    toStage: 'Deficiency Identification & Resubmission',
    actorId: actorId || 'usr-officer',
    actorName: actorName || 'Scrutiny Officer',
    actorRole: actorRole || 'SCRUTINY_OFFICER',
    action: 'Deficiency Notice Issued',
    timestamp: new Date().toISOString(),
    remarks: remarks || 'Official deficiency queries communicated to institution administrator.',
  });

  dbManager.addNotification({
    id: `notif-${Date.now()}`,
    targetRole: 'INSTITUTION_ADMIN',
    title: `Deficiency Queries Raised: ${appItem.applicationId}`,
    message: `Scrutiny Officer has issued clarification requests for ${appItem.institutionName}. Please upload revised documents.`,
    type: 'CORRECTION_REQUIRED',
    priority: 'High',
    applicationId: id,
    institutionName: appItem.institutionName,
    read: false,
    createdAt: new Date().toISOString(),
  });

  res.json({ success: true, application: updated });
});

app.post('/api/applications/:id/resubmit', (req, res) => {
  const { id } = req.params;
  const { resubmissionRemarks, actorId, actorName, actorRole } = req.body;

  const appItem = dbManager.getApplicationById(id);
  if (!appItem) return res.status(404).json({ success: false, message: 'Application not found' });

  const updated = dbManager.updateApplication(id, {
    status: 'Resubmitted',
    currentStageId: 'SCRUTINY',
    currentStageName: 'Application Scrutiny Committee',
    deficiencyNotes: [],
  });

  dbManager.addWorkflowHistoryItem({
    id: `wf-${Date.now()}`,
    applicationId: id,
    fromStage: 'Deficiency Identification & Resubmission',
    toStage: 'Application Scrutiny Committee',
    actorId: actorId || 'usr-inst-admin',
    actorName: actorName || appItem.institutionName,
    actorRole: actorRole || 'INSTITUTION_ADMIN',
    action: 'Application Resubmitted with Corrections',
    timestamp: new Date().toISOString(),
    remarks: resubmissionRemarks || 'Deficiency clarification and revised certificates uploaded.',
  });

  dbManager.addNotification({
    id: `notif-${Date.now()}`,
    userId: appItem.assignedOfficerId,
    targetRole: 'SCRUTINY_OFFICER',
    title: `Corrections Resubmitted: ${appItem.applicationId}`,
    message: `${appItem.institutionName} has addressed deficiency queries and resubmitted application for verification.`,
    type: 'STAGE_FORWARDED',
    priority: 'Medium',
    applicationId: id,
    institutionName: appItem.institutionName,
    read: false,
    createdAt: new Date().toISOString(),
  });

  res.json({ success: true, application: updated });
});

app.post('/api/applications/:id/decision', (req, res) => {
  const { id } = req.params;
  const { decision, remarks, actorId, actorName, actorRole } = req.body; // decision: 'Approved' | 'Rejected' | 'Returned'

  const appItem = dbManager.getApplicationById(id);
  if (!appItem) return res.status(404).json({ success: false, message: 'Application not found' });

  if (actorRole !== 'SENIOR_OFFICER' && actorRole !== 'SUPER_ADMIN') {
    return res.status(403).json({ success: false, message: 'Only authorized Senior Officers or Super Admins can issue final statutory decisions.' });
  }

  const updated = dbManager.updateApplication(id, {
    status: decision,
    currentStageId: 'FINAL_DECISION',
    currentStageName: 'Final Statutory Decision',
    finalRemarks: remarks,
    riskScore: decision === 'Approved' ? 5 : 90,
    riskCategory: decision === 'Approved' ? 'Low' : 'Critical',
    pendingDays: 0,
  });

  // Free officer pending count
  if (appItem.assignedOfficerId) {
    const officer = dbManager.getOfficerAssignments().find(o => o.officerId === appItem.assignedOfficerId);
    if (officer) {
      dbManager.updateOfficerAssignment(appItem.assignedOfficerId, {
        pendingCount: Math.max(0, officer.pendingCount - 1),
        completedCount: officer.completedCount + 1,
      });
    }
  }

  dbManager.addWorkflowHistoryItem({
    id: `wf-${Date.now()}`,
    applicationId: id,
    fromStage: appItem.currentStageName,
    toStage: 'Final Statutory Decision',
    actorId: actorId || 'usr-senior-1',
    actorName: actorName || 'Senior Officer',
    actorRole: actorRole || 'SENIOR_OFFICER',
    action: `Application ${decision}`,
    timestamp: new Date().toISOString(),
    remarks: remarks || `Statutory order issued: ${decision}`,
  });

  dbManager.addAuditLog({
    id: `audit-${Date.now()}`,
    userId: actorId || 'usr-senior-1',
    userName: actorName || 'Senior Officer',
    userRole: actorRole || 'SENIOR_OFFICER',
    action: decision === 'Approved' ? 'APPLICATION_APPROVED' : (decision === 'Rejected' ? 'APPLICATION_REJECTED' : 'APPLICATION_RETURNED'),
    applicationId: id,
    previousValue: appItem.status,
    newValue: decision,
    remarks: remarks || `Final Statutory Order: ${decision}`,
    timestamp: new Date().toISOString(),
  });

  dbManager.addNotification({
    id: `notif-${Date.now()}`,
    targetRole: 'INSTITUTION_ADMIN',
    title: `Statutory Order Issued: ${appItem.applicationId} (${decision})`,
    message: `Final order issued for ${appItem.institutionName}. Status: ${decision}. Remarks: ${remarks || 'Review order details in portal.'}`,
    type: decision === 'Approved' ? 'APPLICATION_APPROVED' : 'APPLICATION_REJECTED',
    priority: decision === 'Approved' ? 'Medium' : 'Critical',
    applicationId: id,
    institutionName: appItem.institutionName,
    read: false,
    createdAt: new Date().toISOString(),
  });

  res.json({ success: true, application: updated });
});

// 5. DOCUMENT INTELLIGENCE & OCR
app.get('/api/documents', (req, res) => {
  const { applicationId } = req.query;
  const docs = dbManager.getDocuments(typeof applicationId === 'string' ? applicationId : undefined);
  res.json({ success: true, documents: docs });
});

app.post('/api/documents/upload-and-analyze', async (req, res) => {
  const { applicationId, category, name, fileName, fileSize, fileType, fileDataUrl, rawText } = req.body;

  const appItem = applicationId ? dbManager.getApplicationById(applicationId) : undefined;

  // Run Gemini OCR / Document Intelligence
  const aiResult = await analyzeDocumentWithGemini({
    fileName: fileName || name || 'document.pdf',
    category: category || 'Other Supporting Documents',
    fileDataUrl,
    rawText,
    applicationData: appItem,
  });

  const newDoc: DocumentRecord = {
    id: `doc-${Date.now()}`,
    applicationId: applicationId || 'app-temp',
    category: category || 'Other Supporting Documents',
    name: name || fileName || 'Uploaded Document',
    fileName: fileName || 'document.pdf',
    fileSize: fileSize || 1048576,
    fileType: fileType || 'application/pdf',
    fileDataUrl: fileDataUrl,
    uploadDate: new Date().toISOString(),
    status: aiResult.status,
    ocrExtractedText: aiResult.ocrExtractedText,
    aiSummary: aiResult.aiSummary,
    missingFields: aiResult.missingFields,
    mismatchWarnings: aiResult.mismatchWarnings,
    confidenceScore: aiResult.confidenceScore,
    officerVerified: false,
    extractedMetadata: aiResult.extractedMetadata as any,
  };

  const created = dbManager.addDocument(newDoc);

  dbManager.addAuditLog({
    id: `audit-${Date.now()}`,
    userId: req.body.actorId || 'usr-inst-1',
    userName: req.body.actorName || 'Institution User',
    userRole: (req.body.actorRole as any) || 'INSTITUTION_ADMIN',
    action: 'DOCUMENT_UPLOADED',
    applicationId: applicationId,
    newValue: created.name,
    remarks: `Uploaded ${created.category} (${created.fileName}). AI OCR status: ${created.status} (confidence ${created.confidenceScore}%).`,
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, document: created });
});

// Scrutiny Officer manual override with mandatory reason
app.post('/api/documents/:id/verify-override', (req, res) => {
  const { id } = req.params;
  const { status, remarks, overrideReason, actorId, actorName, actorRole } = req.body;

  const doc = dbManager.getDocumentById(id);
  if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });

  const prevStatus = doc.status;
  const updated = dbManager.updateDocument(id, {
    status: status || 'Valid',
    officerVerified: true,
    officerVerificationDate: new Date().toISOString(),
    officerRemarks: remarks,
    officerOverrideReason: overrideReason,
  });

  dbManager.addAuditLog({
    id: `audit-${Date.now()}`,
    userId: actorId || 'usr-officer',
    userName: actorName || 'Scrutiny Officer',
    userRole: actorRole || 'SCRUTINY_OFFICER',
    action: 'DOCUMENT_VERIFIED',
    applicationId: doc.applicationId,
    previousValue: prevStatus,
    newValue: status,
    remarks: `Officer override applied. Reason: ${overrideReason || remarks || 'Manual verification confirmed'}.`,
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, document: updated });
});

// 6. COMPLIANCE ENGINE & AUDITS
app.get('/api/compliance/rules', (req, res) => {
  const rules = dbManager.getComplianceRules();
  res.json({ success: true, rules });
});

app.post('/api/compliance/rules', (req, res) => {
  const body = req.body;
  const newRule = {
    ...body,
    id: `rule-${Date.now()}`,
    ruleId: body.ruleId || `CR-${Math.floor(100 + Math.random() * 900)}`,
    active: true,
    version: body.version || '2026.1',
    effectiveDate: body.effectiveDate || new Date().toISOString().split('T')[0],
  };
  const created = dbManager.addComplianceRule(newRule);

  dbManager.addAuditLog({
    id: `audit-${Date.now()}`,
    userId: body.actorId || 'usr-compliance-1',
    userName: body.actorName || 'Compliance Admin',
    userRole: 'COMPLIANCE_ADMIN',
    action: 'RULE_CREATED',
    newValue: created.ruleId,
    remarks: `New compliance rule configured: ${created.name} (${created.severity})`,
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, rule: created });
});

app.patch('/api/compliance/rules/:id', (req, res) => {
  const { id } = req.params;
  const rule = dbManager.getComplianceRuleById(id);
  if (!rule) return res.status(404).json({ success: false, message: 'Rule not found' });

  const updated = dbManager.updateComplianceRule(id, req.body);

  dbManager.addAuditLog({
    id: `audit-${Date.now()}`,
    userId: req.body.actorId || 'usr-compliance-1',
    userName: req.body.actorName || 'Compliance Admin',
    userRole: 'COMPLIANCE_ADMIN',
    action: 'RULE_UPDATED',
    previousValue: `Active: ${rule.active}, Version: ${rule.version}`,
    newValue: `Active: ${updated?.active}, Version: ${updated?.version}`,
    remarks: `Compliance rule ${rule.ruleId} updated.`,
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, rule: updated });
});

app.post('/api/compliance/audit/:applicationId', (req, res) => {
  const { applicationId } = req.params;
  const appItem = dbManager.getApplicationById(applicationId);
  if (!appItem) return res.status(404).json({ success: false, message: 'Application not found' });

  const rules = dbManager.getComplianceRules();
  const docs = dbManager.getDocuments(applicationId);

  const result = runComplianceAudit(appItem, rules, docs);
  dbManager.setComplianceResult(applicationId, result);

  res.json({ success: true, complianceResult: result });
});

// 7. EXPLAINABLE RISK ENGINE
app.get('/api/risk/evaluate/:applicationId', async (req, res) => {
  const { applicationId } = req.params;
  const appItem = dbManager.getApplicationById(applicationId);
  if (!appItem) return res.status(404).json({ success: false, message: 'Application not found' });

  const docs = dbManager.getDocuments(applicationId);
  const compliance = dbManager.getComplianceResult(applicationId) || runComplianceAudit(appItem, dbManager.getComplianceRules(), docs);

  const officer = dbManager.getOfficerAssignments().find(o => o.officerId === appItem.assignedOfficerId);
  const officerPending = officer ? officer.pendingCount : 3;
  const missingCount = compliance.missingMandatoryDocs.length;
  const violationCount = compliance.violations.length;

  const assessment = await evaluateExplainableRisk({
    application: appItem,
    missingDocsCount: missingCount,
    officerPendingCount: officerPending,
    complianceViolationsCount: violationCount,
  });

  dbManager.setRiskAssessment(assessment);
  dbManager.updateApplication(applicationId, {
    riskScore: assessment.score,
    riskCategory: assessment.category,
  });

  res.json({ success: true, riskAssessment: assessment });
});

// 8. DIGITAL TWIN SIMULATION
app.post('/api/simulation/run', (req, res) => {
  const { parameters, scenarioName } = req.body;

  const defaultParams = {
    pendingApplicationsCount: 30,
    scrutinyOfficersCount: 5,
    avgDocumentVerificationHours: 6,
    dailyApplicationInflow: 4,
    avgCorrectionCycles: 1.2,
    availableWorkingDays: 20,
    priorityProcessingEnabled: true,
  };

  const finalParams = { ...defaultParams, ...parameters };
  const simResults = runDigitalTwinSimulation(finalParams, scenarioName || 'Executive Optimization Run');

  dbManager.addSimulationResult(simResults);

  dbManager.addAuditLog({
    id: `audit-${Date.now()}`,
    userId: req.body.actorId || 'usr-senior-1',
    userName: req.body.actorName || 'Senior Officer',
    userRole: 'SENIOR_OFFICER',
    action: 'SIMULATION_EXECUTED',
    newValue: simResults.id,
    remarks: `Ran Digital Twin simulation. Est. backlog: ${simResults.expectedBacklogAtEnd}, Avg wait: ${simResults.avgWaitTimePerApplicationDays} days.`,
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, simulationResults: simResults });
});

app.get('/api/simulation/history', (req, res) => {
  const history = dbManager.getSimulationResults();
  res.json({ success: true, history });
});

// 9. OFFICER WORKLOAD & ASSIGNMENT
app.get('/api/officers', (req, res) => {
  const officers = dbManager.getOfficerAssignments();
  res.json({ success: true, officers });
});

app.post('/api/officers/reassign', (req, res) => {
  const { applicationId, newOfficerId, reason, actorId, actorName, actorRole } = req.body;
  const appItem = dbManager.getApplicationById(applicationId);
  if (!appItem) return res.status(404).json({ success: false, message: 'Application not found' });

  const newOfficer = dbManager.getOfficerAssignments().find(o => o.officerId === newOfficerId || o.id === newOfficerId);
  if (!newOfficer) return res.status(404).json({ success: false, message: 'New officer not found' });

  const prevOfficerName = appItem.assignedOfficerName;
  const updated = dbManager.updateApplication(applicationId, {
    assignedOfficerId: newOfficer.officerId,
    assignedOfficerName: newOfficer.officerName,
    assignedOfficerEmail: newOfficer.email,
  });

  dbManager.updateOfficerAssignment(newOfficer.officerId, {
    pendingCount: newOfficer.pendingCount + 1,
    assignedCount: newOfficer.assignedCount + 1,
  });

  dbManager.addAuditLog({
    id: `audit-${Date.now()}`,
    userId: actorId || 'usr-super-admin',
    userName: actorName || 'Super Admin',
    userRole: actorRole || 'SUPER_ADMIN',
    action: 'OFFICER_REASSIGNED',
    applicationId,
    previousValue: prevOfficerName,
    newValue: newOfficer.officerName,
    remarks: `Reassigned from ${prevOfficerName} to ${newOfficer.officerName}. Reason: ${reason || 'Workload rebalancing'}`,
    timestamp: new Date().toISOString(),
  });

  dbManager.addNotification({
    id: `notif-${Date.now()}`,
    userId: newOfficer.officerId,
    targetRole: 'SCRUTINY_OFFICER',
    title: `Case Reassigned: ${appItem.applicationId}`,
    message: `${appItem.applicationId} has been reassigned to you for priority scrutiny review.`,
    type: 'OFFICER_ASSIGNED',
    priority: 'High',
    applicationId,
    institutionName: appItem.institutionName,
    read: false,
    createdAt: new Date().toISOString(),
  });

  res.json({ success: true, application: updated });
});

// 10. NOTIFICATIONS
app.get('/api/notifications', (req, res) => {
  const { userId, role } = req.query;
  const notifs = dbManager.getNotifications(
    typeof userId === 'string' ? userId : undefined,
    typeof role === 'string' ? role : undefined
  );
  res.json({ success: true, notifications: notifs });
});

app.patch('/api/notifications/:id/read', (req, res) => {
  const { id } = req.params;
  const success = dbManager.markNotificationAsRead(id);
  res.json({ success });
});

app.post('/api/notifications/mark-all-read', (req, res) => {
  const { userId, role } = req.body;
  dbManager.markAllNotificationsAsRead(userId, role);
  res.json({ success: true });
});

// 11. AUDIT LOGS
app.get('/api/audit-logs', (req, res) => {
  const { applicationId } = req.query;
  const logs = dbManager.getAuditLogs(typeof applicationId === 'string' ? applicationId : undefined);
  res.json({ success: true, auditLogs: logs });
});

// 12. SYSTEM SETTINGS & RESET DEMO DATA
app.get('/api/system/settings', (req, res) => {
  const settings = dbManager.getSystemSettings();
  res.json({ success: true, settings });
});

app.patch('/api/system/settings', (req, res) => {
  const updated = dbManager.updateSystemSettings(req.body);
  res.json({ success: true, settings: updated });
});

app.post('/api/admin/reset-demo-data', (req, res) => {
  dbManager.resetToDefault();
  res.json({ success: true, message: 'Demonstration environment successfully reset to baseline seed records.' });
});

// ---------------- VITE & STATIC SPA MOUNT ----------------
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    // In dev mode, mount Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`REGENTRA AI server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
