import Header from '../components/Header';
import Hero from '../components/Hero';
import Products from '../components/Products';
import CustomOrder from '../components/CustomOrder';
import About from '../components/About';
import Corporate from '../components/Corporate';
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
        <CustomOrder />
        <About />
        <Corporate />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
