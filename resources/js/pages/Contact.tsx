import App from '@/components/layouts/Home/App';
import Breadcumb from '@/components/ui/Breadcumb';
import ErrorText from '@/components/ui/ErrorText';
import NewsLetter from '@/components/ui/NewsLetter';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Mail, MapPin, Phone, Send, MessageSquare, User, AtSign } from 'lucide-react';

export default function Contact() {
    const { t } = useTranslation();
    const { props } = usePage();
    const { settings } = props;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('contact.send'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <App>
            <Head title="Contact" />
            <Breadcumb title={t('contact')} homeLink={route('home')} />

            {/* Section des informations de contact */}
            <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="container mx-auto px-4">
                    {/* En-tête de section */}
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="inline-block px-4 py-2 bg-white rounded-full shadow-md text-orange-600 font-semibold text-sm mb-4">
                            {t('contact')}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t('contact_us')}</h2>
                    </div>

                    {/* Cartes de contact */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Carte Email */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Mail size={24} className="text-orange-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Email</h3>
                            <p className="text-gray-600">
                                <a href={`mailto:${settings?.email ?? ''}`} className="text-orange-600 hover:text-orange-700 transition-colors">
                                    {settings?.email ?? 'N/A'}
                                </a>
                            </p>
                        </div>

                        {/* Carte Adresse */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                <MapPin size={24} className="text-orange-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('location')}</h3>
                            <p className="text-gray-600">{settings?.adresse ?? 'N/A'}</p>
                        </div>

                        {/* Carte Téléphone */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Phone size={24} className="text-orange-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('phone')}</h3>
                            <p className="text-gray-600">
                                <a href={`tel:${settings?.phone ?? ''}`} className="text-orange-600 hover:text-orange-700 transition-colors">
                                    {settings?.phone ?? 'N/A'}
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section de la carte */}
            <div className="relative h-96 md:h-[500px] overflow-hidden">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3978.055494451155!2d15.257777585089782!3d-4.400719235531574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a6a307f0d556079%3A0xa65ddd1acbdbbc9a!2sLubumbashi%2C%20Kinshasa!5e0!3m2!1sfr!2scd!4v1747375916816!5m2!1sfr!2scd"
                    className="absolute top-0 left-0 w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Carte de localisation"
                ></iframe>
            </div>

            {/* Section du formulaire de contact */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                            {/* En-tête du formulaire */}
                            <div className="text-center mb-10">
                                <span className="inline-block px-4 py-2 bg-orange-50 rounded-full text-orange-600 font-semibold text-sm mb-4">
                                    {t('contact_us')}
                                </span>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('do_you_have_any_question')}</h2>
                                <p className="text-gray-600 text-lg">
                                    {t('real_estate_support_message')}
                                </p>
                            </div>

                            {/* Formulaire */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Champ Nom */}
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('your_name')}
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User size={20} className="text-gray-400" />
                                            </div>
                                            <input
                                                id="name"
                                                type="text"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                                                placeholder={t('your_name')}
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                            />
                                        </div>
                                        <ErrorText error={errors.name} />
                                    </div>

                                    {/* Champ Email */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('your_email')}
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <AtSign size={20} className="text-gray-400" />
                                            </div>
                                            <input
                                                id="email"
                                                type="email"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                                                placeholder={t('your_email')}
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                            />
                                        </div>
                                        <ErrorText error={errors.email} />
                                    </div>

                                    {/* Champ Téléphone */}
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('phone_number')}
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Phone size={20} className="text-gray-400" />
                                            </div>
                                            <input
                                                id="phone"
                                                type="tel"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                                                placeholder={t('phone_number')}
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                            />
                                        </div>
                                        <ErrorText error={errors.phone} />
                                    </div>

                                    {/* Champ Sujet */}
                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('subject')}
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                {/* <Subject size={20} className="text-gray-400" /> */}
                                            </div>
                                            <input
                                                id="subject"
                                                type="text"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                                                placeholder={t('subject')}
                                                value={data.subject}
                                                onChange={(e) => setData('subject', e.target.value)}
                                            />
                                        </div>
                                        <ErrorText error={errors.subject} />
                                    </div>
                                </div>

                                {/* Champ Message */}
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('your_message')}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute top-3 left-3 pointer-events-none">
                                            <MessageSquare size={20} className="text-gray-400" />
                                        </div>
                                        <textarea
                                            id="message"
                                            rows={5}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors resize-none"
                                            placeholder={t('your_message')}
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                        ></textarea>
                                    </div>
                                    <ErrorText error={errors.message} />
                                </div>

                                {/* Bouton d'envoi */}
                                <div className="pt-4">
                                    <button 
                                        type="submit" 
                                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" 
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                {t('sending')}...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={20} />
                                                {t('submit_now')}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <NewsLetter />
        </App>
    );
}