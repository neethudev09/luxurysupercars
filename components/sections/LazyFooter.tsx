"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const Footer = dynamic(() => import("@/components/sections/Footer"));

export default function LazyFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/studio")) return null;
  return <Footer />;
}
