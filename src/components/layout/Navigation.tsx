"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { menuFadeIn, menuLinkContainer, menuLinkItem } from "@/lib/animations";

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const links = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services/brand-strategy" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Navigation({ isOpen, onClose }: NavigationProps) {
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={navRef}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95"
          variants={menuFadeIn}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <button
            onClick={onClose}
            className="absolute top-8 right-8 flex items-center justify-center w-10 h-10 text-white"
            aria-label="Close menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <motion.nav
            className="flex flex-col items-center gap-6 px-16 py-16"
            variants={menuLinkContainer}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {links.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="text-4xl font-light text-white/80 uppercase tracking-widest hover:text-white transition-colors"
                variants={menuLinkItem}
                onClick={onClose}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
