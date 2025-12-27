'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import styles from './hero.module.css';
import { useWindowMousePosition, useMagneticButton } from '@/hooks';
import type { HeroProps, CallToAction } from '@/types/landing';
import {
  TIMING_PAGE,
  TIMING_MICRO,
  TIMING_AMBIENT,
} from '@/lib/animations/config';

/**
 * Hero Component
 * Feature: 002-engaging-landing-pages
 *
 * Captivating entrance with Gravity Pull effect, spotlight, meteors, and magnetic CTA.
 * Designed via ui-ux skill for engaging first impression.
 */

interface HeroComponentProps extends Partial<HeroProps> {
  /** Custom className for styling overrides */
  className?: string;
}

// Default content
const defaultContent = {
  headline: 'Organize Your Life, One Task at a Time',
  subheadline:
    'Experience the future of productivity with our intuitive task management system. Built for those who dream big and execute bigger.',
  primaryCta: {
    text: 'Get Started Free',
    href: '/signup',
    variant: 'primary' as const,
    size: 'large' as const,
    icon: 'arrow-right' as const,
  },
  secondaryCta: {
    text: 'Learn More',
    href: '/about',
    variant: 'ghost' as const,
  },
};

// Meteor component for ambient animation
const Meteor = ({ delay, duration }: { delay: number; duration: number }) => (
  <div
    className={styles.meteor}
    style={{
      animationDelay: `${delay}ms`,
      animationDuration: `${duration}ms`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 50}%`,
    }}
  />
);

// Floating orb component for background
const FloatingOrb = ({
  size,
  color,
  delay,
  position,
}: {
  size: number;
  color: string;
  delay: number;
  position: { x: string; y: string };
}) => (
  <div
    className={styles.floatingOrb}
    style={{
      width: size,
      height: size,
      background: color,
      left: position.x,
      top: position.y,
      animationDelay: `${delay}ms`,
    }}
  />
);

// Magnetic CTA Button
const MagneticCTA = ({
  cta,
  isPrimary,
}: {
  cta: CallToAction;
  isPrimary: boolean;
}) => {
  const { ref, style, isHovering } = useMagneticButton(12);

  const buttonClass = isPrimary ? styles.primaryCta : styles.secondaryCta;

  return (
    <Link
      href={cta.href}
      ref={ref as React.RefObject<HTMLAnchorElement>}
      className={`${buttonClass} ${isHovering ? styles.ctaHovered : ''}`}
      style={style}
    >
      <span className={styles.ctaText}>{cta.text}</span>
      {cta.icon === 'arrow-right' && (
        <span className={styles.ctaIcon}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </span>
      )}
      <span className={styles.ctaGlow} />
    </Link>
  );
};

const Hero: React.FC<HeroComponentProps> = ({
  headline = defaultContent.headline,
  subheadline = defaultContent.subheadline,
  primaryCta = defaultContent.primaryCta,
  secondaryCta = defaultContent.secondaryCta,
  className,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [headlineRevealed, setHeadlineRevealed] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const mousePosition = useWindowMousePosition(true);

  // Split headline into characters for animation
  const headlineChars = useMemo(() => headline.split(''), [headline]);

  // Generate meteors
  const meteors = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        delay: Math.random() * TIMING_AMBIENT.slow,
        duration: TIMING_AMBIENT.fast + Math.random() * TIMING_AMBIENT.fast,
      })),
    []
  );

  // Generate floating orbs
  const orbs = useMemo(
    () => [
      {
        id: 1,
        size: 300,
        color: 'hsl(var(--landing-primary) / 0.15)',
        delay: 0,
        position: { x: '10%', y: '20%' },
      },
      {
        id: 2,
        size: 200,
        color: 'hsl(var(--landing-accent) / 0.1)',
        delay: 1000,
        position: { x: '70%', y: '60%' },
      },
      {
        id: 3,
        size: 250,
        color: 'hsl(var(--landing-secondary) / 0.12)',
        delay: 2000,
        position: { x: '80%', y: '10%' },
      },
      {
        id: 4,
        size: 180,
        color: 'hsl(var(--landing-primary) / 0.08)',
        delay: 500,
        position: { x: '20%', y: '70%' },
      },
    ],
    []
  );

  // Spotlight position based on mouse
  const spotlightStyle = useMemo(() => {
    if (!heroRef.current) return {};

    return {
      '--spotlight-x': `${mousePosition.x}px`,
      '--spotlight-y': `${mousePosition.y}px`,
    } as React.CSSProperties;
  }, [mousePosition]);

  // Trigger animations on mount
  useEffect(() => {
    // Small delay for initial render
    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    // Headline reveal after initial load
    const headlineTimer = setTimeout(() => {
      setHeadlineRevealed(true);
    }, TIMING_PAGE.default);

    return () => {
      clearTimeout(loadTimer);
      clearTimeout(headlineTimer);
    };
  }, []);

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section
      ref={heroRef}
      className={`${styles.hero} ${className || ''} ${isLoaded ? styles.loaded : ''}`}
      style={spotlightStyle}
      aria-label="Hero section"
    >
      {/* Background Effects Layer */}
      <div className={styles.backgroundEffects} aria-hidden="true">
        {/* Gradient Mesh */}
        <div className={styles.gradientMesh} />

        {/* Floating Orbs */}
        {!prefersReducedMotion &&
          orbs.map((orb) => <FloatingOrb key={orb.id} {...orb} />)}

        {/* Meteor Shower */}
        {!prefersReducedMotion && (
          <div className={styles.meteorShower}>
            {meteors.map((meteor) => (
              <Meteor key={meteor.id} {...meteor} />
            ))}
          </div>
        )}

        {/* Mouse-reactive Spotlight */}
        <div className={styles.spotlight} />
      </div>

      {/* Content Container */}
      <div className={styles.content}>
        {/* Headline with char-by-char reveal */}
        <h1 className={styles.headline}>
          {headlineChars.map((char, index) => (
            <span
              key={index}
              className={`${styles.headlineChar} ${headlineRevealed ? styles.charRevealed : ''}`}
              style={{
                animationDelay: prefersReducedMotion
                  ? '0ms'
                  : `${index * 30}ms`,
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>

        {/* Subheadline with blur-up animation */}
        <p
          className={`${styles.subheadline} ${isLoaded ? styles.subheadlineRevealed : ''}`}
        >
          {subheadline}
        </p>

        {/* CTA Buttons */}
        <div
          className={`${styles.ctaContainer} ${isLoaded ? styles.ctaRevealed : ''}`}
        >
          <MagneticCTA cta={primaryCta} isPrimary={true} />
          {secondaryCta && <MagneticCTA cta={secondaryCta} isPrimary={false} />}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`${styles.scrollIndicator} ${isLoaded ? styles.scrollIndicatorRevealed : ''}`}
        aria-hidden="true"
      >
        <div className={styles.scrollMouse}>
          <div className={styles.scrollWheel} />
        </div>
        <span className={styles.scrollText}>Scroll to explore</span>
      </div>
    </section>
  );
};

export default Hero;
