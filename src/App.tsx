/**
 * REGENTRA AI - Root Application Component
 * Integrated AICTE Approval Workflow Automation, Compliance Monitoring and Alert Management System
 * Problem Statement: SIH 26262 | Team: 555_DIAMOND | Smart India Hackathon 2026
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Header } from './components/layout/Header.tsx';
import { Sidebar } from './components/layout/Sidebar.tsx';

// Pages
import { LandingPage } from './pages/LandingPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { ApplicationsPage } from './pages/ApplicationsPage.tsx';
import { ApplicationDetailsPage } from './pages/ApplicationDetailsPage.tsx';
import { NewApplicationPage } from './pages/NewApplicationPage.tsx';
import { DocumentIntelligencePage } from './pages/DocumentIntelligencePage.tsx';
import { ComplianceMonitoringPage } from './pages/ComplianceMonitoringPage.tsx';
import { WorkflowManagementPage } from './pages/WorkflowManagementPage.tsx';
import { RiskAssessmentPage } from './pages/RiskAssessmentPage.tsx';
import { DigitalTwinSimulationPage } from './pages/DigitalTwinSimulationPage.tsx';
import { AlertsPage } from './pages/AlertsPage.tsx';
import { InstitutionsPage } from './pages/InstitutionsPage.tsx';
import { OfficerManagementPage } from './pages/OfficerManagementPage.tsx';
import { AnalyticsReportsPage } from './pages/AnalyticsReportsPage.tsx';
import { AuditLogsPage } from './pages/AuditLogsPage.tsx';
import { UserManagementPage } from './pages/UserManagementPage.tsx';
import { SystemSettingsPage } from './pages/SystemSettingsPage.tsx';
import { ProfilePage } from './pages/ProfilePage.tsx';

function MainAppShell() {
  const { currentUser } = useAuth();
  const { toastMessage } = useApp();

  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

  // If user is on public landing page
  if (currentPage === 'landing') {
    return (
      <LandingPage
        onGetStarted={() => setCurrentPage('dashboard')}
        onLogin={() => setCurrentPage('login')}
      />
    );
  }

  // If user is on login page
  if (currentPage === 'login') {
    return (
      <LoginPage
        onSuccess={() => setCurrentPage('dashboard')}
        onBackToHome={() => setCurrentPage('landing')}
      />
    );
  }

  // Navigation router
  const handleNavigate = (page: string) => {
    setSelectedApplicationId(null);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectApplication = (id: string) => {
    setSelectedApplicationId(id);
    setCurrentPage('application-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#202B3C] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header */}
      <Header onNavigate={handleNavigate} />

      {/* Body with Sidebar & Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Role-Aware Left Sidebar */}
        <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />

        {/* Dynamic Main Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {currentPage === 'dashboard' && (
            <DashboardPage
              onSelectApplication={handleSelectApplication}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'applications' && (
            <ApplicationsPage
              onSelectApplication={handleSelectApplication}
              onNewApplication={() => handleNavigate('new-application')}
            />
          )}

          {currentPage === 'application-details' && selectedApplicationId && (
            <ApplicationDetailsPage
              applicationId={selectedApplicationId}
              onBack={() => handleNavigate('applications')}
            />
          )}

          {currentPage === 'new-application' && (
            <NewApplicationPage
              onApplicationCreated={(id) => handleSelectApplication(id)}
              onCancel={() => handleNavigate('applications')}
            />
          )}

          {currentPage === 'document-intelligence' && (
            <DocumentIntelligencePage
              onSelectApplication={handleSelectApplication}
            />
          )}

          {currentPage === 'compliance' && (
            <ComplianceMonitoringPage
              onSelectApplication={handleSelectApplication}
            />
          )}

          {currentPage === 'workflow' && <WorkflowManagementPage />}

          {currentPage === 'risk' && (
            <RiskAssessmentPage
              onSelectApplication={handleSelectApplication}
            />
          )}

          {currentPage === 'simulation' && <DigitalTwinSimulationPage />}

          {currentPage === 'alerts' && (
            <AlertsPage onSelectApplication={handleSelectApplication} />
          )}

          {currentPage === 'institutions' && (
            <InstitutionsPage
              onSelectApplication={handleSelectApplication}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'officers' && (
            <OfficerManagementPage
              onSelectApplication={handleSelectApplication}
            />
          )}

          {currentPage === 'analytics' && <AnalyticsReportsPage />}

          {currentPage === 'audit' && (
            <AuditLogsPage onSelectApplication={handleSelectApplication} />
          )}

          {currentPage === 'users' && <UserManagementPage />}

          {currentPage === 'settings' && <SystemSettingsPage />}

          {currentPage === 'profile' && <ProfilePage />}
        </main>
      </div>

      {/* Global Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#17365D] text-white px-4 py-3 rounded-xl shadow-2xl border border-sky-400/30 text-xs font-semibold flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainAppShell />
      </AppProvider>
    </AuthProvider>
  );
}
