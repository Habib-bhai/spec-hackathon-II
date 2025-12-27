import { AboutPage } from '@/features';
import type { Metadata } from 'next';

/**
 * About Page Route
 * Feature: 002-engaging-landing-pages
 *
 * Server Component wrapper that renders the AboutPage feature.
 */

export const metadata: Metadata = {
  title: 'About Us - TaskFlow',
  description:
    'Learn about our mission, values, and the team behind TaskFlow. We believe in the power of focus and building tools that respect your time.',
};

export default function About() {
  return <AboutPage />;
}
