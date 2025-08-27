
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { About } from './components/About';
import { ServicesSection } from './components/ServicesSection';
import { Footer } from './components/Footer';
import { generateAgencyContent } from './services/geminiService';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tagline, setTagline] = useState<string>('Vivez une expérience inoubliable au Maroc.');
  const aboutText = "Nous concevons des séjours sur-mesure, invitant jeunes adultes, couples et voyageurs internationaux à découvrir des facettes exclusives du pays. Accédez à des activités uniques, loin des sentiers battus, pour une immersion authentique et élégante.";
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const content = await generateAgencyContent();
      if (content) {
        setTagline(content.tagline);
      }
    } catch (err) {
      console.error("Failed to fetch AI content:", err);
      setError("Erreur de chargement du contenu. Le contenu par défaut est affiché.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-brand-beige min-h-screen font-sans text-brand-green">
      <Header tagline={tagline} isLoading={isLoading} />
      <main className="container mx-auto px-6 py-12 md:py-20">
        {error && <p className="text-center text-red-500 mb-8">{error}</p>}
        <About aboutText={aboutText} />
        <ServicesSection />
      </main>
      <Footer />
    </div>
  );
};

export default App;