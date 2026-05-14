import type { Transition, Variants } from 'motion/react';

// Spring presets
export const springSnappy: Transition = { type: 'spring', stiffness: 400, damping: 30 };
export const springGentle: Transition = { type: 'spring', stiffness: 260, damping: 25 };
export const springBouncy: Transition = { type: 'spring', stiffness: 300, damping: 20, mass: 0.8 };

// Stagger container
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.06,
    },
  },
};

// Individual card item
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.97 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: springGentle,
  },
};

// Section header
export const sectionHeader: Variants = {
  hidden: { opacity: 0, x: -8 },
  show: {
    opacity: 1, x: 0,
    transition: springGentle,
  },
};

// Fade up (general)
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: springGentle },
};

// Press scale
export const tapScale = { scale: 0.975 };
export const tapTransition: Transition = { type: 'spring', stiffness: 500, damping: 30 };

// Bottom sheet slide-up
export const slideUp: Variants = {
  hidden: { y: '100%' },
  show: { y: 0, transition: springBouncy },
  exit: { y: '100%', transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } },
};

// Fade backdrop
export const fadeBackdrop: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

// Page slide from right (iOS push)
export const pageSlideRight: Variants = {
  hidden: { x: '100%', opacity: 0.8 },
  show: { x: 0, opacity: 1, transition: springGentle },
  exit: { x: '100%', opacity: 0.8, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } },
};
