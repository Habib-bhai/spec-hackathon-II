'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/auth-client';
import styles from './SignUpPage.module.css';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

/**
 * Sign Up Page Component
 *
 * Visually compelling registration page with:
 * - Email, password, confirm password form fields
 * - Validation and error handling
 * - Creative design with depth and motion
 * - Responsive layout matching SignInPage aesthetic
 */
export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 8) {
      setValidationError('Password must be at least 8 characters');
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error: signUpError } = await signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name || formData.email.split('@')[0],
      });

      if (signUpError) {
        setError(signUpError.message || 'Sign up failed. Please try again.');
        return;
      }

      if (data) {
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed. Please try again.');
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
              <h1 className={styles.title}>Create Account</h1>
              <p className={styles.subtitle}>Start your productive journey today</p>
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
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={styles.input}
                placeholder="••••••••"
                disabled={isSubmitting}
              />
              <p className={styles.hint}>
                Must be at least 8 characters
              </p>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className={styles.input}
                placeholder="••••••••"
                disabled={isSubmitting}
              />
            </div>

            {validationError && (
              <div className={styles.validationError}>
                <span>{validationError}</span>
              </div>
            )}

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
                <span className={styles.loadingText}>Creating account...</span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className={styles.footer}>
            <p className={styles.footerText}>
              Already have an account?{' '}
              <Link href="/signin" className={styles.footerLink}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
