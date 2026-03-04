import i18n from '@/i18n';
import { Link, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    Building,
    ChevronRight,
    DollarSign,
    Facebook,
    FileText,
    Globe,
    HelpCircle,
    Home,
    Instagram,
    Key,
    Linkedin,
    Mail,
    MapPin,
    Package,
    Phone,
    Send,
    Shield,
    Twitter,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [visible, setVisible] = useState(false);
    const footerRef = useRef<HTMLDivElement>(null);

    const { appSettings } = usePage().props as { appSettings: any };

    // Prépare les valeurs avec fallback
    const facebook = appSettings?.facebook ?? 'https://www.facebook.com';
    const twitter = appSettings?.twitter ?? 'https://www.twitter.com';
    const linkedin = appSettings?.linkedin ?? 'https://www.linkedin.com';
    const instagram = appSettings?.instagram ?? 'https://www.instagram.com';
    const siteName = appSettings?.site_name ?? 'The Agency DRC';

    // Animation au scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                }
            },
            { threshold: 0.1 },
        );

        if (footerRef.current) {
            observer.observe(footerRef.current);
        }

        return () => {
            if (footerRef.current) {
                observer.unobserve(footerRef.current);
            }
        };
    }, []);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setError('');
        setLoading(true);

        router.post(
            route('newsletter.subscribe'),
            { email },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setLoading(false);
                    setSubscribed(true);
                    setEmail('');
                    setTimeout(() => setSubscribed(false), 3000);
                },
                onError: (errors) => {
                    setLoading(false);
                    setError(
                        errors.email ||
                            t('subscription_error') ||
                            'Une erreur est survenue',
                    );
                },
            },
        );
    };

    const handleSearch = (type: string) => {
        const params = {
            sale_type: type ?? '',
        };

        router.get(route('properties'), params, {
            preserveState: true,
        });
    };

    return (
        <>
            {/* Section principale du footer */}
            <footer
                ref={footerRef}
                className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white"
            >
                {/* Formes décoratives de fond */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-amber-400/5 blur-3xl filter"></div>
                    <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-400/5 blur-3xl filter"></div>
                    <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-purple-400/3 blur-3xl filter"></div>
                </div>

                <div className="relative z-10 container mx-auto px-4 py-16 lg:py-24">
                    {/* Section des fonctionnalités */}
                    <div
                        className={`mb-16 grid transform grid-cols-1 gap-8 transition-all duration-1000 md:grid-cols-3 ${
                            visible
                                ? 'translate-y-0 opacity-100'
                                : 'translate-y-10 opacity-0'
                        }`}
                    >
                        {/* Carte "Acheter une maison" */}
                        <div className="group relative transform rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:bg-white/10 hover:shadow-2xl hover:shadow-white/5">
                            <div className="mb-6 flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg transition-transform duration-300 group-hover:scale-110">
                                    <Home className="h-7 w-7 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white transition-colors duration-300 group-hover:text-blue-400">
                                    {t('buy_a_home')}
                                </h3>
                            </div>
                            <p className="mb-6 leading-relaxed text-gray-300">
                                {i18n.language === 'fr'
                                    ? 'Trouvez rapidement la maison parfaite à acheter grâce à nos annonces.'
                                    : 'Quickly find the perfect home to buy with our listings.'}
                            </p>
                            <button
                                onClick={() => handleSearch('sale')}
                                className="inline-flex items-center gap-2 font-medium text-blue-400 transition-colors duration-300 hover:text-blue-300"
                            >
                                {t('explore_properties')}
                                <ChevronRight className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                            </button>
                        </div>

                        {/* Carte "Vendre une maison" */}
                        <div className="group relative transform rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:bg-white/10 hover:shadow-2xl hover:shadow-white/5">
                            <div className="mb-6 flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-green-400 to-green-600 shadow-lg transition-transform duration-300 group-hover:scale-110">
                                    <Building className="h-7 w-7 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white transition-colors duration-300 group-hover:text-green-400">
                                    {t('sell_a_home')}
                                </h3>
                            </div>
                            <p className="mb-6 leading-relaxed text-gray-300">
                                {i18n.language === 'fr'
                                    ? 'Publiez votre annonce et trouvez rapidement un acheteur sérieux.'
                                    : 'Post your listing and quickly find a serious buyer.'}
                            </p>
                            <button
                                onClick={() =>
                                    router.get(
                                        route('dashboard.properties.create'),
                                    )
                                }
                                className="inline-flex items-center gap-2 font-medium text-green-400 transition-colors duration-300 hover:text-green-300"
                            >
                                {t('list_property')}
                                <ChevronRight className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                            </button>
                        </div>

                        {/* Carte "Louer une maison" */}
                        <div className="group relative transform rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:bg-white/10 hover:shadow-2xl hover:shadow-white/5">
                            <div className="mb-6 flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 shadow-lg transition-transform duration-300 group-hover:scale-110">
                                    <Key className="h-7 w-7 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white transition-colors duration-300 group-hover:text-amber-400">
                                    {t('rent_a_home')}
                                </h3>
                            </div>
                            <p className="mb-6 leading-relaxed text-gray-300">
                                {i18n.language === 'fr'
                                    ? 'Trouvez facilement la maison idéale à louer près de chez vous.'
                                    : 'Easily find the ideal rental home near you.'}
                            </p>
                            <button
                                onClick={() => handleSearch('rent')}
                                className="inline-flex items-center gap-2 font-medium text-amber-400 transition-colors duration-300 hover:text-amber-300"
                            >
                                {t('explore_rentals')}
                                <ChevronRight className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                            </button>
                        </div>
                    </div>

                    {/* Section des liens et newsletter */}
                    <div
                        className={`mb-16 grid transform grid-cols-1 gap-8 transition-all delay-300 duration-1000 md:grid-cols-2 lg:grid-cols-4 ${
                            visible
                                ? 'translate-y-0 opacity-100'
                                : 'translate-y-10 opacity-0'
                        }`}
                    >
                        {/* Services */}
                        <div>
                            <h4 className="mb-6 flex items-center gap-2 text-xl font-bold text-white">
                                <Package className="h-5 w-5 text-amber-400" />
                                {t('our_services')}
                            </h4>
                            <ul className="space-y-3">
                                <li>
                                    <button
                                        onClick={() => handleSearch('rent')}
                                        className="flex items-center gap-2 text-gray-300 transition-colors duration-300 hover:text-white"
                                    >
                                        <Home className="h-4 w-4" />
                                        {t('rent_properties')}
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handleSearch('sale')}
                                        className="flex items-center gap-2 text-gray-300 transition-colors duration-300 hover:text-white"
                                    >
                                        <Building className="h-4 w-4" />
                                        {t('sell_properties')}
                                    </button>
                                </li>
                                <li>
                                    <Link
                                        href={route(
                                            'pages.show',
                                            'conditions-utilisation',
                                        )}
                                        className="flex items-center gap-2 text-gray-300 transition-colors duration-300 hover:text-white"
                                    >
                                        <FileText className="h-4 w-4" />
                                        {t('terms_of_service')}
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Liens rapides */}
                        <div>
                            <h4 className="mb-6 flex items-center gap-2 text-xl font-bold text-white">
                                <Globe className="h-5 w-5 text-amber-400" />
                                {t('quick_link')}
                            </h4>
                            <ul className="space-y-3">
                                <li>
                                    <Link
                                        href={route('properties')}
                                        className="flex items-center gap-2 text-gray-300 transition-colors duration-300 hover:text-white"
                                    >
                                        <Home className="h-4 w-4" />
                                        {t('all_properties')}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={route('faq')}
                                        className="flex items-center gap-2 text-gray-300 transition-colors duration-300 hover:text-white"
                                    >
                                        <HelpCircle className="h-4 w-4" />
                                        FAQ
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={route('tarifs')}
                                        className="flex items-center gap-2 text-gray-300 transition-colors duration-300 hover:text-white"
                                    >
                                        <DollarSign className="h-4 w-4" />
                                        {t('our_pricing')}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={route(
                                            'pages.show',
                                            'politique-confidentialite',
                                        )}
                                        className="flex items-center gap-2 text-gray-300 transition-colors duration-300 hover:text-white"
                                    >
                                        <Shield className="h-4 w-4" />
                                        {t('privacy_policy')}
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="mb-6 flex items-center gap-2 text-xl font-bold text-white">
                                <Phone className="h-5 w-5 text-amber-400" />
                                {t('contact_us')}
                            </h4>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-2 text-gray-300">
                                    <Mail className="h-4 w-4 text-amber-400" />
                                    <span>
                                        contact@
                                        {siteName
                                            .toLowerCase()
                                            .replace(/\s+/g, '')}
                                        .com
                                    </span>
                                </li>
                                <li className="flex items-center gap-2 text-gray-300">
                                    <Phone className="h-4 w-4 text-amber-400" />
                                    <span>+1 800 123 456 789</span>
                                </li>
                                <li className="flex items-center gap-2 text-gray-300">
                                    <MapPin className="h-4 w-4 text-amber-400" />
                                    <span>123 Main Street, City, Country</span>
                                </li>
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h4 className="mb-6 flex items-center gap-2 text-xl font-bold text-white">
                                <Mail className="h-5 w-5 text-amber-400" />
                                {t('subscribe_newsletter')}
                            </h4>
                            <p className="mb-6 text-gray-300">
                                {t('footer_newsletter_paragraph')}
                            </p>
                            <form
                                onSubmit={handleSubscribe}
                                className="space-y-4"
                            >
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder={
                                            i18n.language === 'fr'
                                                ? 'Adresse e-mail'
                                                : 'Email Address'
                                        }
                                        className={`w-full rounded-lg border bg-white/10 px-4 py-3 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-amber-400 focus:outline-none ${
                                            error
                                                ? 'border-red-500'
                                                : 'border-white/20'
                                        }`}
                                        required
                                    />
                                    <Mail className="absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                                </div>
                                {error && (
                                    <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                                        <AlertCircle className="h-3 w-3" />
                                        {error}
                                    </p>
                                )}
                                <button
                                    type="submit"
                                    disabled={loading || subscribed}
                                    className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium transition-all duration-300 ${
                                        subscribed
                                            ? 'bg-green-500 text-white'
                                            : loading
                                              ? 'cursor-not-allowed bg-gray-600 text-gray-300'
                                              : 'transform bg-gradient-to-r from-amber-400 to-amber-600 text-white hover:scale-105 hover:from-amber-500 hover:to-amber-700 hover:shadow-lg hover:shadow-amber-500/25'
                                    }`}
                                >
                                    {subscribed ? (
                                        <>
                                            <span className="flex items-center gap-2">
                                                <svg
                                                    className="h-5 w-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                                {t('subscribed') || 'Inscrit !'}
                                            </span>
                                        </>
                                    ) : loading ? (
                                        <>
                                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                            {t('loading') || 'Chargement...'}
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-5 w-5" />
                                            {t('subscribe') || "S'inscrire"}
                                        </>
                                    )}
                                </button>
                            </form>
                            <p className="mt-4 text-xs text-gray-400">
                                {i18n.language === 'fr' ? (
                                    <>
                                        En vous abonnant, vous acceptez nos{' '}
                                        <Link
                                            href={route(
                                                'pages.show',
                                                'conditions-utilisation',
                                            )}
                                            className="text-amber-400 underline hover:text-amber-300"
                                        >
                                            Conditions d'utilisation
                                        </Link>{' '}
                                        et notre{' '}
                                        <Link
                                            href={route(
                                                'pages.show',
                                                'politique-confidentialite',
                                            )}
                                            className="text-amber-400 underline hover:text-amber-300"
                                        >
                                            Politique de confidentialité
                                        </Link>
                                        .
                                    </>
                                ) : (
                                    <>
                                        By subscribing, you accept our{' '}
                                        <Link
                                            href={route(
                                                'pages.show',
                                                'conditions-utilisation',
                                            )}
                                            className="text-amber-400 underline hover:text-amber-300"
                                        >
                                            Terms of Use
                                        </Link>{' '}
                                        and{' '}
                                        <Link
                                            href={route(
                                                'pages.show',
                                                'politique-confidentialite',
                                            )}
                                            className="text-amber-400 underline hover:text-amber-300"
                                        >
                                            Privacy Policy
                                        </Link>
                                        .
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section du bas du footer */}
                <div className="border-t border-white/10">
                    <div className="container mx-auto px-4 py-8">
                        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                            {/* Copyright */}
                            <div className="text-sm text-gray-400">
                                {i18n.language === 'fr' ? (
                                    <>
                                        Copyright {new Date().getFullYear()}{' '}
                                        <Link
                                            href={route('home')}
                                            className="text-amber-400 transition-colors duration-300 hover:text-amber-300"
                                        >
                                            {siteName}
                                        </Link>
                                        . Tous droits réservés.
                                    </>
                                ) : (
                                    <>
                                        Copyright {new Date().getFullYear()}{' '}
                                        <Link
                                            href={route('home')}
                                            className="text-amber-400 transition-colors duration-300 hover:text-amber-300"
                                        >
                                            {siteName}
                                        </Link>
                                        . All rights reserved.
                                    </>
                                )}
                            </div>

                            {/* Réseaux sociaux */}
                            <div className="flex items-center gap-4">
                                <span className="mr-2 text-sm text-gray-400">
                                    {t('follow_us')}:
                                </span>
                                <a
                                    href={facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-10 w-10 transform items-center justify-center rounded-full bg-white/10 text-gray-400 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-blue-400/20 hover:text-blue-400"
                                    aria-label="Facebook"
                                >
                                    <Facebook className="h-5 w-5" />
                                </a>
                                <a
                                    href={twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-10 w-10 transform items-center justify-center rounded-full bg-white/10 text-gray-400 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-blue-400/20 hover:text-blue-400"
                                    aria-label="Twitter"
                                >
                                    <Twitter className="h-5 w-5" />
                                </a>
                                <a
                                    href={linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-10 w-10 transform items-center justify-center rounded-full bg-white/10 text-gray-400 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-blue-600/20 hover:text-blue-600"
                                    aria-label="LinkedIn"
                                >
                                    <Linkedin className="h-5 w-5" />
                                </a>
                                <a
                                    href={instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-10 w-10 transform items-center justify-center rounded-full bg-white/10 text-gray-400 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-pink-500/20 hover:text-pink-500"
                                    aria-label="Instagram"
                                >
                                    <Instagram className="h-5 w-5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
