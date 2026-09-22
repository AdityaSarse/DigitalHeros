import React from 'react';
import HeroSection from '../components/home/HeroSection';
import StatsStrip from '../components/home/StatsStrip';
import AboutSection from '../components/home/AboutSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import CharityShowcase from '../components/home/CharityShowcase';
import DrawSpotlight from '../components/home/DrawSpotlight';
import SubscriptionSection from '../components/home/SubscriptionSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import ClubCTASection from '../components/home/ClubCTASection';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <StatsStrip />
      <AboutSection />
      <HowItWorksSection />
      <CharityShowcase />
      <DrawSpotlight />
      <SubscriptionSection />
      <TestimonialsSection />
      <ClubCTASection />
    </div>
  );
};

export default Home;
