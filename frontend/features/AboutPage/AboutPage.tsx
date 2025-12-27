'use client';

import React from 'react';
import styles from './aboutPage.module.css';
import {
  AboutHero,
  MissionSection,
  ValuesTimeline,
  AboutCTA,
} from './sections';

/**
 * AboutPage Component
 * Feature: 002-engaging-landing-pages
 *
 * Narrative-driven brand story with typewriter reveal, timeline draw,
 * and parallax + aurora effects.
 * Designed via ui-ux skill for brand storytelling.
 */

interface AboutPageProps {
  className?: string;
}

const AboutPage: React.FC<AboutPageProps> = ({ className }) => {
  return (
    <main className={`${styles.aboutMain} landing-page ${className || ''}`}>
      {/* Hero with Typewriter Effect */}
      <AboutHero />

      {/* Mission Statement with Quote Reveal */}
      <MissionSection />

      {/* Values Timeline with Draw Animation */}
      <ValuesTimeline />

      {/* CTA with Parallax + Aurora */}
      <AboutCTA />
    </main>
  );
};

export default AboutPage;
