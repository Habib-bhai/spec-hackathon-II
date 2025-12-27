import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Dashboard layout - protected layout for authenticated pages.
 *
 * This is a Server Component that checks session on the server side.
 * If the user is not authenticated, they are redirected to the sign-in page.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check session on server
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect to sign-in if not authenticated
  if (!session) {
    redirect("/auth/sign-in?returnUrl=/dashboard");
  }

  return <>{children}</>;
}
