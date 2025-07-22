import React from 'react';
import './Footer.css';
import { motion } from 'framer-motion';

const Footer: React.FC = () => (
  <motion.footer
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1.2, delay: 0.2 }}
  >
    <p>That's All Folks!</p>
  </motion.footer>
);

export default Footer; 