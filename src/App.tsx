import React from 'react';
import { motion } from 'framer-motion';
import Nav from './components/Nav';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import profileImg from './assets/1000098955.png';

const App: React.FC = () => {
  return (
    <>
      <Nav />
      <main>
        {/* Hero + About Section (joined, with image) */}
        <section id="hero-about" style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '0 0 180px', minWidth: 180, maxWidth: 220, width: '100%' }}>
            <img src={profileImg} alt="Bhuvan Rajanahally Jayakumar" style={{ width: '110%', borderRadius: '15%', boxShadow: '0 4px 24px rgba(0,0,0,0.18)' }} />
          </div>
          <motion.div style={{ flex: 1, minWidth: 260 }} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1>Bhuvan Rajanahally Jayakumar</h1>
            <h2 style={{ color: '#fff', fontWeight: 400 }}>Master's Student in Computer Science | Software Engineer</h2>
            <p style={{ color: '#fff' }}>Email: rajanaha@usc.edu</p>
            <div style={{ marginTop: '2rem' }}>
              <p style={{ color: '#fff' }}>Hello! I'm Bhuvan, a Master's student in Computer Science at the University of Southern California with a strong foundation in software engineering and AI/ML. I'm passionate about building innovative solutions and have experience in developing NLP engines, AI-powered chatbots, and pose detection models. My goal is to leverage my technical skills to create impactful technologies.</p>
            </div>
          </motion.div>
        </section>
        {/* Experience Section */}
        <section id="experience">
          <Experience />
        </section>
        {/* Projects Section */}
        <section id="projects">
          <Projects />
        </section>
        {/* Skills Section */}
        <section id="skills">
          <Skills />
        </section>
        {/* Contact Section */}
        <section id="contact">
          <Contact />
        </section>
      </main>
      <Footer />
    </>
  );
};

export default App;
