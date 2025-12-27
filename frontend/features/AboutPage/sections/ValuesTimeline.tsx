'use client';

import React from 'react';
import styles from './aboutSections.module.css';
import { useInView } from '@/hooks';
import type { ValueItem } from '@/types/landing';

/**
 * ValuesTimeline Component
 * Feature: 002-engaging-landing-pages
 *
 * Timeline with stroke-dashoffset draw animation.
 * Designed via ui-ux skill for visual storytelling.
 */

// Default values
const defaultValues: ValueItem[] = [
  {
    title: 'Simplicity',
    description:
      'We believe powerful tools should be simple to use. Every feature is designed with clarity in mind.',
    icon: 'sparkle',
    order: 1,
  },
  {
    title: 'Privacy',
    description:
      'Your data belongs to you. We never sell your information and use end-to-end encryption.',
    icon: 'shield',
    order: 2,
  },
  {
    title: 'Focus',
    description:
      'We help you concentrate on what matters by removing distractions and noise.',
    icon: 'target',
    order: 3,
  },
  {
    title: 'Innovation',
    description:
      'We continuously improve and push boundaries to deliver the best productivity experience.',
    icon: 'rocket',
    order: 4,
  },
];

// Icon components
const icons: Record<string, React.ReactNode> = {
  sparkle: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  target: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  rocket: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
};

interface ValuesTimelineProps {
  values?: ValueItem[];
  className?: string;
}

const ValuesTimeline: React.FC<ValuesTimelineProps> = ({
  values = defaultValues,
  className,
}) => {
  const { ref, isInView } = useInView<HTMLElement>({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <section
      ref={ref}
      className={`${styles.valuesSection} ${className || ''} ${isInView ? styles.visible : ''}`}
      aria-labelledby="values-heading"
    >
      <div className={styles.valuesContent}>
        <h2 id="values-heading" className={styles.sectionTitle}>
          Our Core Values
        </h2>

        <div className={styles.timeline}>
          {/* Timeline Line */}
          <svg className={styles.timelineLine} viewBox="0 0 4 100%" preserveAspectRatio="none">
            <line
              x1="2"
              y1="0"
              x2="2"
              y2="100%"
              className={styles.timelineStroke}
            />
          </svg>

          {/* Value Items */}
          {values.map((value, index) => (
            <div
              key={value.title}
              className={styles.timelineItem}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className={styles.timelineNode}>
                <span className={styles.nodeIcon}>
                  {icons[value.icon] || icons.sparkle}
                </span>
              </div>
              <div className={styles.timelineCard}>
                <h3 className={styles.valueTitle}>{value.title}</h3>
                <p className={styles.valueDescription}>{value.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesTimeline;
