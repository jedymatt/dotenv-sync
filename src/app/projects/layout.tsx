import { type PropsWithChildren } from "react";
import AppLayout from "~/app/_components/app-layout";
import Sidebar from "./_components/sidebar";

export default function ProjectLayout({ children }: PropsWithChildren) {
  return (
    <AppLayout>
      <div className="grid max-w-screen-2xl grid-cols-6 space-x-6">
        <Sidebar />
        <div className="col-span-5">{children}</div>
      </div>
    </AppLayout>
  );
}
