'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './aboutSections.module.css';
import { useInView } from '@/hooks';

/**
 * MissionSection Component
 * Feature: 002-engaging-landing-pages
 *
 * Quote with char-by-char reveal animation.
 * Designed via ui-ux skill for narrative impact.
 */

interface MissionSectionProps {
  quote?: string;
  author?: string;
  className?: string;
}

const MissionSection: React.FC<MissionSectionProps> = ({
  quote = 'Our mission is to empower individuals and teams to achieve their goals through intuitive, beautiful, and powerful productivity tools that respect your time and attention.',
  author = 'The TaskFlow Team',
  className,
}) => {
  const { ref, isInView } = useInView<HTMLElement>({
    threshold: 0.3,
    triggerOnce: true,
  });

  const [displayedChars, setDisplayedChars] = useState(0);
  const animationRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!isInView) return;

    if (prefersReducedMotion) {
      setDisplayedChars(quote.length);
      return;
    }

    // Char by char reveal
    animationRef.current = setInterval(() => {
      setDisplayedChars((prev) => {
        if (prev >= quote.length) {
          if (animationRef.current) clearInterval(animationRef.current);
          return quote.length;
        }
        return prev + 1;
      });
    }, 25); // Fast reveal

    return () => {
      if (animationRef.current) clearInterval(animationRef.current);
    };
  }, [isInView, quote, prefersReducedMotion]);

  return (
    <section
      ref={ref}
      className={`${styles.missionSection} ${className || ''} ${isInView ? styles.visible : ''}`}
      aria-labelledby="mission-heading"
    >
      <div className={styles.missionContent}>
        <h2 id="mission-heading" className={styles.sectionLabel}>
          Our Mission
        </h2>
        <blockquote className={styles.missionQuote}>
          <span className={styles.quoteChars}>
            {quote.split('').map((char, index) => (
              <span
                key={index}
                className={`${styles.quoteChar} ${index < displayedChars ? styles.charVisible : ''}`}
                style={{ transitionDelay: prefersReducedMotion ? '0ms' : `${index * 5}ms` }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </span>
        </blockquote>
        <cite
          className={`${styles.missionAuthor} ${displayedChars >= quote.length ? styles.authorVisible : ''}`}
        >
          — {author}
        </cite>
      </div>
    </section>
  );
};

export default MissionSection;
