"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function FixedBackgroundCanvas() {
  const { scrollYProgress } = useScroll();

  // Mathematical Transforms for 2.5D Parallax
  // useTransform(value, [inputRange], [outputRange])
  
  // Shape 1: Accent Blue Solid Polygon (Moves down, sweeps left gently, rotates)
  const y1 = useTransform(scrollYProgress, [0, 1], ["0vh", "150vh"]);
  const x1 = useTransform(scrollYProgress, [0, 0.4, 0.85], ["0vw", "-40vw", "-20vw"]); // Cut the x-axis movement in half
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const scale1 = useTransform(scrollYProgress, [0.65, 0.85], [1, 15]);

// Shape 2: Matte Black Stroke Box (Moves up slowly, drifts horizontally, rotates backward)
  const y2 = useTransform(scrollYProgress, [0, 1], ["20vh", "-50vh"]);
  const x2 = useTransform(scrollYProgress, [0, 0.5, 1], ["0vw", "15vw", "-5vw"]); // The variable X-axis sweep
  const rotate2 = useTransform(scrollYProgress, [0, 1], [45, -180]);

  // Shape 3: Blurred Blue Accent (Ambient depth)
  const y3 = useTransform(scrollYProgress, [0, 1], ["40vh", "100vh"]);
  
// Shape 4: Expanding Core for CTA (Section 5)
  // Shifts the animation to start earlier and finish before the footer
  const opacity4 = useTransform(scrollYProgress, [0.65, 0.8], [0, 1]); 
  const scale4 = useTransform(scrollYProgress, [0.65, 0.85], [0.5, 20]);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      
      {/* Faint Graph/Grid Background (Section 1 specific, fades out slightly on scroll) */}
      <motion.div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #1A1A1A 1px, transparent 1px),
            linear-gradient(to bottom, #1A1A1A 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem',
          opacity: useTransform(scrollYProgress, [0, 0.3], [0.03, 0])
        }}
      />

      {/* Floating 2.5D Shapes */}
      
      {/* Shape 1: Blue Solid */}
      <motion.div 
        style={{ x: x1, y: y1, rotate: rotate1, scale: scale1 }}
        className="absolute right-[10%] top-[-10%] w-32 h-32 bg-accentBlue rounded-3xl opacity-80"
      />

      {/* Shape 2: Black Stroke Box */}
      <motion.div 
        style={{ x: x2, y: y2, rotate: rotate2 }}
        className="absolute left-[15%] top-[30%] w-48 h-48 border-[3px] border-matteBlack rounded-xl opacity-20"
      />

      {/* Shape 3: Ambient Blue Blur */}
      <motion.div 
        style={{ y: y3 }}
        className="absolute left-[40%] top-[60%] w-96 h-96 bg-accentBlue/10 blur-[80px] rounded-full"
      />

      {/* Shape 4: The CTA Expansion wave (Hidden until the bottom) */}
      <motion.div 
        style={{ opacity: opacity4, scale: scale4 }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-64 h-64 bg-accentBlue rounded-full"
      />

    </div>
  );
}