"use client";

import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import React, { useCallback, useEffect, useRef } from "react";

export function MagicCard({
  children,
  className = "",
  gradientSize = 200,
  gradientFrom = "#9E7AFF",
  gradientTo = "#FE8BBB",
  borderSize = 2,
}) {
  const cardRef = useRef(null);
  const mouseX = useMotionValue(-gradientSize);
  const mouseY = useMotionValue(-gradientSize);

  const handleMouseMove = useCallback(
    (e) => {
      if (cardRef.current) {
        const { left, top } = cardRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
      }
    },
    [mouseX, mouseY]
  );

  useEffect(() => {
    const card = cardRef.current;
    if (card) {
      card.addEventListener("mousemove", handleMouseMove);
      return () => card.removeEventListener("mousemove", handleMouseMove);
    }
  }, [handleMouseMove]);

  return (
    <div ref={cardRef} className={`relative p-5 rounded-xl overflow-hidden ${className}`}>
      {/* Moving Border Effect */}
      <motion.div
        className="rounded-xl absolute inset-0 pointer-events-none"
        style={{
          border: `${borderSize}px solid transparent`,
          background: useMotionTemplate`
            radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, 
            ${gradientFrom}, 
            ${gradientTo}, 
            transparent 100%)
          `,
          maskImage: "linear-gradient(white, white) padding-box, linear-gradient(white, white)",
          maskComposite: "exclude",
          WebkitMaskImage: "linear-gradient(white, white) padding-box, linear-gradient(white, white)",
          WebkitMaskComposite: "xor",
        }}
      />
      {/* Card Content */}
      <div className="bg-gray-900 p-10 rounded-xl text-white relative">{children}</div>
    </div>
  );
}
