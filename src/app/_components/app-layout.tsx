import { SessionProvider } from "next-auth/react";
import Link from "next/link";
import { type PropsWithChildren } from "react";
import { ModeToggle } from "~/components/mode-toggle";
import { ThemeProvider } from "~/components/theme-provider";
import { Button } from "~/components/ui/button";
import { UserNav } from "./user-nav";

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex min-h-screen flex-col">
        <div className="border-b">
          <div className="flex justify-center">
            <div className="w-full max-w-screen-2xl border-x">
              <div className="flex h-16 items-center px-4">
                <div className="flex flex-1 items-center space-x-2">
                  <h1 className="cursor-default text-xl font-semibold">
                    DotEnv Sync
                  </h1>
                  <Button variant="ghost" asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                </div>
                <div className="mr-4">
                  <ModeToggle />
                </div>
                <SessionProvider>
                  <UserNav />
                </SessionProvider>
              </div>
            </div>
          </div>
        </div>
        <div className="flex h-full flex-1 justify-center">
          <div className="w-full max-w-screen-2xl border-x p-6">{children}</div>
        </div>
      </div>
    </ThemeProvider>
  );
}
