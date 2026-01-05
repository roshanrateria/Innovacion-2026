import { useEffect, useState } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import CountdownTimer from '@/components/CountdownTimer';
import AboutSection from '@/components/AboutSection';
import EventsSection from '@/components/EventsSection';
import RegistrationSection from '@/components/RegistrationSection';
import GallerySection from '@/components/GallerySection';
import IndiaMap from '@/components/IndiaMap';
import PartnersSection from '@/components/PartnersSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import MatrixBackground from '@/components/MatrixBackground';
import DynamicBackground from '@/components/DynamicBackground';

import CustomCursor from '@/components/CustomCursor';
import EventRecommendationAI from '@/components/EventRecommendationAI';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Add smooth scrolling behavior for navigation links
    const handleNavClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.href && target.href.includes('#')) {
        e.preventDefault();
        const elementId = target.href.split('#')[1];
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    };

    document.addEventListener('click', handleNavClick);
    return () => document.removeEventListener('click', handleNavClick);
  }, []);

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-[var(--space-black)] text-white overflow-x-hidden custom-cursor">
      <CustomCursor />
      <MatrixBackground />
      <DynamicBackground />

      <Navigation />
      <HeroSection />
      <CountdownTimer />
      <AboutSection />
      <EventsSection />
      <GallerySection />
      <IndiaMap />
      <PartnersSection />
      <ContactSection />
      <Footer />

      {/* AI Assistant */}
      <EventRecommendationAI />
    </div>
  );
}