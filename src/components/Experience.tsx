import React from 'react';
import './Experience.css';
import { motion } from 'framer-motion';

const experiences = [
  {
    company: 'STYLEBOT',
    title: 'Software Engineering Intern',
    date: 'April 2025 - Present',
    location: 'Los Angeles, California',
    bullets: [
      'Owned end-to-end development of a proprietary, rule-based NLP engine in Python, from architecture to integration, providing a core feature utilized by over 20 major corporate clients.',
      'Developed and maintained supporting service infrastructure (Node.js router, MongoDB database, RESTful API) for seamless, real-time analysis to thousands of enterprise users.'
    ]
  },
  {
    company: 'UNIVERSITY OF SOUTHERN CALIFORNIA',
    title: 'Volunteer Research Assistant',
    date: 'February 2025 - May 2025',
    location: 'Los Angeles, California',
    bullets: [
      'Conceptualized and developed an AI-powered mental health chatbot using a fine-tuned Mixture of Experts (MOE) architecture (Mistral-7B), achieving a 3-4 second average response time.',
      "Improved model empathy and reasoning by 30% by conducting user research on engineering students' mental health and curating domain-specific datasets."
    ]
  },
  {
    company: 'INDIAN INSTITUTE OF SCIENCE',
    title: 'AI Research Intern',
    date: 'October 2023 - May 2024',
    location: 'Bangalore, India',
    bullets: [
      'Engineered a novel pose detection model for Kreed.ai platform by pioneering India\'s first medically accurate dataset (>10,000 images in traditional attire) and developing a Python workflow that accelerated data collection by 85%.',
      'Led a team of 4 interns to scale and optimize the model, driving enhanced performance by implementing a structured, iterative testing and feedback process with over 50 active test participants.'
    ]
  }
];

const Experience: React.FC = () => (
  <ul className="experience-list">
    {experiences.map((exp, idx) => (
      <motion.li
        key={idx}
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, delay: idx * 0.15 }}
      >
        <h3 style={{ color: '#f2583f' }}>{exp.title} @ {exp.company}</h3>
        <span style={{ color: '#fff' }}>{exp.date} | {exp.location}</span>
        <ul>
          {exp.bullets.map((b, i) => <li key={i} style={{ color: '#fff' }}>{b}</li>)}
        </ul>
      </motion.li>
    ))}
  </ul>
);

export default Experience; 