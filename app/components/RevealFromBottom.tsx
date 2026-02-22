"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function RevealFromBottom({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{
        y: 80,
        opacity: 0,
        scale: 0.98,
      }}
      whileInView={{
        y: 0,
        opacity: 1,
        scale: 1,
      }}
      transition={{
        duration: 1,
        ease: [0.22, 1, 0.36, 1], // easing premium
      }}
      viewport={{
        once: false,
        amount: 0.2,
      }}
    >
      {children}
    </motion.div>
  );
}