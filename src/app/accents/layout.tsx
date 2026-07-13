import type { Metadata } from "next";

// /accents is an internal design-reference page (accent + icon library).
// Keep it reachable for the team but out of search indexes.
export const metadata: Metadata = {
  title: "Accent Library — Startle Labs",
  robots: { index: false, follow: false },
};

export default function AccentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
