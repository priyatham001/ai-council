import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/Home/HomePage';
import { KrishiWorkflow } from './KrishiWorkflow';
import { PublicLayout } from './agrilink/layouts/PublicLayout';
import { AppLayout } from './agrilink/layouts/AppLayout';
import { PublicMarketsPage } from './agrilink/pages/public/PublicMarketsPage';
import { PublicBuyersPage } from './agrilink/pages/public/PublicBuyersPage';
import { AboutPage } from './agrilink/pages/public/AboutPage';
import { HowItWorksPage } from './agrilink/pages/public/HowItWorksPage';
import { LoginPage } from './agrilink/pages/public/LoginPage';
import { FarmerDashboard } from './agrilink/pages/farmer/FarmerDashboard';
import { MarketExplorerPage } from './agrilink/pages/farmer/MarketExplorerPage';
import { AISellAdvisorPage } from './agrilink/pages/farmer/AISellAdvisorPage';
import { VerifiedBuyersPage } from './agrilink/pages/farmer/VerifiedBuyersPage';
import { LotsPage } from './agrilink/pages/farmer/LotsPage';
import { NewLotPage } from './agrilink/pages/farmer/NewLotPage';
import { OffersPage } from './agrilink/pages/farmer/OffersPage';
import { LogisticsPage } from './agrilink/pages/farmer/LogisticsPage';
import { StoragePage } from './agrilink/pages/farmer/StoragePage';
import { TransactionsPage } from './agrilink/pages/farmer/TransactionsPage';
import { GrievancePage } from './agrilink/pages/farmer/GrievancePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Landing Page */}
        <Route path="/" element={<HomePage />} />

        {/* Experience 1: Farm Intelligence Workflow */}
        <Route path="/crop-analysis" element={<KrishiWorkflow />} />
        <Route path="/crop-analysis/*" element={<KrishiWorkflow />} />

        {/* Public Informational Pages */}
        <Route element={<PublicLayout />}>
          <Route path="/markets" element={<PublicMarketsPage />} />
          <Route path="/buyers" element={<PublicBuyersPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Experience 2: Farmer Marketplace Experience */}
        <Route element={<AppLayout />}>
          {/* Canonical /marketplace routes */}
          <Route path="/marketplace" element={<FarmerDashboard />} />
          <Route path="/marketplace/dashboard" element={<FarmerDashboard />} />
          <Route path="/marketplace/lots" element={<LotsPage />} />
          <Route path="/marketplace/lots/new" element={<NewLotPage />} />
          <Route path="/marketplace/buyers" element={<VerifiedBuyersPage />} />
          <Route path="/marketplace/offers" element={<OffersPage />} />
          <Route path="/marketplace/logistics" element={<LogisticsPage />} />
          <Route path="/marketplace/storage" element={<StoragePage />} />
          <Route path="/marketplace/transactions" element={<TransactionsPage />} />
          <Route path="/marketplace/grievances" element={<GrievancePage />} />
          <Route path="/marketplace/markets" element={<MarketExplorerPage />} />
          <Route path="/marketplace/advisor" element={<AISellAdvisorPage />} />
          <Route path="/marketplace/ai-advisor" element={<AISellAdvisorPage />} />

          {/* Direct Aliases for backward compatibility */}
          <Route path="/dashboard" element={<FarmerDashboard />} />
          <Route path="/farmer" element={<FarmerDashboard />} />
          <Route path="/farmer/markets" element={<MarketExplorerPage />} />
          <Route path="/farmer/ai-advisor" element={<AISellAdvisorPage />} />
          <Route path="/farmer/buyers" element={<VerifiedBuyersPage />} />
          <Route path="/farmer/lots" element={<LotsPage />} />
          <Route path="/farmer/lots/new" element={<NewLotPage />} />
          <Route path="/farmer/offers" element={<OffersPage />} />
          <Route path="/transport" element={<LogisticsPage />} />
          <Route path="/farmer/logistics" element={<LogisticsPage />} />
          <Route path="/farmer/storage" element={<StoragePage />} />
          <Route path="/farmer/transactions" element={<TransactionsPage />} />
          <Route path="/farmer/grievances" element={<GrievancePage />} />
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
