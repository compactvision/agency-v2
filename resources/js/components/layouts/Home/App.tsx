import { toast, Toaster } from 'sonner';
// import ChatBot from './ChatBot';


import React, { useState, useEffect } from 'react';
import Header from '../../partials/Header';
import Footer from '../../partials/Footer';
import { CircleFadingArrowUp } from 'lucide-react';

const App = ({ children }: { children: React.ReactNode }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Gérer l'affichage du bouton "retour en haut"
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fonction pour remonter en haut de la page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };


  return (
    <div className={`min-h-screen flex flex-col`}>
      <Header />
      
      {/* Contenu principal avec padding pour éviter le header fixe */}
      <main className="flex-grow bg-gray-50 transition-colors duration-300">
        <div className="animate-fadeIn">
          {children}
        </div>
      </main>
      
      <Footer />
      {/* <ChatBot /> */}
      <Toaster richColors position="top-right" />
      
      {/* Bouton pour remonter en haut de la page */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 p-3 bg-[#0099cc] text-white rounded-full shadow-lg transition-all duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          showScrollTop ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-4'
        }`}
        aria-label="Retour en haut de la page"
      >
        <CircleFadingArrowUp />
      </button>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default App;
