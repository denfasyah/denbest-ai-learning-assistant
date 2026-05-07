import LandingLayout from '../../layouts/LandingLayout';
import Hero from '../../components/landing/Hero';
import Features from '../../components/landing/Features';
import HowItWorks from '../../components/landing/HowItWorks';
import About from '../../components/landing/About';
import Contact from '../../components/landing/Contact';

const LandingPage = () => {
  return (
    <LandingLayout>
      <Hero />
      <Features />
      <HowItWorks />
      <About />
      <Contact />
    </LandingLayout>
  );
};

export default LandingPage;
