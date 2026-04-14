"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navigation } from "./Navigation";

interface TopbarProps {
  activeSection?: string;
}

export function Topbar({ activeSection }: TopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-[88px] transition-colors duration-500"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <a href="/" className="text-xl font-bold tracking-tight">
          Startle Labs
        </a>

        <button
          onClick={() => setMenuOpen(true)}
          className="relative z-50 flex flex-col items-center justify-center w-10 h-10 gap-1.5"
          aria-label="Open menu"
          aria-expanded={menuOpen}
        >
          <span className="block w-6 h-0.5 bg-current transition-transform" />
          <span className="block w-6 h-0.5 bg-current transition-transform" />
        </button>
      </motion.header>

      <Navigation isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
