import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ScreenShake({ trigger, children, intensity = 10 }) {
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShaking(true);
      const timer = setTimeout(() => setShaking(false), 500);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <motion.div
      animate={shaking ? {
        x: [0, -intensity, intensity, -intensity, intensity, 0],
        transition: { duration: 0.4 }
      } : {}}
    >
      {children}
    </motion.div>
  );
}