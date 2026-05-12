import LandingLayout from '../../layouts/LandingLayout';
import Hero from '../../features/landing/components/Hero';
import Features from '../../features/landing/components/Features';
import HowItWorks from '../../features/landing/components/HowItWorks';
import About from '../../features/landing/components/About';
import Contact from '../../features/landing/components/Contact';

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
