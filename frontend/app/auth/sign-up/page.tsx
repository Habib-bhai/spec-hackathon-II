import Link from "next/link";
import { SignUpForm } from "@/features/auth/SignUpForm/SignUpForm";
import { SocialAuthButtons } from "@/features/auth/SocialAuthButtons/SocialAuthButtons";
import styles from "./page.module.css";

export const metadata = {
  title: "Sign Up - TaskFlow",
  description: "Create your TaskFlow account to start organizing your tasks.",
};

export default function SignUpPage() {
  return (
    <div className={styles.container}>
      <SignUpForm />

      <div className={styles.divider}>
        <div className={styles.dividerLine} />
        <span className={styles.dividerText}>or</span>
        <div className={styles.dividerLine} />
      </div>

      <SocialAuthButtons mode="signup" />

      <p className={styles.switchText}>
        Already have an account?{" "}
        <Link href="/auth/sign-in" className={styles.link}>
          Sign in
        </Link>
      </p>
    </div>
  );
}
