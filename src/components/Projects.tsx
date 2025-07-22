import React from 'react';
import './Projects.css';
import { motion } from 'framer-motion';

const projects = [
  {
    title: 'Monkey Deterrence System',
    date: 'October 2022 - January 2023',
    description: 'Pioneered an autonomous monkey deterrence system using YOLOv5 and a Jetson Nano, preventing thousands in local coffee harvest losses by managing the complete project lifecycle.',
    link: 'https://github.com/BHUVAN-RJ/Monkey_deturrence_system'
  },
  {
    title: 'Google Summer of Code 2022 - Plone Foundation',
    date: 'April 2022 - September 2022',
    description: 'Spearheaded complete modernization of a key Plone 6 add-on by migrating entire codebase to Python 3, boosting test coverage by 60% with over 50 new tests, and implementing multilingual support to expand its global reach by 50%.',
    link: 'https://medium.com/@bhuvanrj73/google-summer-of-code-2021-final-work-summary-ae11269a576b'
  }
];

const Projects: React.FC = () => (
  <div className="projects-grid">
    {projects.map((proj, idx) => (
      <motion.div
        className="project-card"
        key={idx}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, delay: idx * 0.15 }}
      >
        <h3 style={{ color: '#f2583f' }}>{proj.title}</h3>
        <span style={{ color: '#fff' }}>{proj.date}</span>
        <p style={{ color: '#fff' }}>{proj.description}</p>
        <a href={proj.link} target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>View Project</a>
      </motion.div>
    ))}
  </div>
);

export default Projects; 