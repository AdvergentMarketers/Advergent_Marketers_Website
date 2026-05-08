"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ScrollParallaxProps {
  children: React.ReactNode;
  speed?: number; // Positive moves opposite to scroll, negative moves with scroll
  className?: string;
}

export function ScrollParallax({ children, speed = 1, className = "" }: ScrollParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Tracks the scroll position of this specific element as it enters/exits the viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Maps the scroll progress (0 to 1) to a Y-axis translation in pixels.
  // Hardware accelerated for 100/100 PageSpeed scores.
  const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}