"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

/**
 * Site geneline yayılan, çok düşük opaklıklı neon "ışık hüzmeleri" + glow.
 * - Sober: opacity düşük, blur yüksek, hareket yavaş
 * - Scroll ile hafif parallax
 * - prefers-reduced-motion => statik
 */
export function AmbientBackground() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const x1 = useTransform(scrollYProgress, [0, 1], [0, 18]);
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -12]);
  const x2 = useTransform(scrollYProgress, [0, 1], [0, -14]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 16]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-zinc-950"
    >
      {/* Base soft glow field */}
      <motion.div
        className="absolute -inset-24 opacity-[0.045] blur-3xl [background:radial-gradient(circle_at_18%_25%,rgba(168,85,247,0.95),transparent_55%),radial-gradient(circle_at_72%_18%,rgba(34,211,238,0.85),transparent_58%),radial-gradient(circle_at_82%_72%,rgba(34,197,94,0.65),transparent_60%),radial-gradient(circle_at_30%_78%,rgba(59,130,246,0.75),transparent_62%)]"
        style={reduce ? undefined : { x: x1, y: y1 }}
        animate={
          reduce
            ? undefined
            : {
                rotate: [0, 0.8, 0],
              }
        }
        transition={
          reduce
            ? undefined
            : { duration: 22, ease: "easeInOut", repeat: Infinity }
        }
      />

      {/* Light beams */}
      <motion.div
        className="absolute -left-1/3 top-[-20%] h-[140%] w-[60%] opacity-[0.04] blur-2xl [background:linear-gradient(110deg,transparent,rgba(34,211,238,0.85),transparent)]"
        style={reduce ? undefined : { x: x2, y: y2, rotate: -8 }}
        animate={
          reduce
            ? undefined
            : {
                x: [0, 14, 0],
              }
        }
        transition={
          reduce
            ? undefined
            : { duration: 18, ease: "easeInOut", repeat: Infinity }
        }
      />

      <motion.div
        className="absolute -right-1/3 top-[-15%] h-[140%] w-[55%] opacity-[0.035] blur-2xl [background:linear-gradient(250deg,transparent,rgba(168,85,247,0.9),transparent)]"
        style={reduce ? undefined : { x: x1, y: y2, rotate: 10 }}
        animate={
          reduce
            ? undefined
            : {
                x: [0, -12, 0],
              }
        }
        transition={
          reduce
            ? undefined
            : { duration: 20, ease: "easeInOut", repeat: Infinity }
        }
      />

      {/* Vignette for sobriety */}
      <div className="absolute inset-0 [background:radial-gradient(circle_at_50%_20%,transparent_0%,rgba(0,0,0,0.35)_55%,rgba(0,0,0,0.7)_100%)]" />
    </div>
  );
}

