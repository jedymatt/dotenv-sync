import { SessionProvider } from "next-auth/react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { auth } from "~/server/auth";

export default async function VerifyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  if (!session) {
    return (
      <div>
        <h1>Verify Device</h1>
        <p>You need to be signed in to verify your device.</p>
        <div>
          <Button asChild>
            <Link href="/api/auth/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <SessionProvider session={session}>{children}</SessionProvider>;
}
