'use client';

import React from 'react';
import Link from 'next/link';
import styles from './sections.module.css';
import { useInView } from '@/hooks';
import type { CallToAction } from '@/types/landing';

/**
 * CTASection Component
 * Feature: 002-engaging-landing-pages
 *
 * Aurora glow effect with call-to-action.
 * Designed via ui-ux skill for conversion optimization.
 */

const defaultCta: CallToAction = {
  text: 'Start Your Free Trial',
  href: '/signup',
  variant: 'primary',
  size: 'large',
};

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  cta?: CallToAction;
  className?: string;
}

const CTASection: React.FC<CTASectionProps> = ({
  title = 'Ready to transform your productivity?',
  subtitle = 'Join thousands of teams who are already using TaskFlow to accomplish more every day.',
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
      className={`${styles.ctaSection} ${className || ''} ${isInView ? styles.visible : ''}`}
      aria-labelledby="cta-heading"
    >
      {/* Aurora Background */}
      <div className={styles.auroraBg} aria-hidden="true">
        <div className={styles.auroraLayer1} />
        <div className={styles.auroraLayer2} />
        <div className={styles.auroraLayer3} />
      </div>

      <div className={styles.ctaContainer}>
        <h2 id="cta-heading" className={styles.ctaTitle}>
          {title}
        </h2>
        <p className={styles.ctaSubtitle}>{subtitle}</p>
        <div className={styles.ctaActions}>
          <Link href={cta.href} className={styles.ctaButton}>
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
          <span className={styles.ctaNote}>No credit card required</span>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
