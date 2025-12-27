import { Suspense } from "react";
import Link from "next/link";
import { SignInForm } from "@/features/auth/SignInForm/SignInForm";
import { SocialAuthButtons } from "@/features/auth/SocialAuthButtons/SocialAuthButtons";
import styles from "./page.module.css";

export const metadata = {
  title: "Sign In - TaskFlow",
  description: "Sign in to your TaskFlow account.",
};

function SignInFormWrapper() {
  return <SignInForm />;
}

export default function SignInPage() {
  return (
    <div className={styles.container}>
      <Suspense fallback={<div>Loading...</div>}>
        <SignInFormWrapper />
      </Suspense>

      <div className={styles.divider}>
        <div className={styles.dividerLine} />
        <span className={styles.dividerText}>or</span>
        <div className={styles.dividerLine} />
      </div>

      <SocialAuthButtons mode="signin" />

      <p className={styles.switchText}>
        Don&apos;t have an account?{" "}
        <Link href="/auth/sign-up" className={styles.link}>
          Sign up
        </Link>
      </p>
    </div>
  );
}
