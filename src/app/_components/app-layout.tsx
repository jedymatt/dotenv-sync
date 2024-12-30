import { type PropsWithChildren } from "react";
import { UserNav } from "./user-nav";
import { auth } from "~/server/auth";
import { SessionProvider } from "next-auth/react";




export default async function AppLayout({ children }: PropsWithChildren) {
    const session = await auth();

    return (
      <div className="flex min-h-screen flex-col">
        <div className="border-b">
          <div className="flex justify-center">
            <div className="w-full max-w-screen-2xl border-x">
              <div className="flex h-16 items-center px-4">
                <div className="flex-1"></div>

                <SessionProvider session={session}>
                  <UserNav />
                </SessionProvider>
              </div>
            </div>
          </div>
        </div>
        <div className="flex h-full flex-1 justify-center">
          <div className="w-full max-w-screen-2xl border-x">{children}</div>
        </div>
      </div>
    );
}