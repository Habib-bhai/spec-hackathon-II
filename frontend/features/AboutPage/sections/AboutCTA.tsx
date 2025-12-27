'use client';

import React from 'react';
import Link from 'next/link';
import styles from './aboutSections.module.css';
import { useInView } from '@/hooks';
import type { CallToAction } from '@/types/landing';

/**
 * AboutCTA Component
 * Feature: 002-engaging-landing-pages
 *
 * Parallax background with floating shapes and aurora effect.
 * Designed via ui-ux skill for brand story closure.
 */

const defaultCta: CallToAction = {
  text: 'Join Our Journey',
  href: '/signup',
  variant: 'primary',
  size: 'large',
};

interface AboutCTAProps {
  title?: string;
  subtitle?: string;
  cta?: CallToAction;
  className?: string;
}

const AboutCTA: React.FC<AboutCTAProps> = ({
  title = 'Ready to be part of something meaningful?',
  subtitle = 'Join thousands of people who are transforming how they work and live.',
  cta = defaultCta,
  className,
}) => {
  const { ref, isInView } = useInView<HTMLElement>({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <section
      ref={ref}
      className={`${styles.aboutCta} ${className || ''} ${isInView ? styles.visible : ''}`}
      aria-labelledby="about-cta-heading"
    >
      {/* Parallax Background with Floating Shapes */}
      <div className={styles.parallaxBg} aria-hidden="true">
        <div className={styles.floatingShape1} />
        <div className={styles.floatingShape2} />
        <div className={styles.floatingShape3} />
        <div className={styles.auroraOverlay} />
      </div>

      <div className={styles.aboutCtaContent}>
        <h2 id="about-cta-heading" className={styles.aboutCtaTitle}>
          {title}
        </h2>
        <p className={styles.aboutCtaSubtitle}>{subtitle}</p>
        <Link href={cta.href} className={styles.aboutCtaButton}>
          <span>{cta.text}</span>
          <svg
            className={styles.ctaArrow}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </section>
  );
};

export default AboutCTA;
