import App from '@/components/layouts/Home/App';
import Breadcumb from '@/components/ui/Breadcumb';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Faq() {
    const [activeAccordion, setActiveAccordion] = useState('collapseThree');

    const toggleAccordion = (id) => {
        setActiveAccordion(activeAccordion === id ? '' : id);
    };

    return (
        <App>
            <Head title="FAQ" />

            <Breadcumb title="FAQ" homeLink={route('home')} />

            {/* FAQ Section avec Design Doré */}
            <section className="bg-gradient-to-b from-gray-50 to-white py-20 lg:py-32">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
                        {/* Accordion Gauche */}
                        <div className="space-y-4">
                            {[
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
                            ].map((item, index) => (
                                <div key={item.id} className={`group relative ${index !== 4 ? 'mb-4' : ''}`}>
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-r ${activeAccordion === item.id ? 'from-amber-600/20 to-orange-600/20' : 'from-transparent to-transparent'} rounded-2xl blur-xl transition-all duration-500`}
                                    ></div>
                                    <div
                                        className={`relative rounded-2xl border bg-white shadow-lg transition-all duration-500 hover:shadow-2xl ${activeAccordion === item.id ? 'border-amber-500/50' : 'border-gray-100'} overflow-hidden`}
                                    >
                                        <button
                                            onClick={() => toggleAccordion(item.id)}
                                            className="group flex w-full items-center justify-between px-8 py-6 text-left"
                                        >
                                            <span
                                                className={`text-lg font-semibold ${activeAccordion === item.id ? 'text-amber-600' : 'text-gray-800'} transition-colors duration-300 group-hover:text-amber-600`}
                                            >
                                                {item.question}
                                            </span>
                                            <div
                                                className={`relative h-10 w-10 rounded-full ${activeAccordion === item.id ? 'bg-gradient-to-r from-amber-600 to-orange-600' : 'bg-gray-100'} flex items-center justify-center transition-all duration-300 group-hover:scale-110`}
                                            >
                                                <svg
                                                    className={`h-5 w-5 text-white transition-transform duration-300 ${activeAccordion === item.id ? 'rotate-180' : ''}`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </button>
                                        <div
                                            className={`transition-all duration-500 ${activeAccordion === item.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}
                                        >
                                            <div className="px-8 pb-6">
                                                <p className="leading-relaxed text-gray-600">{item.answer}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Image Droite avec Effet 3D Doré */}
                        <div className="relative">
                            <div className="relative z-10">
                                <div className="absolute inset-0 scale-105 rotate-6 transform rounded-3xl bg-gradient-to-r from-amber-600 to-orange-600 opacity-20"></div>
                                <div className="relative rounded-3xl bg-gradient-to-br from-amber-100 to-orange-100 p-8 shadow-2xl">
                                    <img
                                        src="assets/images/thumbs/faq-two-img.png"
                                        alt="FAQ Illustration"
                                        className="h-auto w-full transform rounded-2xl shadow-xl transition-transform duration-500 hover:scale-105"
                                    />
                                </div>
                            </div>

                            {/* Floating Cards Dorées */}
                            <div className="absolute -top-8 -right-8 rotate-12 transform rounded-2xl bg-white p-4 shadow-xl transition-transform duration-300 hover:rotate-0">
                                <div className="flex items-center space-x-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-amber-600 to-orange-600">
                                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">100%</p>
                                        <p className="text-sm text-gray-600">Satisfaction</p>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -bottom-8 -left-8 -rotate-12 transform rounded-2xl bg-white p-4 shadow-xl transition-transform duration-300 hover:rotate-0">
                                <div className="flex items-center space-x-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-orange-600 to-amber-600">
                                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">24/7</p>
                                        <p className="text-sm text-gray-600">Support</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form Ultra Moderne Doré */}
            <section className="bg-white py-20 lg:py-32">
                <div className="container mx-auto max-w-4xl px-4">
                    <div className="mb-12 text-center">
                        <span className="mb-6 inline-block rounded-full border border-amber-200 bg-amber-50 px-6 py-3">
                            <span className="text-sm font-bold tracking-wider text-amber-600 uppercase">Contactez-nous</span>
                        </span>
                        <h2 className="mb-6 text-4xl font-bold text-gray-800 lg:text-5xl">
                            Une question ? <span className="text-amber-600">Nous sommes là pour vous aider</span>
                        </h2>
                        <p className="mx-auto max-w-2xl text-xl text-gray-600">
                            Notre équipe d'experts est à votre disposition pour répondre à toutes vos interrogations
                        </p>
                    </div>

                    <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-lg lg:p-12">
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="group relative">
                                    <input
                                        type="text"
                                        className="peer w-full rounded-2xl border border-gray-300 bg-gray-50 px-6 py-4 text-gray-800 placeholder-gray-500 transition-all duration-300 focus:border-amber-500 focus:bg-white focus:outline-none"
                                        placeholder=" "
                                        required
                                    />
                                    <label className="absolute -top-3 left-6 bg-white px-2 text-sm text-amber-600 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-amber-600">
                                        Votre Nom
                                    </label>
                                </div>

                                <div className="group relative">
                                    <input
                                        type="email"
                                        className="peer w-full rounded-2xl border border-gray-300 bg-gray-50 px-6 py-4 text-gray-800 placeholder-gray-500 transition-all duration-300 focus:border-amber-500 focus:bg-white focus:outline-none"
                                        placeholder=" "
                                        required
                                    />
                                    <label className="absolute -top-3 left-6 bg-white px-2 text-sm text-amber-600 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-amber-600">
                                        Votre Email
                                    </label>
                                </div>

                                <div className="group relative">
                                    <input
                                        type="tel"
                                        className="peer w-full rounded-2xl border border-gray-300 bg-gray-50 px-6 py-4 text-gray-800 placeholder-gray-500 transition-all duration-300 focus:border-amber-500 focus:bg-white focus:outline-none"
                                        placeholder=" "
                                        required
                                    />
                                    <label className="absolute -top-3 left-6 bg-white px-2 text-sm text-amber-600 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-amber-600">
                                        Téléphone
                                    </label>
                                </div>

                                <div className="group relative">
                                    <input
                                        type="text"
                                        className="peer w-full rounded-2xl border border-gray-300 bg-gray-50 px-6 py-4 text-gray-800 placeholder-gray-500 transition-all duration-300 focus:border-amber-500 focus:bg-white focus:outline-none"
                                        placeholder=" "
                                        required
                                    />
                                    <label className="absolute -top-3 left-6 bg-white px-2 text-sm text-amber-600 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-amber-600">
                                        Sujet
                                    </label>
                                </div>
                            </div>

                            <div className="group relative">
                                <textarea
                                    className="peer w-full resize-none rounded-2xl border border-gray-300 bg-gray-50 px-6 py-4 text-gray-800 placeholder-gray-500 transition-all duration-300 focus:border-amber-500 focus:bg-white focus:outline-none"
                                    rows="5"
                                    placeholder=" "
                                    required
                                ></textarea>
                                <label className="absolute -top-3 left-6 bg-white px-2 text-sm text-amber-600 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-amber-600">
                                    Votre Message
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="w-full transform rounded-2xl bg-amber-600 px-8 py-4 font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-amber-700 hover:shadow-lg"
                            >
                                Envoyer le Message
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Stats Section avec Animations Dorées */}
            <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white py-20 lg:py-32">
                <div className="bg-[url('data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D6A643' fill-opacity='0.03'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E')] absolute inset-0"></div>

                <div className="relative container mx-auto max-w-7xl px-4">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-4xl font-bold text-gray-800 lg:text-5xl">
                            Nos réalisations en{' '}
                            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">chiffres</span>
                        </h2>
                        <p className="mx-auto max-w-2xl text-xl text-gray-600">Des résultats qui parlent d'eux-mêmes</p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {[
                            {
                                number: '800+',
                                label: 'Clients Satisfaits',
                                icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
                            },
                            { number: '440+', label: 'Projets Réalisés', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                            {
                                number: '500k',
                                label: 'Employés',
                                icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
                            },
                            {
                                number: '80+',
                                label: 'Prix Remportés',
                                icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
                            },
                        ].map((stat, index) => (
                            <div key={index} className="group relative">
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-amber-600/10 to-orange-600/10 blur-xl transition-all duration-500 group-hover:blur-2xl"></div>
                                <div className="relative transform rounded-3xl border border-gray-100 bg-white p-8 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 transition-transform duration-300 group-hover:scale-110">
                                        <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                                        </svg>
                                    </div>
                                    <h3 className="mb-2 text-4xl font-bold text-gray-800 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-amber-600 group-hover:to-orange-600 group-hover:bg-clip-text group-hover:text-transparent">
                                        {stat.number}
                                    </h3>
                                    <p className="font-medium text-gray-600">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </App>
    );
}
