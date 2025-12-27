"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from "./profile.module.css";

/**
 * Profile Page
 *
 * Displays authenticated user's profile information:
 * - Email address
 * - Display name
 * - Account creation date
 * - Profile avatar/initial
 */
export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/auth/sign-in?returnUrl=/profile");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const user = session.user;
  const displayName = user.name || user.email?.split("@")[0] || "User";
  const initial = displayName.charAt(0).toUpperCase();
  const createdAt = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  return (
    <div className={styles.container}>
      <div className={styles.background} />

      <div className={styles.content}>
        <div className={styles.profileCard}>
          {/* Avatar */}
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>
              {user.image ? (
                <img
                  src={user.image}
                  alt={displayName}
                  className={styles.avatarImage}
                />
              ) : (
                <span className={styles.avatarInitial}>{initial}</span>
              )}
            </div>
            <h1 className={styles.displayName}>{displayName}</h1>
          </div>

          {/* Profile Details */}
          <div className={styles.detailsSection}>
            <div className={styles.detailGroup}>
              <label className={styles.detailLabel}>Email</label>
              <p className={styles.detailValue}>{user.email || "Not provided"}</p>
            </div>

            <div className={styles.detailGroup}>
              <label className={styles.detailLabel}>Display Name</label>
              <p className={styles.detailValue}>{displayName}</p>
            </div>

            <div className={styles.detailGroup}>
              <label className={styles.detailLabel}>Member Since</label>
              <p className={styles.detailValue}>{createdAt}</p>
            </div>

            <div className={styles.detailGroup}>
              <label className={styles.detailLabel}>Email Verified</label>
              <p className={styles.detailValue}>
                {user.emailVerified ? (
                  <span className={styles.verified}>✓ Verified</span>
                ) : (
                  <span className={styles.unverified}>Not verified</span>
                )}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className={styles.actionsSection}>
            <button
              onClick={() => router.push("/dashboard")}
              className={styles.primaryButton}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
