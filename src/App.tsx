import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { FarmerGuideProvider } from './context/FarmerGuideContext';
import { FarmerGuidePopup } from './components/common/FarmerGuidePopup';
import { LandingOnboardingFlow } from './components/onboarding/LandingOnboardingFlow';
import { HomePage } from './pages/Home/HomePage';
import { KrishiWorkflow } from './KrishiWorkflow';
import { BuyerMarketplacePage } from './pages/buyers/BuyerMarketplacePage';
import { PublicLayout } from './agrilink/layouts/PublicLayout';
import { AppLayout } from './agrilink/layouts/AppLayout';
import { PublicMarketsPage } from './agrilink/pages/public/PublicMarketsPage';
import { AboutPage } from './agrilink/pages/public/AboutPage';
import { HowItWorksPage } from './agrilink/pages/public/HowItWorksPage';
import { LoginPage } from './agrilink/pages/public/LoginPage';
import { LotsPage } from './agrilink/pages/farmer/LotsPage';
import { OffersPage } from './agrilink/pages/farmer/OffersPage';
import { LogisticsPage } from './agrilink/pages/farmer/LogisticsPage';
import { StoragePage } from './agrilink/pages/farmer/StoragePage';
import { TransactionsPage } from './agrilink/pages/farmer/TransactionsPage';
import { GrievancePage } from './agrilink/pages/farmer/GrievancePage';
import { MarketExplorerPage } from './agrilink/pages/farmer/MarketExplorerPage';
import { AISellAdvisorPage } from './agrilink/pages/farmer/AISellAdvisorPage';
import { VerifiedBuyersPage } from './agrilink/pages/farmer/VerifiedBuyersPage';

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <FarmerGuideProvider>
          <BrowserRouter>
            <FarmerGuidePopup />
            <Routes>
              {/* Main Master Landing & Onboarding Flow */}
              <Route path="/" element={<LandingOnboardingFlow />} />
              <Route path="/onboarding" element={<LandingOnboardingFlow />} />
              <Route path="/welcome" element={<LandingOnboardingFlow />} />
              <Route path="/portal" element={<HomePage />} />
              <Route path="/overview" element={<HomePage />} />

              {/* Unified Farmer Experience: Merged Crop Analysis & Marketplace */}
              <Route path="/farmer" element={<KrishiWorkflow />} />
              <Route path="/crop-analysis" element={<KrishiWorkflow />} />
              <Route path="/crop-analysis/*" element={<KrishiWorkflow />} />
              <Route path="/marketplace" element={<KrishiWorkflow />} />
              <Route path="/dashboard" element={<KrishiWorkflow />} />

              {/* Dedicated Buyer Marketplace & Procurement Portal */}
              <Route path="/buyers" element={<BuyerMarketplacePage />} />

              {/* Public Informational Pages */}
              <Route element={<PublicLayout />}>
                <Route path="/markets" element={<PublicMarketsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/login" element={<LoginPage />} />
              </Route>

              {/* Detailed Farmer Marketplace Sub-routes (Wrapped in AppLayout) */}
              <Route element={<AppLayout />}>
                <Route path="/farmer/lots" element={<LotsPage />} />
                <Route path="/farmer/offers" element={<OffersPage />} />
                <Route path="/farmer/logistics" element={<LogisticsPage />} />
                <Route path="/farmer/storage" element={<StoragePage />} />
                <Route path="/farmer/transactions" element={<TransactionsPage />} />
                <Route path="/farmer/grievances" element={<GrievancePage />} />
                <Route path="/farmer/markets" element={<MarketExplorerPage />} />
                <Route path="/farmer/buyers" element={<VerifiedBuyersPage />} />
                <Route path="/farmer/ai-advisor" element={<AISellAdvisorPage />} />
                <Route path="/transport" element={<LogisticsPage />} />
              </Route>

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </FarmerGuideProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
