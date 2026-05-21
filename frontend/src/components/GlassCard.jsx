import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', hoverEffect = true, delay = 0, ...props }) => {
  const CardContent = (
    <div
      className={`glass-card rounded-2xl p-6 border transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );

  if (hoverEffect) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
        whileHover={{ 
          y: -4, 
          boxShadow: '0 12px 40px 0 rgba(139, 92, 246, 0.08)',
          borderColor: 'rgba(139, 92, 246, 0.2)' 
        }}
      >
        {CardContent}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      {CardContent}
    </motion.div>
  );
};

export default GlassCard;
