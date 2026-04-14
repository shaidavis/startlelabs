import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] px-8 text-center">
      <h1 className="text-8xl font-bold mb-4 text-neutral-800">404</h1>
      <p className="text-xl text-neutral-400 mb-8">
        This page doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-neutral-200 transition-colors"
      >
        Back to Home
      </Link>
    </section>
  );
}
