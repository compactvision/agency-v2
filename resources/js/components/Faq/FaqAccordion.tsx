import { useState } from 'react';

const FAQ_ITEMS = [
    {
        id: 'collapseOne',
        question: 'Votre satisfaction est notre priorité absolue ?',
        answer: 'Nous nous engageons à fournir un service exceptionnel, personnalisé et adapté à vos besoins spécifiques. Votre satisfaction est au cœur de notre démarche.',
    },
    {
        id: 'collapseTwo',
        question: 'Comment savoir si mon entreprise éligible ?',
        answer: "Notre équipe d'experts analyse votre situation et vous guide à travers les critères d'éligibilité pour vous offrir les meilleures solutions.",
    },
    {
        id: 'collapseThree',
        question: 'Quels types de services immobiliers proposez-vous ?',
        answer: 'Nous offrons une gamme complète de services : achat, vente, location, gestion de biens, conseil en investissement et accompagnement juridique.',
    },
    {
        id: 'collapseFour',
        question: 'Combien de temps dure un projet immobilier typique ?',
        answer: 'La durée varie selon le type de projet, mais nous nous engageons à vous fournir un calendrier précis et à respecter les délais convenus.',
    },
    {
        id: 'collapseFive',
        question: 'Quels sont les coûts associés à vos services ?',
        answer: 'Nos tarifs sont transparents et compétitifs. Nous vous proposons un devis détaillé adapté à votre budget et à vos objectifs.',
    },
];

export function FaqAccordion() {
    const [activeAccordion, setActiveAccordion] = useState('collapseThree');

    const toggleAccordion = (id: string) => {
        setActiveAccordion(activeAccordion === id ? '' : id);
    };

    return (
        <div className="space-y-4">
            {FAQ_ITEMS.map((item, index) => (
                <div
                    key={item.id}
                    className={`group relative ${index !== FAQ_ITEMS.length - 1 ? 'mb-4' : ''}`}
                >
                    <div
                        className={`absolute inset-0 bg-gradient-to-r ${activeAccordion === item.id ? 'from-amber-600/20 to-orange-600/20' : 'from-transparent to-transparent'} rounded-2xl blur-xl transition-all duration-500`}
                    ></div>
                    <div
                        className={`relative rounded-2xl border bg-white shadow-lg transition-all duration-500 hover:shadow-2xl ${activeAccordion === item.id ? 'border-amber-500/50' : 'border-gray-100'} overflow-hidden dark:border-zinc-800 dark:bg-zinc-900`}
                    >
                        <button
                            onClick={() => toggleAccordion(item.id)}
                            className="group flex w-full items-center justify-between px-8 py-6 text-left"
                        >
                            <span
                                className={`text-lg font-semibold ${activeAccordion === item.id ? 'text-amber-600 dark:text-amber-400' : 'text-gray-800 dark:text-zinc-200'} transition-colors duration-300 group-hover:text-amber-600 dark:group-hover:text-amber-400`}
                            >
                                {item.question}
                            </span>
                            <div
                                className={`relative h-10 w-10 shrink-0 rounded-full ${activeAccordion === item.id ? 'bg-gradient-to-r from-amber-600 to-orange-600' : 'bg-gray-100 dark:bg-zinc-800'} flex items-center justify-center transition-all duration-300 group-hover:scale-110`}
                            >
                                <svg
                                    className={`h-5 w-5 transition-transform duration-300 ${activeAccordion === item.id ? 'rotate-180 text-white' : 'text-gray-500 dark:text-zinc-400'}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </div>
                        </button>
                        <div
                            className={`transition-all duration-500 ${activeAccordion === item.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}
                        >
                            <div className="px-8 pb-6">
                                <p className="leading-relaxed text-gray-600 dark:text-zinc-400">
                                    {item.answer}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
