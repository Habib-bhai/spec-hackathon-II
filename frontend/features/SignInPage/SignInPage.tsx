'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth-client';
import styles from './SignInPage.module.css';

interface FormData {
  email: string;
  password: string;
}

/**
 * Sign In Page Component
 *
 * Visually compelling authentication page with:
 * - Email and password form fields
 * - Loading and error states
 * - Creative design with depth and motion
 * - Responsive layout
 */
export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { data, error: signInError } = await signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        setError(signInError.message || 'Sign in failed. Please try again.');
        return;
      }

      if (data) {
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Background effects */}
      <div className={styles.background} />
      <div className={styles.spotlight} />
      <div className={styles.meteors} />

      <div className={styles.contentWrapper}>
        <div className={styles.card}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.titleWrapper}>
              <h1 className={styles.title}>Welcome Back</h1>
              <p className={styles.subtitle}>Sign in to continue to your workspace</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.fieldGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={styles.input}
                placeholder="you@example.com"
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={styles.input}
                placeholder="••••••••"
                disabled={isSubmitting}
              />
              <Link href="/forgot-password" className={styles.forgotLink}>
                Forgot password?
              </Link>
            </div>

            {error && (
              <div className={styles.error}>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.button}
            >
              {isSubmitting ? (
                <span className={styles.loadingText}>Signing in...</span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className={styles.footer}>
            <p className={styles.footerText}>
              Don't have an account?{' '}
              <Link href="/signup" className={styles.footerLink}>
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
