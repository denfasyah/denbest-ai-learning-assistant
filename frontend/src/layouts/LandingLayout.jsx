import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

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
