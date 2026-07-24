import { CircleFadingArrowUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Toaster } from 'sonner';
// import ChatBot from './ChatBot';
import Footer from '../../partials/Footer';
import Header from '../../partials/Header';

const App = ({ children }: { children: React.ReactNode }) => {
    const { t } = useTranslation();
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
        const reduceMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        ).matches;
        window.scrollTo({
            top: 0,
            behavior: reduceMotion ? 'auto' : 'smooth',
        });
    };

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <a
                href="#main-content"
                className="fixed top-3 left-3 z-[100] -translate-y-24 rounded-lg bg-card px-4 py-3 font-semibold text-foreground shadow-xl transition-transform focus:translate-y-0"
            >
                {t('skip_to_main_content')}
            </a>
            <Header />

            {/* Contenu principal avec padding pour éviter le header fixe */}
            <main
                id="main-content"
                tabIndex={-1}
                className="flex-grow bg-background transition-colors duration-300"
            >
                <div className="animate-fadeIn">{children}</div>
            </main>

            <Footer />
            {/* <ChatBot /> */}
            <Toaster richColors position="top-right" />

            {/* Bouton scroll-to-top */}
            <button
                onClick={scrollToTop}
                className={`fixed right-8 bottom-8 z-50 hidden rounded-full bg-[#CF8E19] p-3 text-[#292625] shadow-lg transition-all duration-300 hover:bg-[#E0A43A] focus:ring-2 focus:ring-[#CF8E19] focus:ring-offset-2 focus:outline-none lg:flex ${
                    showScrollTop
                        ? 'visible translate-y-0 opacity-100'
                        : 'invisible translate-y-4 opacity-0'
                }`}
                aria-label={t('back_to_top')}
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
