'use client';

import React from 'react';
import styles from './sections.module.css';
import { useInView } from '@/hooks';
import type { FeatureItem } from '@/types/landing';

/**
 * FeaturesSection Component
 * Feature: 002-engaging-landing-pages
 *
 * Constellation pattern with connected nodes and scroll-triggered animations.
 * Designed via ui-ux skill for value discovery through content sections.
 */

// Default features data
const defaultFeatures: FeatureItem[] = [
  {
    title: 'Smart Organization',
    description:
      'AI-powered task categorization that learns your workflow and suggests optimal task groupings.',
    icon: 'layers',
    accentColor: 'hsl(var(--landing-primary))',
  },
  {
    title: 'Real-time Collaboration',
    description:
      'Work seamlessly with your team with instant updates and shared workspaces.',
    icon: 'users',
    accentColor: 'hsl(var(--landing-accent))',
  },
  {
    title: 'Progress Analytics',
    description:
      'Visualize your productivity with beautiful charts and actionable insights.',
    icon: 'chart',
    accentColor: 'hsl(var(--landing-secondary))',
  },
  {
    title: 'Cross-Platform Sync',
    description:
      'Access your tasks from any device with lightning-fast synchronization.',
    icon: 'sync',
    accentColor: 'hsl(var(--landing-primary))',
  },
  {
    title: 'Smart Reminders',
    description:
      'Never miss a deadline with intelligent notifications that adapt to your schedule.',
    icon: 'bell',
    accentColor: 'hsl(var(--landing-accent))',
  },
  {
    title: 'Privacy First',
    description:
      'Your data is encrypted end-to-end. We never sell or share your information.',
    icon: 'shield',
    accentColor: 'hsl(var(--landing-secondary))',
  },
];

// Icon components
const icons: Record<string, React.ReactNode> = {
  layers: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  sync: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38" />
    </svg>
  ),
  bell: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
};

interface FeaturesSectionProps {
  features?: FeatureItem[];
  className?: string;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  features = defaultFeatures,
  className,
}) => {
  const { ref, isInView } = useInView<HTMLElement>({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section
      ref={ref}
      id="features"
      className={`${styles.featuresSection} ${className || ''} ${isInView ? styles.visible : ''}`}
      aria-labelledby="features-heading"
    >
      {/* Constellation background */}
      <div className={styles.constellationBg} aria-hidden="true">
        <svg className={styles.constellationSvg} viewBox="0 0 800 600">
          {/* Connection lines */}
          <path
            d="M100,100 L300,200 L500,150 L700,250"
            className={styles.constellationLine}
          />
          <path
            d="M200,400 L400,350 L600,450"
            className={styles.constellationLine}
          />
          <path
            d="M300,200 L400,350"
            className={styles.constellationLine}
          />
          {/* Nodes */}
          <circle cx="100" cy="100" r="4" className={styles.constellationNode} />
          <circle cx="300" cy="200" r="6" className={styles.constellationNode} />
          <circle cx="500" cy="150" r="4" className={styles.constellationNode} />
          <circle cx="700" cy="250" r="5" className={styles.constellationNode} />
          <circle cx="200" cy="400" r="4" className={styles.constellationNode} />
          <circle cx="400" cy="350" r="6" className={styles.constellationNode} />
          <circle cx="600" cy="450" r="4" className={styles.constellationNode} />
        </svg>
      </div>

      <div className={styles.sectionContainer}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <h2 id="features-heading" className={styles.sectionTitle}>
            Everything you need to stay organized
          </h2>
          <p className={styles.sectionSubtitle}>
            Powerful features designed to help you manage tasks efficiently and
            achieve your goals faster.
          </p>
        </div>

        {/* Features Grid */}
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={styles.featureCard}
              style={{
                animationDelay: `${index * 100}ms`,
                '--accent-color': feature.accentColor,
              } as React.CSSProperties}
            >
              <div className={styles.featureIconWrapper}>
                <span className={styles.featureIcon}>
                  {icons[feature.icon] || icons.layers}
                </span>
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
