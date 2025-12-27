'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './sections.module.css';
import { useInView } from '@/hooks';
import type { StatItem } from '@/types/landing';
import { TIMING_PAGE } from '@/lib/animations/config';

/**
 * StatsSection Component
 * Feature: 002-engaging-landing-pages
 *
 * Counter reveal animation with eased counting.
 * Designed via ui-ux skill for impressive statistics display.
 */

// Default stats data
const defaultStats: StatItem[] = [
  {
    value: '50K+',
    numericValue: 50000,
    suffix: '+',
    label: 'Active Users',
  },
  {
    value: '2M+',
    numericValue: 2000000,
    suffix: '+',
    label: 'Tasks Completed',
  },
  {
    value: '99.9%',
    numericValue: 99.9,
    suffix: '%',
    label: 'Uptime',
  },
  {
    value: '4.9',
    numericValue: 4.9,
    suffix: '',
    label: 'User Rating',
  },
];

// Animated counter hook
function useAnimatedCounter(
  endValue: number,
  duration: number,
  shouldStart: boolean
): number {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!shouldStart) return;

    const easeOutQuart = (t: number): number => {
      return 1 - Math.pow(1 - t, 4);
    };

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);

      setCount(easedProgress * endValue);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [endValue, duration, shouldStart]);

  return count;
}

// Format number for display
function formatNumber(value: number, originalValue: number): string {
  if (originalValue >= 1000000) {
    return (value / 1000000).toFixed(value >= 1000000 ? 0 : 1) + 'M';
  }
  if (originalValue >= 1000) {
    return (value / 1000).toFixed(value >= 1000 ? 0 : 1) + 'K';
  }
  if (originalValue < 10 && originalValue % 1 !== 0) {
    return value.toFixed(1);
  }
  return Math.round(value).toString();
}

// Individual stat counter component
const StatCounter: React.FC<{ stat: StatItem; isVisible: boolean; index: number }> = ({
  stat,
  isVisible,
  index,
}) => {
  const count = useAnimatedCounter(
    stat.numericValue,
    TIMING_PAGE.slow,
    isVisible
  );

  return (
    <div
      className={styles.statCard}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className={styles.statValue}>
        {formatNumber(count, stat.numericValue)}
        <span className={styles.statSuffix}>{stat.suffix}</span>
      </div>
      <div className={styles.statLabel}>{stat.label}</div>
    </div>
  );
};

interface StatsSectionProps {
  stats?: StatItem[];
  className?: string;
}

const StatsSection: React.FC<StatsSectionProps> = ({
  stats = defaultStats,
  className,
}) => {
  const { ref, isInView } = useInView<HTMLElement>({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <section
      ref={ref}
      className={`${styles.statsSection} ${className || ''} ${isInView ? styles.visible : ''}`}
      aria-label="Platform statistics"
    >
      <div className={styles.sectionContainer}>
        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <StatCounter
              key={stat.label}
              stat={stat}
              isVisible={isInView}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
