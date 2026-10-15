import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingModal } from './components/OnboardingModal';
import { AuthModal } from './components/AuthModal';

// Pages
import { Dashboard } from './pages/Dashboard';
import { PartIdentifier } from './pages/PartIdentifier';
import { ProblemSolver } from './pages/ProblemSolver';
import { StudyAssistant } from './pages/StudyAssistant';
import { Calculator } from './pages/Calculator';
import { MaintenanceRecords } from './pages/MaintenanceRecords';
import { KnowledgeLibrary } from './pages/KnowledgeLibrary';
import { SavedResults } from './pages/SavedResults';
import { UserProfile } from './pages/UserProfile';
import { AdminDashboard } from './pages/AdminDashboard';

export const AppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  useEffect(() => {
    // Check if onboarding was previously shown
    const onboardingDone = localStorage.getItem('mechnova_onboarding_completed');
    if (!onboardingDone) {
      // Show onboarding right after splash finishes
    }
  }, []);

  const handleFinishSplash = () => {
    setShowSplash(false);
    const onboardingDone = localStorage.getItem('mechnova_onboarding_completed');
    if (!onboardingDone) {
      setShowOnboarding(true);
    }
  };

  const handleGlobalSearch = (query: string) => {
    const q = query.toLowerCase();
    if (q.includes('calc') || q.includes('stress') || q.includes('formula') || q.includes('torque') || q.includes('power')) {
      setCurrentTab('calculator');
    } else if (q.includes('part') || q.includes('gear') || q.includes('bearing') || q.includes('shaft') || q.includes('pump') || q.includes('valve')) {
      setCurrentTab('identify');
    } else if (q.includes('trouble') || q.includes('vibrat') || q.includes('noise') || q.includes('leak') || q.includes('loto')) {
      setCurrentTab('troubleshoot');
    } else if (q.includes('study') || q.includes('thermo') || q.includes('fluid') || q.includes('mechanic')) {
      setCurrentTab('study');
    } else if (q.includes('maint') || q.includes('equip') || q.includes('fleet') || q.includes('cost')) {
      setCurrentTab('maintenance');
    } else {
      setCurrentTab('knowledge');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1F3B] bg-blueprint-grid text-slate-100 flex flex-col antialiased">
      {/* Animated Splash Screen */}
      {showSplash && <SplashScreen onFinish={handleFinishSplash} />}

      {/* Onboarding Feature Tour Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* Main App Layout */}
      <div className="flex flex-1 min-h-screen">
        {/* Desktop Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onOpenOnboarding={() => setShowOnboarding(true)}
        />

        {/* Content Wrapper */}
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar
            onSearch={handleGlobalSearch}
            onOpenAuth={() => setShowAuthModal(true)}
            onSelectTab={setCurrentTab}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-12">
            {currentTab === 'dashboard' && (
              <Dashboard
                onSelectTab={setCurrentTab}
                onOpenOnboarding={() => setShowOnboarding(true)}
              />
            )}
            {currentTab === 'identify' && <PartIdentifier />}
            {currentTab === 'troubleshoot' && <ProblemSolver />}
            {currentTab === 'study' && <StudyAssistant />}
            {currentTab === 'calculator' && <Calculator />}
            {currentTab === 'maintenance' && <MaintenanceRecords />}
            {currentTab === 'knowledge' && <KnowledgeLibrary />}
            {currentTab === 'saved' && <SavedResults />}
            {currentTab === 'profile' && <UserProfile />}
            {currentTab === 'admin' && <AdminDashboard />}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}
