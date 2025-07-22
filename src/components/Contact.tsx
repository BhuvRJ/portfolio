import React from 'react';
import './Contact.css';
import { motion } from 'framer-motion';
import resumePDF from '../assets/Bhuvan_resume_july.pdf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';

const Contact: React.FC = () => (
  <section id="contact">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7 }}
    >
      <h3 style={{ color: '#f2583f' }}>Contact</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.2rem', margin: '1.5rem 0' }}>
        <a href="mailto:rajanaha@usc.edu" className="contact-btn" style={buttonStyle}>
          <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: 8 }} />Email
        </a>
        <a href="https://www.linkedin.com/in/bhuvan-rajanahally-jayakumar" className="contact-btn" style={buttonStyle} target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faLinkedin} style={{ marginRight: 8 }} />LinkedIn
        </a>
        <a href="https://github.com/BHUVAN-RJ" className="contact-btn" style={buttonStyle} target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faGithub} style={{ marginRight: 8 }} />GitHub
        </a>
        <a href={resumePDF} className="contact-btn" style={buttonStyle} target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faFilePdf} style={{ marginRight: 8 }} />Resume
        </a>
      </div>
      <p style={{ color: '#fff' }}>Feel free to reach out for opportunities, collaborations, or just to connect!</p>
    </motion.div>
  </section>
);

const buttonStyle: React.CSSProperties = {
  background: '#f2583f',
  color: '#fff',
  padding: '0.7rem 1.5rem',
  borderRadius: '8px',
  fontWeight: 600,
  fontSize: '1.1rem',
  textDecoration: 'none',
  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
  transition: 'background 0.2s, color 0.2s, transform 0.2s',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
};

export default Contact; 