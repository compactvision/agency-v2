import { FaqAccordion } from '@/components/Faq/FaqAccordion';
import App from '@/components/layouts/Home/App';
import Breadcumb from '@/components/ui/Breadcumb';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Faq() {
    const { t } = useTranslation();

    return (
        <App>
            <Head title="FAQ" />

            <Breadcumb title="FAQ" homeLink={route('home')} />

            {/* FAQ Section avec Design Doré */}
            <section className="bg-gradient-to-b from-gray-50 to-white py-20 lg:py-32 dark:from-zinc-950 dark:to-zinc-900">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
                        {/* Accordion Gauche */}
                        <FaqAccordion />

                        {/* Image Droite avec Effet 3D Doré */}
                        <div className="relative">
                            <div className="relative z-10">
                                <div className="absolute inset-0 scale-105 rotate-6 transform rounded-3xl bg-gradient-to-r from-amber-600 to-orange-600 opacity-20 dark:opacity-40"></div>
                                <div className="relative rounded-3xl bg-gradient-to-br from-amber-100 to-orange-100 p-8 shadow-2xl dark:from-zinc-800 dark:to-zinc-900">
                                    <img
                                        src="assets/images/thumbs/faq-two-img.png"
                                        alt={t('faq_image_alt')}
                                        className="h-auto w-full transform rounded-2xl shadow-xl transition-transform duration-500 hover:scale-105"
                                    />
                                </div>
                            </div>

                            {/* Floating Cards Dorées */}
                            <div className="absolute -top-8 -right-8 rotate-12 transform rounded-2xl bg-white p-4 shadow-xl transition-transform duration-300 hover:rotate-0 dark:bg-zinc-800">
                                <div className="flex items-center space-x-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-amber-600 to-orange-600">
                                        <svg
                                            className="h-6 w-6 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 dark:text-zinc-100">
                                            100%
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-zinc-400">
                                            {t('satisfaction')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -bottom-8 -left-8 -rotate-12 transform rounded-2xl bg-white p-4 shadow-xl transition-transform duration-300 hover:rotate-0 dark:bg-zinc-800">
                                <div className="flex items-center space-x-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-orange-600 to-amber-600">
                                        <svg
                                            className="h-6 w-6 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 10V3L4 14h7v7l9-11h-7z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 dark:text-zinc-100">
                                            24/7
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-zinc-400">
                                            {t('support_24_7')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section avec Animations Dorées */}
            <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white py-20 lg:py-32 dark:from-zinc-900 dark:to-zinc-950">
                <div className="bg-[url('data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D6A643' fill-opacity='0.03'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E')] absolute inset-0"></div>

                <div className="relative container mx-auto max-w-7xl px-4">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-4xl font-bold text-gray-800 lg:text-5xl dark:text-zinc-100">
                            {t('achievements_title')}
                        </h2>
                        <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-zinc-400">
                            {t('achievements_description')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {[
                            {
                                number: '800+',
                                label: t('satisfied_clients'),
                                icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
                            },
                            {
                                number: '440+',
                                label: t('completed_projects'),
                                icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
                            },
                            {
                                number: '50k+',
                                label: t('team_members'),
                                icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
                            },
                            {
                                number: '80+',
                                label: t('awards_won'),
                                icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
                            },
                        ].map((stat, index) => (
                            <div key={index} className="group relative">
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-amber-600/10 to-orange-600/10 blur-xl transition-all duration-500 group-hover:blur-2xl"></div>
                                <div className="relative transform rounded-3xl border border-gray-100 bg-white p-8 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
                                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 transition-transform duration-300 group-hover:scale-110">
                                        <svg
                                            className="h-8 w-8 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d={stat.icon}
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="mb-2 text-4xl font-bold text-gray-800 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-amber-600 group-hover:to-orange-600 group-hover:bg-clip-text group-hover:text-transparent dark:text-zinc-100">
                                        {stat.number}
                                    </h3>
                                    <p className="font-medium text-gray-600 dark:text-zinc-400">
                                        {stat.label}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </App>
    );
}
