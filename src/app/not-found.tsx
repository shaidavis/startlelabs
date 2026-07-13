import Link from "next/link";

/**
 * 404 — uses the same light-lavender surface as the inner pages so the
 * Topbar's ink-colored controls (logo, Yalla!, hamburger) stay legible.
 * On the old #0a0a0a background they sat at ~1.1:1 contrast — invisible.
 */
export default function NotFound() {
  return (
    <section
      className="flex flex-col items-center justify-center min-h-[100vh] px-8 text-center"
      style={{ backgroundColor: "#f2f1fa", color: "#230F2C" }}
    >
      <h1 className="font-headline text-8xl mb-4">404</h1>
      <p className="text-xl mb-8" style={{ color: "#230F2Cb3" }}>
        This page doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="px-8 py-4 bg-[#230F2C] text-[#E9C402] font-medium rounded-full hover:opacity-90 transition-opacity"
      >
        Back to Home
      </Link>
    </section>
  );
}
