"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function RevealScale({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.96,
        filter: "blur(6px)",
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
      }}
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
    >
      {children}
    </motion.div>
  );
}