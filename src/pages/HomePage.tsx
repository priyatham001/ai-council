import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { ExperienceCards } from '../components/home/ExperienceCards';
import { FeaturesSection } from '../components/home/FeaturesSection';
import { Footer } from '../components/home/Footer';
import { KisanAIWidget } from '../components/KisanAIWidget';
import '../styles/homepage.css';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#030a04] text-stone-100 font-sans selection:bg-emerald-500 selection:text-black">
      {/* 1. Premium Hero Section with Orbit System & Real Farmer Visuals */}
      <HeroSection />

      {/* 2. Two Main Entry Cards: Farm Intelligence & Farmer Marketplace */}
      <ExperienceCards />

      {/* 3. Comprehensive Feature Showcase */}
      <FeaturesSection />

      {/* 4. Kisan AI Interactive Section with Live Assistant */}
      <KisanAIWidget />

      {/* 5. Production Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
