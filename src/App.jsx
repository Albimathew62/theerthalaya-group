import Header from './components/Header';
import Hero from './components/Hero';
import Footprint from './components/Footprint';
import Philosophy from './components/Philosophy';
import Subsidiaries from './components/Subsidiaries';
import ExpertServices from './components/ExpertServices';
import ShowcaseMarquee from './components/ShowcaseMarquee';
import About from './components/About';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import ContactCTA from './components/ContactCTA';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <main>
        <Hero />
        <Footprint />
        <Philosophy />
        <Subsidiaries />
        <ExpertServices />
        <ShowcaseMarquee />
        <About />
        <Testimonials />
        <FAQ />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
