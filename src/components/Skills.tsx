import React from 'react';
import './Skills.css';
import { motion } from 'framer-motion';

const skills = {
  'Development': ['Python', 'HTML/CSS', 'SQL', 'API Development', 'C++', 'Javascript', 'MongoDB', 'Node.js'],
  'ML and AI': ['Deep Learning', 'Pandas', 'Numpy', 'Scikit-learn', 'Tensorflow', 'Transformers', 'Keras'],
  'Tools': ['PyCharm', 'Unix-OS', 'Git', 'Flask', 'VS Code', 'AWS']
};

const Skills: React.FC = () => (
  <div className="skills-list">
    {Object.entries(skills).map(([category, items], idx) => (
      <motion.div
        key={category}
        className="skills-category"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, delay: idx * 0.15 }}
      >
        <h3 style={{ color: '#f2583f' }}>{category}</h3>
        <ul>
          {items.map((skill) => <li key={skill} style={{ color: '#fff' }}>{skill}</li>)}
        </ul>
      </motion.div>
    ))}
  </div>
);

export default Skills; 