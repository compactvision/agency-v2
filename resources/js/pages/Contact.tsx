import { ContactForm } from '@/components/Contact/ContactForm';
import App from '@/components/layouts/Home/App';
import Breadcumb from '@/components/ui/Breadcumb';
import NewsLetter from '@/components/ui/NewsLetter';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Contact() {
    const { t } = useTranslation();
    const { props } = usePage<SharedData>();
    const { settings } = props;

    return (
        <App>
            <Head title="Contact" />
            <Breadcumb title={t('contact')} homeLink={route('home')} />

            {/* Section des informations de contact */}
            <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20 dark:from-zinc-900 dark:to-zinc-950">
                <div className="container mx-auto px-4">
                    {/* En-tête de section */}
                    <div className="mx-auto mb-16 max-w-3xl text-center">
                        <span className="mb-4 inline-block rounded-full bg-white px-4 py-2 text-sm font-semibold text-orange-600 shadow-md dark:bg-zinc-800 dark:text-orange-400">
                            {t('contact')}
                        </span>
                        <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl dark:text-zinc-100">
                            {t('contact_us')}
                        </h2>
                    </div>

                    {/* Cartes de contact */}
                    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
                        {/* Carte Email */}
                        <div className="rounded-2xl bg-white p-8 text-center shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:bg-zinc-800">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50">
                                <Mail
                                    size={24}
                                    className="text-orange-600 dark:text-orange-400"
                                />
                            </div>
                            <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-zinc-100">
                                Email
                            </h3>
                            <p className="text-gray-600 dark:text-zinc-400">
                                <a
                                    href={`mailto:${settings?.email ?? ''}`}
                                    className="text-orange-600 transition-colors hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
                                >
                                    {settings?.email ?? 'N/A'}
                                </a>
                            </p>
                        </div>

                        {/* Carte Adresse */}
                        <div className="rounded-2xl bg-white p-8 text-center shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:bg-zinc-800">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50">
                                <MapPin
                                    size={24}
                                    className="text-orange-600 dark:text-orange-400"
                                />
                            </div>
                            <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-zinc-100">
                                {t('location')}
                            </h3>
                            <p className="text-gray-600 dark:text-zinc-400">
                                {settings?.adresse ?? 'N/A'}
                            </p>
                        </div>

                        {/* Carte Téléphone */}
                        <div className="rounded-2xl bg-white p-8 text-center shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:bg-zinc-800">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50">
                                <Phone
                                    size={24}
                                    className="text-orange-600 dark:text-orange-400"
                                />
                            </div>
                            <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-zinc-100">
                                {t('phone')}
                            </h3>
                            <p className="text-gray-600 dark:text-zinc-400">
                                <a
                                    href={`tel:${settings?.phone ?? ''}`}
                                    className="text-orange-600 transition-colors hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
                                >
                                    {settings?.phone ?? 'N/A'}
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section de la carte */}
            <div className="relative h-96 overflow-hidden md:h-[500px]">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3978.055494451155!2d15.257777585089782!3d-4.400719235531574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a6a307f0d556079%3A0xa65ddd1acbdbbc9a!2sLubumbashi%2C%20Kinshasa!5e0!3m2!1sfr!2scd!4v1747375916816!5m2!1sfr!2scd"
                    className="absolute top-0 left-0 h-full w-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Carte de localisation"
                ></iframe>
            </div>

            {/* Section du formulaire de contact */}
            <section className="bg-gray-50 py-20 dark:bg-zinc-950">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-4xl">
                        <ContactForm />
                    </div>
                </div>
            </section>

            <NewsLetter />
        </App>
    );
}
