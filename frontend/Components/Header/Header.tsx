'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './header.module.css';
import { useScrollPosition } from '@/hooks';
import { useSession } from '@/lib/auth-client';
import { UserMenu } from '@/features/auth/UserMenu/UserMenu';
import type { HeaderProps, NavigationItem, CallToAction } from '@/types/landing';

/**
 * Header Component
 * Feature: 002-engaging-landing-pages
 *
 * Scroll-transform behavior (transparent → glass morphism), mobile menu with
 * cascade reveal animation, and underline draw effects on nav links.
 * Designed via ui-ux skill for seamless navigation experience.
 */

// Default navigation items
const defaultNavItems: NavigationItem[] = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Features', path: '/#features' },
  { label: 'Pricing', path: '/#pricing' },
];

// Default CTA
const defaultCta: CallToAction = {
  text: 'Get Started',
  href: '/signup',
  variant: 'primary',
};

interface HeaderComponentProps extends Partial<HeaderProps> {
  /** Custom className for styling overrides */
  className?: string;
}

const Header: React.FC<HeaderComponentProps> = ({
  navigationItems = defaultNavItems,
  ctaButton = defaultCta,
  className,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const { isScrolled } = useScrollPosition();
  const { data: session, isPending: isSessionLoading } = useSession();

  // Check if user is authenticated
  const isAuthenticated = !isSessionLoading && !!session?.user;

  // Mark component as mounted (for hydration)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const isActiveLink = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <header
      className={`
        ${styles.header}
        ${className || ''}
        ${isMounted && isScrolled ? styles.scrolled : ''}
      `}
      role="banner"
    >
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo} aria-label="Go to homepage">
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
                fill="url(#logo-gradient)"
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
                  id="logo-gradient"
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
          <span className={styles.logoText}>TaskFlow</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav} aria-label="Main navigation">
          <ul className={styles.navList}>
            {navigationItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`
                    ${styles.navLink}
                    ${isActiveLink(item.path) ? styles.navLinkActive : ''}
                  `}
                  aria-current={isActiveLink(item.path) ? 'page' : undefined}
                >
                  <span className={styles.navLinkText}>{item.label}</span>
                  <span className={styles.navLinkUnderline} />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop CTA / User Menu */}
        {isAuthenticated ? (
          <UserMenu />
        ) : (
          <Link href={ctaButton.href} className={styles.ctaButton}>
            {ctaButton.text}
          </Link>
        )}

        {/* Mobile Menu Button */}
        <button
          className={`${styles.mobileMenuButton} ${isMobileMenuOpen ? styles.menuOpen : ''}`}
          onClick={toggleMobileMenu}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        id="mobile-menu"
        className={`${styles.mobileMenuOverlay} ${isMobileMenuOpen ? styles.mobileMenuVisible : ''}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className={styles.mobileMenuContent}>
          <nav aria-label="Mobile navigation">
            <ul className={styles.mobileNavList}>
              {navigationItems.map((item, index) => (
                <li
                  key={item.path}
                  className={styles.mobileNavItem}
                  style={{
                    animationDelay: prefersReducedMotion
                      ? '0ms'
                      : `${150 + index * 50}ms`,
                  }}
                >
                  <Link
                    href={item.path}
                    className={`
                      ${styles.mobileNavLink}
                      ${isActiveLink(item.path) ? styles.mobileNavLinkActive : ''}
                    `}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-current={isActiveLink(item.path) ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile CTA / User Menu */}
          <div
            className={styles.mobileCta}
            style={{
              animationDelay: prefersReducedMotion
                ? '0ms'
                : `${150 + navigationItems.length * 50}ms`,
            }}
          >
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <Link
                href={ctaButton.href}
                className={styles.mobileCtaButton}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {ctaButton.text}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
