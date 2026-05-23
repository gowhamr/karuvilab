"use client";

import { m } from "framer-motion";

interface BackdropProps {
  onClick: () => void;
  opacity?: any; // MotionValue
}

export function Backdrop({ onClick, opacity }: BackdropProps) {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ opacity }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden"
      onClick={onClick}
    />
  );
}
