"use client";
import { motion } from "framer-motion";

export const FadeIn = ({ children, delay = 0, duration = 0.5, className = "" }: { children: React.ReactNode, delay?: number, duration?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration, delay, ease: [0.25, 0.25, 0, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);