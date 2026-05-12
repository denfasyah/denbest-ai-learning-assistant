import Navbar from '../layouts/components/NavbarLanding';
import Footer from '../layouts/components/FooterLanding';

const LandingLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default LandingLayout;
