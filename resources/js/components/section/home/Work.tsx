import {
    ArrowRight,
    CheckCircle2,
    CreditCard,
    Home,
    MessageSquare,
    Shield,
    UserPlus,
    Zap,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { route } from 'ziggy-js';

const steps = [
    {
        number: '01',
        icon: UserPlus,
        titleKey: 'step_1_title',
        defaultTitle: 'Créer un compte vendeur',
        descKey: 'step_1_desc',
        defaultDesc:
            'Inscrivez-vous gratuitement et activez votre profil vendeur en quelques minutes.',
        color: '#413D3C',
    },
    {
        number: '02',
        icon: CreditCard,
        titleKey: 'step_2_title',
        defaultTitle: 'Souscrire un abonnement',
        descKey: 'step_2_desc',
        defaultDesc:
            'Choisissez la formule adaptée à vos besoins pour publier vos annonces.',
        color: '#2A4F7C',
    },
    {
        number: '03',
        icon: Home,
        titleKey: 'step_3_title',
        defaultTitle: 'Publier votre annonce',
        descKey: 'step_3_desc',
        defaultDesc:
            'Ajoutez photos, description et prix. Votre annonce est en ligne instantanément.',
        color: '#CF8E19',
    },
    {
        number: '04',
        icon: MessageSquare,
        titleKey: 'step_4_title',
        defaultTitle: 'Gérer vos contacts',
        descKey: 'step_4_desc',
        defaultDesc:
            'Recevez les demandes des acheteurs et gérez vos contacts depuis votre tableau de bord.',
        color: '#A96F0B',
    },
];

export default function HowItWorks() {
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setVisible(true);
            },
            { threshold: 0.1 },
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => {
            if (sectionRef.current) observer.unobserve(sectionRef.current);
        };
    }, []);

    // Auto-avancement des étapes
    useEffect(() => {
        if (!visible) return;
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % steps.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [visible]);

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden bg-[#F8F7F4] py-20 lg:py-28"
        >
            {/* Blobs décoratifs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 right-10 h-72 w-72 rounded-full bg-[#413D3C]/5 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#CF8E19]/6 blur-3xl" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-4">
                {/* Header */}
                <div
                    className={`mb-16 text-center transition-all duration-700 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                >
                    <span className="section-label">
                        <span className="h-px w-8 bg-[#CF8E19]" />
                        {t('how_it_works_subtitle', 'Processus Simple')}
                    </span>
                    <h2 className="section-title mt-2">
                        {t('how_it_works_title', 'Comment ça marche ?')}
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-gray-500">
                        {t(
                            'how_it_works_description',
                            'Notre plateforme simplifie la vente et la location de biens immobiliers en 4 étapes simples.',
                        )}
                    </p>
                </div>

                <div className="grid items-center gap-12 lg:grid-cols-2">
                    {/* Étapes */}
                    <div
                        className={`transition-all delay-200 duration-700 ${visible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}
                    >
                        <div className="relative space-y-4">
                            {/* Ligne de progression */}
                            <div className="absolute top-8 bottom-8 left-[22px] w-0.5 rounded-full bg-gray-200" />
                            <div
                                className="absolute top-8 left-[22px] w-0.5 rounded-full bg-gradient-to-b from-[#413D3C] to-[#CF8E19] transition-all duration-1000"
                                style={{
                                    height: `${(activeStep / (steps.length - 1)) * 100}%`,
                                }}
                            />

                            {steps.map((step, index) => {
                                const Icon = step.icon;
                                const isActive = index <= activeStep;
                                const isCurrent = index === activeStep;
                                return (
                                    <div
                                        key={step.number}
                                        className={`relative flex cursor-pointer items-start gap-5 transition-all duration-500 ${visible ? 'translate-x-0 opacity-100' : '-translate-x-6 opacity-0'}`}
                                        style={{
                                            transitionDelay: `${index * 120}ms`,
                                        }}
                                        onMouseEnter={() =>
                                            setActiveStep(index)
                                        }
                                    >
                                        {/* Cercle */}
                                        <div
                                            className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300 ${
                                                isActive
                                                    ? 'border-transparent text-white shadow-lg'
                                                    : 'border-gray-200 bg-white text-gray-400'
                                            }`}
                                            style={
                                                isActive
                                                    ? { background: step.color }
                                                    : {}
                                            }
                                        >
                                            {isActive ? (
                                                <CheckCircle2 className="h-5 w-5" />
                                            ) : (
                                                step.number
                                            )}
                                            {isCurrent && (
                                                <span
                                                    className="absolute inset-0 animate-ping rounded-full opacity-30"
                                                    style={{
                                                        background: step.color,
                                                    }}
                                                />
                                            )}
                                        </div>

                                        {/* Card */}
                                        <div
                                            className={`flex-1 rounded-xl border p-5 transition-all duration-300 ${
                                                isCurrent
                                                    ? 'border-[#413D3C]/20 bg-white shadow-md dark:bg-[#353130]'
                                                    : 'border-transparent bg-white/60 hover:bg-white hover:shadow-sm'
                                            }`}
                                        >
                                            <div className="mb-2 flex items-center gap-3">
                                                <div
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
                                                    style={{
                                                        background: step.color,
                                                    }}
                                                >
                                                    <Icon className="h-4 w-4" />
                                                </div>
                                                <h3
                                                    className={`text-sm font-bold transition-colors duration-300 ${isCurrent ? 'text-[#413D3C] dark:text-[#CF8E19]' : 'text-gray-800 dark:text-[#EEEFE6]'}`}
                                                >
                                                    {t(
                                                        step.titleKey,
                                                        step.defaultTitle,
                                                    )}
                                                </h3>
                                            </div>
                                            <p className="text-xs leading-relaxed text-gray-500">
                                                {t(
                                                    step.descKey,
                                                    step.defaultDesc,
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Image + CTA */}
                    <div
                        className={`transition-all delay-300 duration-700 ${visible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}
                    >
                        <div className="relative">
                            <div className="overflow-hidden rounded-2xl shadow-xl">
                                <img
                                    src="assets/images/thumbs/project-10-thumb1.jpg"
                                    alt="Processus de vente"
                                    className="h-80 w-full object-cover lg:h-96"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#292625]/55 via-transparent to-transparent" />
                            </div>

                            {/* Badge sécurité */}
                            <div className="absolute top-5 left-5 flex items-center gap-2 rounded-xl bg-white/95 px-4 py-2.5 shadow-lg backdrop-blur-sm">
                                <Shield className="h-4 w-4 text-green-500" />
                                <span className="text-sm font-semibold text-gray-800">
                                    {t('secure_process', 'Processus Sécurisé')}
                                </span>
                            </div>

                            {/* Badge rapidité */}
                            <div className="absolute right-5 bottom-5 flex items-center gap-2 rounded-xl bg-[#CF8E19] px-4 py-2.5 text-[#292625] shadow-lg">
                                <Zap className="h-4 w-4 text-white" />
                                <span className="text-sm font-semibold text-white">
                                    {t('fast_process', 'Mise en ligne rapide')}
                                </span>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="mt-8 text-center lg:text-left">
                            <a
                                href={route('register')}
                                className="btn-navy group inline-flex"
                            >
                                {t('start_selling', 'Commencer à vendre')}
                                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
