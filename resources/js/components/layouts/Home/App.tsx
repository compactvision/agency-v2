import { CircleFadingArrowUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Toaster } from 'sonner';
// import ChatBot from './ChatBot';
import Footer from '../../partials/Footer';
import Header from '../../partials/Header';

const App = ({ children }: { children: React.ReactNode }) => {
    const [showScrollTop, setShowScrollTop] = useState(false);

    // Gérer l'affichage du bouton "retour en haut"
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fonction pour remonter en haut de la page
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <div className={`flex min-h-screen flex-col`}>
            <Header />

            {/* Contenu principal avec padding pour éviter le header fixe */}
            <main className="flex-grow bg-gray-50 transition-colors duration-300">
                <div className="animate-fadeIn">{children}</div>
            </main>

            <Footer />
            {/* <ChatBot /> */}
            <Toaster richColors position="top-right" />

            {/* Bouton scroll-to-top */}
            <button
                onClick={scrollToTop}
                className={`fixed right-8 bottom-8 z-50 hidden rounded-full bg-[#0099cc] p-3 text-white shadow-lg transition-all duration-300 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none lg:flex ${
                    showScrollTop
                        ? 'visible translate-y-0 opacity-100'
                        : 'invisible translate-y-4 opacity-0'
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
