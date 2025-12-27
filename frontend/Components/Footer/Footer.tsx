'use client';

import React from 'react';
import Link from 'next/link';
import styles from './footer.module.css';
import { useInView } from '@/hooks';
import type { FooterProps, FooterLinkGroup, NavigationItem } from '@/types/landing';

/**
 * Footer Component
 * Feature: 002-engaging-landing-pages
 *
 * Rising reveal animation with staggered columns and social media micro-animations.
 * Designed via ui-ux skill for brand closure.
 */

// Default link groups
const defaultLinkGroups: FooterLinkGroup[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features', path: '/#features' },
      { label: 'Pricing', path: '/#pricing' },
      { label: 'Integrations', path: '/integrations' },
      { label: 'Changelog', path: '/changelog' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', path: '/about' },
      { label: 'Blog', path: '/blog' },
      { label: 'Careers', path: '/careers' },
      { label: 'Press', path: '/press' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', path: '/docs' },
      { label: 'Help Center', path: '/help' },
      { label: 'Community', path: '/community' },
      { label: 'API Reference', path: '/api' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', path: '/privacy' },
      { label: 'Terms', path: '/terms' },
      { label: 'Security', path: '/security' },
      { label: 'Cookies', path: '/cookies' },
    ],
  },
];

// Default social links
const defaultSocialLinks: NavigationItem[] = [
  { label: 'Twitter', path: 'https://twitter.com', icon: 'twitter', external: true },
  { label: 'GitHub', path: 'https://github.com', icon: 'github', external: true },
  { label: 'LinkedIn', path: 'https://linkedin.com', icon: 'linkedin', external: true },
  { label: 'Discord', path: 'https://discord.com', icon: 'discord', external: true },
];

// Social icons
const socialIcons: Record<string, React.ReactNode> = {
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  discord: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  ),
};

interface FooterComponentProps extends Partial<FooterProps> {
  className?: string;
}

const Footer: React.FC<FooterComponentProps> = ({
  linkGroups = defaultLinkGroups,
  socialLinks = defaultSocialLinks,
  companyName = 'TaskFlow',
  className,
}) => {
  const { ref, isInView } = useInView<HTMLElement>({
    threshold: 0.1,
    triggerOnce: true,
  });

  const currentYear = new Date().getFullYear();

  return (
    <footer
      ref={ref}
      className={`${styles.footer} ${className || ''} ${isInView ? styles.visible : ''}`}
      role="contentinfo"
    >
      <div className={styles.footerContainer}>
        {/* Brand Section */}
        <div className={styles.brandSection}>
          <Link href="/" className={styles.footerLogo}>
            <span className={styles.logoIcon}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="2"
                  y="2"
                  width="28"
                  height="28"
                  rx="8"
                  fill="url(#footer-logo-gradient)"
                />
                <path
                  d="M10 16L14 20L22 12"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient
                    id="footer-logo-gradient"
                    x1="2"
                    y1="2"
                    x2="30"
                    y2="30"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="hsl(var(--landing-primary))" />
                    <stop offset="1" stopColor="hsl(var(--landing-accent))" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <span className={styles.logoText}>{companyName}</span>
          </Link>
          <p className={styles.brandTagline}>
            Organize your life, one task at a time.
          </p>

          {/* Social Links */}
          <div className={styles.socialLinks}>
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.path}
                className={styles.socialLink}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                aria-label={link.label}
              >
                {link.icon && socialIcons[link.icon]}
              </a>
            ))}
          </div>
        </div>

        {/* Link Columns */}
        <div className={styles.linkColumns}>
          {linkGroups.map((group, index) => (
            <div
              key={group.title}
              className={styles.linkColumn}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h3 className={styles.columnTitle}>{group.title}</h3>
              <ul className={styles.linkList}>
                {group.links.map((link) => (
                  <li key={link.path}>
                    <Link href={link.path} className={styles.footerLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomContent}>
          <p className={styles.copyright}>
            <span className={styles.copyrightLine} />
            &copy; {currentYear} {companyName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
