"use client";
import logo from "@/assets/mamomamoLogo.png";
import { motion } from "motion/react";
import { logoPath } from "@/constants/logoPath";

const PATH_DURATION = 1.5;
const FADE_DELAY = PATH_DURATION + 0.5;
const LOGO_FADE_IN_DURATION = 0.8;
const FADE_OUT_DELAY = 1.0;
const COUNTER_ROTATION_START = FADE_DELAY + LOGO_FADE_IN_DURATION + FADE_OUT_DELAY;
const COUNTER_ROTATION_DURATION = 0.15;
const ROTATION_START = COUNTER_ROTATION_START + COUNTER_ROTATION_DURATION + 0.2;
const ROTATION_DURATION = 1.0;

export default function AnimatedIntro({ onComplete }: { onComplete?: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: ROTATION_START, duration: ROTATION_DURATION }}
      onAnimationComplete={onComplete}
    >
      <motion.div
        className="relative flex items-center justify-center"
        initial={{ scale: 1 }}
        animate={{ scale: 15 }}
        transition={{ delay: ROTATION_START, duration: ROTATION_DURATION, ease: "easeInOut" }}
      >
        <motion.div
          className="absolute w-45 h-45"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: FADE_DELAY, duration: 0.3 }}
        >
          <svg className="w-full h-full" viewBox="0 0 137.51854 67.610443">
            <g transform="translate(-36.795704,-102.3752)">
              <motion.path
                d={logoPath}
                fill="none"
                stroke="#FF9900"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: PATH_DURATION, ease: "easeInOut" }}
              />
            </g>
          </svg>
        </motion.div>
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, -15, 120] }}
          transition={{
            duration: COUNTER_ROTATION_DURATION + ROTATION_DURATION,
            times: [
              0,
              COUNTER_ROTATION_DURATION / (COUNTER_ROTATION_DURATION + ROTATION_DURATION),
              1,
            ],
            ease: ["easeInOut", "easeInOut"],
            delay: COUNTER_ROTATION_START,
          }}
        >
          <motion.img
            src={logo.src}
            alt=""
            className="w-45 h-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: LOGO_FADE_IN_DURATION, delay: FADE_DELAY }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
