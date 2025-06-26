import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { SchedulingProvider } from './contexts/SchedulingContext';
import { ClientProvider } from './contexts/ClientContext';
import { ProfessionalProvider } from './contexts/ProfessionalContext';
import { ServiceProvider } from './contexts/ServiceContext';
import { FinancialProvider } from './contexts/FinancialContext';
import { AuthProvider } from './contexts/AuthContext';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { LandingPage } from './components/Landing/LandingPage';
import { Dashboard } from './components/Dashboard/Dashboard';
import { SchedulingDashboard } from './components/Scheduling/SchedulingDashboard';
import { ManagementCalendar } from './components/Scheduling/ManagementCalendar';
import { ClientBooking } from './components/Scheduling/ClientBooking';
import { ClientManagement } from './components/Clients/ClientManagement';
import { FinancialDashboard } from './components/Finances/FinancialDashboard';
import { ProfessionalManagement } from './components/Professionals/ProfessionalManagement';
import { ServiceManagement } from './components/Services/ServiceManagement';
import { ReportsAnalytics } from './components/Reports/ReportsAnalytics';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ClientDashboard } from './modules/client/ClientDashboard';
import { ClientAppointments } from './modules/client/ClientAppointments';
import { ClientProfilePage } from './modules/client/ClientProfilePage';
import { ClientHistoryPage } from './modules/client/ClientHistoryPage';
import { EmployeeDashboard } from './components/admin/employee/EmployeeDashboard';
import { AdminDashboard } from './modules/admin/AdminDashboard';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { Footer } from './components/Layout/Footer';

// Standalone landing page component
function StandaloneLandingPage() {
  return (
    <div className="min-h-screen">
      <LandingPage />
      <Footer />
    </div>
  );
}

const tabTitles = {
  dashboard: 'Dashboard',
  appointments: 'Agendamentos',
  calendar: 'Agenda',
  landing: 'Landing Page',
  booking: 'Reserva Online',
  clients: 'Clientes',
  barbers: 'Profissionais',
  finances: 'Financeiro',
  services: 'Serviços',
  reports: 'Relatórios',
  settings: 'Configurações',
};

function AppContent() {
  const [activeTab, setActiveTab] = useState('landing');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'landing':
        return <LandingPage />;
      case 'appointments':
        return <SchedulingDashboard />;
      case 'calendar':
        return <ManagementCalendar />;
      case 'booking':
        return <ClientBooking />;
      case 'clients':
        return <ClientManagement />;
      case 'barbers':
        return <ProfessionalManagement />;
      case 'services':
        return <ServiceManagement />;
      case 'finances':
        return <FinancialDashboard />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'settings':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Configurações</h3>
            <p className="text-slate-600">Módulo em desenvolvimento</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  useEffect(() => {
    if (location.pathname === '/admin') {
      setActiveTab('dashboard');
    }
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          title={tabTitles[activeTab as keyof typeof tabTitles]}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <FinancialProvider>
          <ServiceProvider>
            <ProfessionalProvider>
              <ClientProvider>
                <SchedulingProvider>
                  <Routes>
                    <Route path="/" element={<StandaloneLandingPage />} />
                    
                    {/* Client Routes */}
                    <Route path="/client" element={
                      <ProtectedRoute requiredRole="client">
                        <ClientDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/client/appointments" element={
                      <ProtectedRoute requiredRole="client">
                        <ClientAppointments />
                      </ProtectedRoute>
                    } />
                    <Route path="/client/profile" element={
                      <ProtectedRoute requiredRole="client">
                        <ClientProfilePage />
                      </ProtectedRoute>
                    } />
                    <Route path="/client/history" element={
                      <ProtectedRoute requiredRole="client">
                        <ClientHistoryPage />
                      </ProtectedRoute>
                    } />
                    
                    {/* Employee Routes */}
                    <Route path="/employee" element={
                      <ProtectedRoute requiredRole="employee">
                        <EmployeeDashboard />
                      </ProtectedRoute>
                    } />
                    
                    {/* Admin Routes */}
                    <Route path="/admin/*" element={
                      <ProtectedRoute requiredRole="admin">
                        <AppContent />
                      </ProtectedRoute>
                    } />
                    
                    {/* Unauthorized Page */}
                    <Route path="/unauthorized" element={<UnauthorizedPage />} />
                    
                    {/* Fallback route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </SchedulingProvider>
              </ClientProvider>
            </ProfessionalProvider>
          </ServiceProvider>
        </FinancialProvider>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
