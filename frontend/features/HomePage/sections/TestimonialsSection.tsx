'use client';

import React, { useState } from 'react';
import styles from './sections.module.css';
import { useInView } from '@/hooks';
import type { Testimonial } from '@/types/landing';

/**
 * TestimonialsSection Component
 * Feature: 002-engaging-landing-pages
 *
 * Carousel with depth illusion (translateZ, scale, rotateY).
 * Designed via ui-ux skill for social proof display.
 */

// Default testimonials data
const defaultTestimonials: Testimonial[] = [
  {
    quote:
      "TaskFlow transformed how our team manages projects. We've seen a 40% increase in productivity since switching.",
    author: 'Sarah Chen',
    role: 'Product Manager',
    company: 'TechCorp',
  },
  {
    quote:
      "The intuitive design and powerful features make TaskFlow the best task management tool I've ever used.",
    author: 'Michael Roberts',
    role: 'Freelance Designer',
  },
  {
    quote:
      "Finally, a tool that adapts to my workflow instead of forcing me to change how I work. Absolutely love it!",
    author: 'Emily Watson',
    role: 'Startup Founder',
    company: 'Innovate Labs',
  },
  {
    quote:
      'The analytics features have given us incredible insights into our team performance. Game changer!',
    author: 'David Kim',
    role: 'Engineering Lead',
    company: 'CloudScale',
  },
];

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
  className?: string;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials = defaultTestimonials,
  className,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { ref, isInView } = useInView<HTMLElement>({
    threshold: 0.2,
    triggerOnce: true,
  });

  const handlePrev = () => {
    setActiveIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const getCardStyle = (index: number): React.CSSProperties => {
    const diff = index - activeIndex;
    const absDiff = Math.abs(diff);

    if (absDiff > 2) {
      return { display: 'none' };
    }

    const translateX = diff * 60;
    const translateZ = -absDiff * 100;
    const scale = 1 - absDiff * 0.15;
    const rotateY = diff * -5;
    const opacity = 1 - absDiff * 0.3;

    return {
      transform: `translateX(${translateX}%) translateZ(${translateZ}px) scale(${scale}) rotateY(${rotateY}deg)`,
      opacity,
      zIndex: 10 - absDiff,
    };
  };

  return (
    <section
      ref={ref}
      className={`${styles.testimonialsSection} ${className || ''} ${isInView ? styles.visible : ''}`}
      aria-labelledby="testimonials-heading"
    >
      <div className={styles.sectionContainer}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <h2 id="testimonials-heading" className={styles.sectionTitle}>
            Loved by teams worldwide
          </h2>
          <p className={styles.sectionSubtitle}>
            See what our users have to say about their experience with TaskFlow.
          </p>
        </div>

        {/* Carousel */}
        <div className={styles.carouselWrapper}>
          <div className={styles.carousel}>
            {testimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.author}-${index}`}
                className={`${styles.testimonialCard} ${index === activeIndex ? styles.active : ''}`}
                style={getCardStyle(index)}
                aria-hidden={index !== activeIndex}
              >
                <blockquote className={styles.testimonialQuote}>
                  <span className={styles.quoteIcon}>&ldquo;</span>
                  {testimonial.quote}
                </blockquote>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.authorAvatar}>
                    {testimonial.author.charAt(0)}
                  </div>
                  <div className={styles.authorInfo}>
                    <div className={styles.authorName}>{testimonial.author}</div>
                    <div className={styles.authorRole}>
                      {testimonial.role}
                      {testimonial.company && ` at ${testimonial.company}`}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className={styles.carouselNav}>
            <button
              className={styles.carouselButton}
              onClick={handlePrev}
              aria-label="Previous testimonial"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div className={styles.carouselDots}>
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.carouselDot} ${index === activeIndex ? styles.dotActive : ''}`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                  aria-current={index === activeIndex}
                />
              ))}
            </div>

            <button
              className={styles.carouselButton}
              onClick={handleNext}
              aria-label="Next testimonial"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
