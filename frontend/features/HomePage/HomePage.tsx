'use client';

import React from 'react';
import styles from './homePage.module.css';
import { Hero } from '@/Components';
import {
  FeaturesSection,
  StatsSection,
  TestimonialsSection,
  CTASection,
} from './sections';

/**
 * HomePage Component
 * Feature: 002-engaging-landing-pages
 *
 * Orchestrates Hero and content sections with scroll-triggered animations.
 * Includes Features (constellation pattern), Stats (counter reveal),
 * Testimonials (carousel depth), and CTA (aurora glow).
 */

interface HomePageProps {
  className?: string;
}

const HomePage: React.FC<HomePageProps> = ({ className }) => {
  return (
    <main className={`${styles.homepageMain} landing-page ${className || ''}`}>
      {/* Hero Section */}
      <Hero />

      {/* Features Section - Constellation Pattern */}
      <FeaturesSection />

      {/* Stats Section - Counter Reveal */}
      <StatsSection />

      {/* Testimonials Section - Carousel Depth */}
      <TestimonialsSection />

      {/* CTA Section - Aurora Glow */}
      <CTASection />
    </main>
  );
};

export default HomePage;
