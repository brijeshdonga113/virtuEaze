"use client";

import { usePathname } from "next/navigation";

/** Hides the global site chrome on standalone landing routes. */
export default function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (
    pathname.startsWith("/v2") ||
    pathname.startsWith("/navbar-demo") ||
    pathname.startsWith("/hero-preview")
  )
    return null;
  return <>{children}</>;
}
