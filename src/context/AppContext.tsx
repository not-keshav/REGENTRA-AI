/**
 * REGENTRA AI - Core Application State & Data Synchronization Context
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Application,
  Institution,
  DocumentRecord,
  ComplianceRule,
  NotificationItem,
  OfficerAssignment,
  AuditLog,
  SystemSettings,
  WorkflowStage
} from '../types/index.ts';
import { useAuth } from './AuthContext.tsx';

interface AppContextType {
  applications: Application[];
  institutions: Institution[];
  documents: DocumentRecord[];
  complianceRules: ComplianceRule[];
  notifications: NotificationItem[];
  officers: OfficerAssignment[];
  auditLogs: AuditLog[];
  workflowStages: WorkflowStage[];
  systemSettings: SystemSettings | null;
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  refreshData: () => Promise<void>;
  resetDemoData: () => Promise<void>;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  // Mutations
  submitApplication: (data: any) => Promise<Application | null>;
  forwardApplication: (id: string, nextStageId: string, nextStageName: string, remarks?: string) => Promise<boolean>;
  raiseDeficiency: (id: string, notes: string[], remarks?: string) => Promise<boolean>;
  resubmitApplication: (id: string, remarks: string) => Promise<boolean>;
  makeDecision: (id: string, decision: 'Approved' | 'Rejected' | 'Returned', remarks: string) => Promise<boolean>;
  uploadAndAnalyzeDocument: (data: any) => Promise<DocumentRecord | null>;
  verifyDocumentOverride: (docId: string, status: string, reason: string, remarks?: string) => Promise<boolean>;
  reassignOfficer: (applicationId: string, newOfficerId: string, reason: string) => Promise<boolean>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [complianceRules, setComplianceRules] = useState<ComplianceRule[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [officers, setOfficers] = useState<OfficerAssignment[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [workflowStages, setWorkflowStages] = useState<WorkflowStage[]>([]);
  const [systemSettings, setSystemSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 4500);
  };

  const refreshData = useCallback(async () => {
    try {
      const [
        appsRes,
        instRes,
        docsRes,
        rulesRes,
        notifRes,
        offRes,
        auditRes,
        settingsRes
      ] = await Promise.all([
        fetch('/api/applications'),
        fetch('/api/institutions'),
        fetch('/api/documents'),
        fetch('/api/compliance/rules'),
        fetch(`/api/notifications${currentUser ? `?userId=${currentUser.id}&role=${currentUser.role}` : ''}`),
        fetch('/api/officers'),
        fetch('/api/audit-logs'),
        fetch('/api/system/settings')
      ]);

      const [
        appsData,
        instData,
        docsData,
        rulesData,
        notifData,
        offData,
        auditData,
        settingsData
      ] = await Promise.all([
        appsRes.json(),
        instRes.json(),
        docsRes.json(),
        rulesRes.json(),
        notifRes.json(),
        offRes.json(),
        auditRes.json(),
        settingsRes.json()
      ]);

      if (appsData.success) setApplications(appsData.applications);
      if (instData.success) setInstitutions(instData.institutions);
      if (docsData.success) setDocuments(docsData.documents);
      if (rulesData.success) setComplianceRules(rulesData.rules);
      if (notifData.success) setNotifications(notifData.notifications);
      if (offData.success) setOfficers(offData.officers);
      if (auditData.success) setAuditLogs(auditData.auditLogs);
      if (settingsData.success) setSystemSettings(settingsData.settings);
    } catch (err) {
      console.error('Error fetching data from API:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const resetDemoData = async () => {
    try {
      const res = await fetch('/api/admin/reset-demo-data', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast('Baseline demonstration dataset successfully reloaded.');
        await refreshData();
      }
    } catch (err) {
      console.error('Reset error:', err);
    }
  };

  const submitApplication = async (payload: any): Promise<Application | null> => {
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          actorId: currentUser?.id,
          actorName: currentUser?.name,
          actorRole: currentUser?.role,
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Application ${data.application.applicationId} successfully submitted!`);
        await refreshData();
        return data.application;
      }
    } catch (err) {
      console.error('Submit application error:', err);
    }
    return null;
  };

  const forwardApplication = async (
    id: string,
    nextStageId: string,
    nextStageName: string,
    remarks?: string
  ): Promise<boolean> => {
    try {
      const res = await fetch(`/api/applications/${id}/forward`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nextStageId,
          nextStageName,
          remarks,
          actorId: currentUser?.id,
          actorName: currentUser?.name,
          actorRole: currentUser?.role,
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Application forwarded to ${nextStageName}`);
        await refreshData();
        return true;
      }
    } catch (err) {
      console.error('Forward application error:', err);
    }
    return false;
  };

  const raiseDeficiency = async (
    id: string,
    notes: string[],
    remarks?: string
  ): Promise<boolean> => {
    try {
      const res = await fetch(`/api/applications/${id}/raise-deficiency`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deficiencyNotes: notes,
          remarks,
          actorId: currentUser?.id,
          actorName: currentUser?.name,
          actorRole: currentUser?.role,
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Deficiency notice officially raised and sent to institution.');
        await refreshData();
        return true;
      }
    } catch (err) {
      console.error('Raise deficiency error:', err);
    }
    return false;
  };

  const resubmitApplication = async (id: string, remarks: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/applications/${id}/resubmit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resubmissionRemarks: remarks,
          actorId: currentUser?.id,
          actorName: currentUser?.name,
          actorRole: currentUser?.role,
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Application resubmitted for committee scrutiny verification.');
        await refreshData();
        return true;
      }
    } catch (err) {
      console.error('Resubmit error:', err);
    }
    return false;
  };

  const makeDecision = async (
    id: string,
    decision: 'Approved' | 'Rejected' | 'Returned',
    remarks: string
  ): Promise<boolean> => {
    try {
      const res = await fetch(`/api/applications/${id}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision,
          remarks,
          actorId: currentUser?.id,
          actorName: currentUser?.name,
          actorRole: currentUser?.role,
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Statutory order issued: Application ${decision}!`);
        await refreshData();
        return true;
      } else {
        showToast(data.message || 'Operation failed');
      }
    } catch (err) {
      console.error('Decision error:', err);
    }
    return false;
  };

  const uploadAndAnalyzeDocument = async (payload: any): Promise<DocumentRecord | null> => {
    try {
      const res = await fetch('/api/documents/upload-and-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          actorId: currentUser?.id,
          actorName: currentUser?.name,
          actorRole: currentUser?.role,
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Document parsed by AI OCR: ${data.document.status} (${data.document.confidenceScore}% confidence)`);
        await refreshData();
        return data.document;
      }
    } catch (err) {
      console.error('Upload document error:', err);
    }
    return null;
  };

  const verifyDocumentOverride = async (
    docId: string,
    status: string,
    reason: string,
    remarks?: string
  ): Promise<boolean> => {
    try {
      const res = await fetch(`/api/documents/${docId}/verify-override`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          overrideReason: reason,
          remarks,
          actorId: currentUser?.id,
          actorName: currentUser?.name,
          actorRole: currentUser?.role,
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Officer verification recorded: Marked as ${status}`);
        await refreshData();
        return true;
      }
    } catch (err) {
      console.error('Verify override error:', err);
    }
    return false;
  };

  const reassignOfficer = async (
    applicationId: string,
    newOfficerId: string,
    reason: string
  ): Promise<boolean> => {
    try {
      const res = await fetch('/api/officers/reassign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId,
          newOfficerId,
          reason,
          actorId: currentUser?.id,
          actorName: currentUser?.name,
          actorRole: currentUser?.role,
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Application successfully reassigned to new Scrutiny Officer.');
        await refreshData();
        return true;
      }
    } catch (err) {
      console.error('Reassign error:', err);
    }
    return false;
  };

  const markNotificationRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
      setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error('Mark read error:', err);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser?.id, role: currentUser?.role })
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      showToast('All notifications marked as read.');
    } catch (err) {
      console.error('Mark all read error:', err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        applications,
        institutions,
        documents,
        complianceRules,
        notifications,
        officers,
        auditLogs,
        workflowStages,
        systemSettings,
        loading,
        searchQuery,
        setSearchQuery,
        refreshData,
        resetDemoData,
        toastMessage,
        showToast,
        submitApplication,
        forwardApplication,
        raiseDeficiency,
        resubmitApplication,
        makeDecision,
        uploadAndAnalyzeDocument,
        verifyDocumentOverride,
        reassignOfficer,
        markNotificationRead,
        markAllNotificationsRead
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
