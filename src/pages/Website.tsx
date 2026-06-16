import Header from '../components/Header';
import Hero from '../components/Hero';
import Products from '../components/Products';
import Corporate from '../components/Corporate';
import CustomOrder from '../components/CustomOrder';
import Testimonials from '../components/Testimonials';
import About from '../components/About';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';

export default function Website() {
  return (
    <div className="min-h-screen bg-royal-bg">
      <Header />
      <main>
        <Hero />
        <Products />
        <Corporate />
        <CustomOrder />
        <Testimonials />
        <About />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
