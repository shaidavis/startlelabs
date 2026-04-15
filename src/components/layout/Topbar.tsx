"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navigation } from "./Navigation";

export function Topbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-8 h-[72px] sm:h-[88px]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Semi-transparent white backdrop — consistent across all sections */}
        <div className="absolute inset-0 -z-10 bg-white/80 backdrop-blur-md" />

        {/* Logo: star icon + STARTLE LABS text */}
        <a href="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/images/startle-logo-icon.svg"
            alt=""
            className="h-8 sm:h-10 w-auto"
          />
          <img
            src="/images/startle-logo-text.svg"
            alt="Startle Labs"
            className="h-6 sm:h-8 w-auto"
          />
        </a>

        {/* Center space — TopNav icons from FullscreenScroller overlay here at z-[55] */}
        <div className="flex-1" />

        {/* Right side: Yalla button + hamburger */}
        <div className="flex items-center gap-4 shrink-0">
          <a
            href="/contact"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#230F2C] text-[#230F2C] text-sm font-medium tracking-wide hover:bg-[#230F2C] hover:text-white transition-colors"
          >
            Yalla
            {/* Send / paper-plane icon */}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 1L6 8" />
              <path d="M13 1L9 13l-3-5-5-3L13 1z" />
            </svg>
          </a>

          <button
            onClick={() => setMenuOpen(true)}
            className="relative z-50 flex flex-col items-center justify-center w-10 h-10 gap-1.5"
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <span className="block w-6 h-0.5 bg-[#230F2C] transition-transform" />
            <span className="block w-6 h-0.5 bg-[#230F2C] transition-transform" />
          </button>
        </div>
      </motion.header>

      <Navigation isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
