import { useTranslation } from 'react-i18next';
import { useEffect, useState, useRef } from 'react';
import { Home, Handshake, Users, UserCheck, TrendingUp } from 'lucide-react';

export default function Counter() {
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);
    const [animated, setAnimated] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    const counters = [
        { 
            value: 15, 
            suffix: "+", 
            label: "biens_listes", 
            icon: Home,
            color: "text-blue-500"
        },
        { 
            value: 8, 
            suffix: "", 
            label: "ventes_conclues", 
            icon: Handshake,
            color: "text-green-500"
        },
        { 
            value: 12, 
            suffix: "+", 
            label: "clients_satisfaits", 
            icon: Users,
            color: "text-purple-500"
        },
        { 
            value: 3, 
            suffix: "", 
            label: "agents_expérimentés", 
            icon: UserCheck,
            color: "text-amber-500"
        }
    ];

    // Animation au scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !animated) {
                    setVisible(true);
                    setAnimated(true);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, [animated]);

    return (
        <section ref={sectionRef} className="relative py-24 bg-white overflow-hidden">
            {/* Ligne décorative */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
            
            <div className="container mx-auto px-4">
                {/* En-tête simple */}
                <div className={`text-center mb-20 transition-all duration-1000 transform ${
                    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                    <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
                        {t('our_numbers') || 'Nos Chiffres'}
                    </h2>
                    <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
                </div>

                {/* Grille de compteurs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {counters.map((counter, index) => {
                        const Icon = counter.icon;
                        const [currentValue, setCurrentValue] = useState(0);

                        // Animation du compteur
                        useEffect(() => {
                            if (!visible) return;

                            const duration = 2000;
                            const steps = 60;
                            const increment = counter.value / steps;
                            let current = 0;

                            const timer = setInterval(() => {
                                current += increment;
                                if (current >= counter.value) {
                                    current = counter.value;
                                    clearInterval(timer);
                                }
                                setCurrentValue(Math.floor(current));
                            }, duration / steps);

                            return () => clearInterval(timer);
                        }, [visible, counter.value]);

                        return (
                            <div
                                key={counter.label}
                                className={`text-center transition-all duration-700 transform ${
                                    visible 
                                        ? 'opacity-100 translate-y-0' 
                                        : 'opacity-0 translate-y-10'
                                }`}
                                style={{
                                    transitionDelay: `${index * 150}ms`
                                }}
                            >
                                <div className="relative inline-block mb-6">
                                    {/* Icône avec cercle */}
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-gray-100 transition-colors duration-300">
                                        <Icon className={`w-8 h-8 ${counter.color} transition-transform duration-300 group-hover:scale-110`} />
                                    </div>
                                    
                                    {/* Ligne décorative sous l'icône */}
                                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-px bg-gray-300"></div>
                                </div>

                                {/* Compteur */}
                                <div className="mb-2">
                                    <span className={`text-5xl md:text-6xl font-bold text-gray-900 ${counter.color} transition-all duration-300`}>
                                        {currentValue}
                                    </span>
                                    <span className="text-4xl md:text-5xl font-bold text-gray-900 ml-1">
                                        {counter.suffix}
                                    </span>
                                </div>

                                {/* Label */}
                                <p className="text-gray-600 text-lg font-medium tracking-wide">
                                    {t(counter.label)}
                                </p>

                                {/* Ligne de séparation */}
                                <div className="mt-8 flex justify-center">
                                    <div className="w-12 h-px bg-gray-200"></div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Citation ou slogan */}
                <div className={`mt-20 text-center transition-all duration-1000 delay-500 transform ${
                    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-amber-50 rounded-full">
                        <TrendingUp className="w-5 h-5 text-amber-600" />
                        <span className="text-amber-800 font-medium">
                            {t('excellence_since_2020') || 'Excellence depuis 2020'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Ligne décorative du bas */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        </section>
    );
}