"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { cn } from "~/lib/utils";

export default function Sidebar() {
  const params = useParams();
  const pathName = usePathname();

  const projectId = params.id as string;

  const links = [
    { href: `/projects/${projectId}`, label: "General" },
    { href: `/projects/${projectId}/settings`, label: "Settings" },
  ];

  return (
    <div className="w-full space-y-1 py-12">
      {links.map((link, index) => (
        <div key={index}>
          <Link
            href={link.href}
            className={cn(
              "block w-full rounded-md px-4 py-2 transition hover:bg-accent hover:text-accent-foreground text-sm",
              link.href === pathName && "bg-accent text-accent-foreground font-medium",
            )}
          >
            {link.label}
          </Link>
        </div>
      ))}
    </div>
  );
}
