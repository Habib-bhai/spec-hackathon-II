'use client';

/**
 * GSAP Registration Module
 *
 * Centralizes GSAP plugin registration and exports for the entire application.
 * Import from '@/lib/gsap' to access gsap, ScrollTrigger, and useGSAP.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register plugins only in browser environment (SSR-safe)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// Export all GSAP utilities
export { gsap, ScrollTrigger, useGSAP };

// Types are inferred from the gsap module

