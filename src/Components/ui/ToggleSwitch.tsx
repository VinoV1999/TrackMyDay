"use client";
import { motion } from "framer-motion";

interface ToggleSwitchProps {
  value: boolean; // true = rightLabel, false = leftLabel
  onChange: (val: boolean) => void;
  leftLabel: string;
  rightLabel: string
}

export default function ToggleSwitch({
  value,
  onChange,
  leftLabel,
  rightLabel
}: ToggleSwitchProps) {
  return (
    <div onClick={() => onChange(!value)} className="flex items-center gap-4 hover:cursor-pointer">
      {/* Left Label */}
      <span
        className={`text-xl md:text-sm font-semibold ${
          !value ? "text-brand-700" : "text-gray-400"
        }`}
      >
        {leftLabel}
      </span>

      {/* Toggle Switch */}
      <div
        className="relative w-7 h-2 bg-gradient-to-r from-brand-100 to-brand-200 rounded-full cursor-pointer shadow-inner select-none"
      >
        {/* Outer Knob (1x size) */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          animate={{
            x: value ? "70%" : "0%",
          }}
          className="absolute -top-1 -translate-y-1/2 w-4 h-4 bg-brand-400 rounded-full shadow-lg flex items-center justify-center"
        >
        </motion.div>
      </div>

      {/* Right Label */}
      <span
        className={`text-xl md:text-sm font-semibold ${
          value ? "text-brand-700" : "text-gray-400"
        }`}
      >
        {rightLabel}
      </span>
    </div>
  );
}
