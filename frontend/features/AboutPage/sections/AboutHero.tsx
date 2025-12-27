'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './aboutSections.module.css';
import { TIMING_MICRO } from '@/lib/animations/config';

/**
 * AboutHero Component
 * Feature: 002-engaging-landing-pages
 *
 * Typewriter reveal effect with cursor blink animation.
 * Designed via ui-ux skill for narrative-driven AboutPage.
 */

interface AboutHeroProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const AboutHero: React.FC<AboutHeroProps> = ({
  title = 'We believe in the power of focus',
  subtitle = 'TaskFlow was born from a simple idea: productivity should feel natural, not forced. We are building tools that help you accomplish more while stressing less.',
  className,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const indexRef = useRef(0);

  // Check for reduced motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    setIsMounted(true);

    if (prefersReducedMotion) {
      setDisplayedText(title);
      setIsComplete(true);
      return;
    }

    // Typewriter effect
    const typeInterval = setInterval(() => {
      if (indexRef.current < title.length) {
        setDisplayedText(title.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        clearInterval(typeInterval);
        setIsComplete(true);
      }
    }, 50); // 50ms per character = ~20 chars/second

    return () => clearInterval(typeInterval);
  }, [title, prefersReducedMotion]);

  // Cursor blink
  useEffect(() => {
    if (prefersReducedMotion) return;

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, TIMING_MICRO.slow * 2);

    return () => clearInterval(cursorInterval);
  }, [prefersReducedMotion]);

  return (
    <section
      className={`${styles.aboutHero} ${className || ''} ${isMounted ? styles.mounted : ''}`}
      aria-labelledby="about-heading"
    >
      <div className={styles.aboutHeroContent}>
        <h1 id="about-heading" className={styles.aboutTitle}>
          <span className={styles.typewriterText}>{displayedText}</span>
          {!isComplete && (
            <span
              className={`${styles.cursor} ${showCursor ? styles.cursorVisible : ''}`}
              aria-hidden="true"
            >
              |
            </span>
          )}
        </h1>
        <p
          className={`${styles.aboutSubtitle} ${isComplete ? styles.subtitleVisible : ''}`}
        >
          {subtitle}
        </p>
      </div>

      {/* Background decoration */}
      <div className={styles.aboutHeroBg} aria-hidden="true">
        <div className={styles.gradientOrb1} />
        <div className={styles.gradientOrb2} />
      </div>
    </section>
  );
};

export default AboutHero;
