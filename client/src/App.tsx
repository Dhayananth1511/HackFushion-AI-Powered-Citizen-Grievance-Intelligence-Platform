import { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LandingPage } from './features/landing/LandingPage';
import { CitizenDashboard } from './features/citizen/CitizenDashboard';
import { ReportComplaintPage } from './features/citizen/ReportComplaintPage';
import { AIAnalysisPage } from './features/ai-analysis/AIAnalysisPage';
import { IncidentViewPage } from './features/incident/IncidentViewPage';
import { PriorityPage } from './features/priority/PriorityPage';
import { OfficerDashboard } from './features/officer/OfficerDashboard';
import { IncidentDetail } from './features/officer/IncidentDetail';
import { CitizenVerificationPage } from './features/verification/CitizenVerificationPage';

import { MyComplaintsPage } from './features/citizen/MyComplaintsPage';
import { OfficerIncidentsPage } from './features/officer/OfficerIncidentsPage';
import { OfficerMapPage } from './features/officer/OfficerMapPage';
import { OfficerAIOperationsPage } from './features/officer/OfficerAIOperationsPage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } }
});

const Loader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
  </div>
);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* Landing */}
            <Route path="/" element={<LandingPage />} />

            {/* Citizen flow */}
            <Route path="/citizen" element={<CitizenDashboard />} />
            <Route path="/citizen/report" element={<ReportComplaintPage />} />
            <Route path="/citizen/ai-analysis" element={<AIAnalysisPage />} />
            <Route path="/citizen/incident" element={<IncidentViewPage />} />
            <Route path="/citizen/priority" element={<PriorityPage />} />
            <Route path="/citizen/complaints" element={<MyComplaintsPage />} />
            <Route path="/citizen/track/:id" element={<IncidentViewPage />} />
            <Route path="/citizen/verify/:id" element={<CitizenVerificationPage />} />

            {/* Officer flow */}
            <Route path="/officer" element={<OfficerDashboard />} />
            <Route path="/officer/incidents" element={<OfficerIncidentsPage />} />
            <Route path="/officer/incidents/:id" element={<IncidentDetail />} />
            <Route path="/officer/map" element={<OfficerMapPage />} />
            <Route path="/officer/ai" element={<OfficerAIOperationsPage />} />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
