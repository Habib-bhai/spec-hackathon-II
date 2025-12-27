"use client";

import styles from "./auth.module.css";

/**
 * Auth layout - clean layout for authentication pages.
 * No navigation header for a focused sign-in/sign-up experience.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.logoSection}>
          <h1 className={styles.logo}>TaskFlow</h1>
          <p className={styles.tagline}>Organize Your Life, One Task at a Time</p>
        </div>
        {children}
      </div>
    </div>
  );
}
