"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import styles from "./userMenu.module.css";

/**
 * UserMenu component - displays user info and sign out button.
 *
 * Shows user's name/email, avatar, profile link, and sign out functionality.
 */
export function UserMenu() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setIsSigningOut(false);
      setIsOpen(false);
    }
  };

  // Don't render if no session or still loading
  if (isPending || !session?.user) {
    return null;
  }

  const user = session.user;
  const displayName = user.name || user.email?.split("@")[0] || "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className={styles.container}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <span className={styles.avatar}>
          {user.image ? (
            <img src={user.image} alt={displayName} className={styles.avatarImage} />
          ) : (
            initial
          )}
        </span>
        <span className={styles.name}>{displayName}</span>
        <span className={styles.chevron}>{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{displayName}</span>
            {user.email && (
              <span className={styles.userEmail}>{user.email}</span>
            )}
          </div>
          <div className={styles.divider} />
          <Link
            href="/profile"
            className={styles.menuItem}
            onClick={() => setIsOpen(false)}
          >
            <span className={styles.menuIcon}>👤</span>
            Profile
          </Link>
          <Link
            href="/dashboard"
            className={styles.menuItem}
            onClick={() => setIsOpen(false)}
          >
            <span className={styles.menuIcon}>📋</span>
            Dashboard
          </Link>
          <div className={styles.divider} />
          <button
            className={styles.signOutButton}
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            {isSigningOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      )}
    </div>
  );
}
