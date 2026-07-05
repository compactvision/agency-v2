import i18n from '@/i18n';
import { Link, router, usePage } from '@inertiajs/react';
import {
    Building,
    ChevronRight,
    Facebook,
    Home,
    Instagram,
    Key,
    Linkedin,
    Mail,
    MapPin,
    Phone,
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

    const { settings } = usePage().props as unknown as { settings: any };

    // Prépare les valeurs avec fallback
    const facebook = settings?.facebook ?? '#';
    const twitter = settings?.twitter ?? '#';
    const linkedin = settings?.linkedin ?? '#';
    const instagram = settings?.instagram ?? '#';
    const siteName = settings?.site_name ?? 'Agency.';
    const emailToDisplay = settings?.app_email ?? 'contact@agency.com';
    const phoneToDisplay = settings?.numero ?? '+1 234 567 890';
    const addressToDisplay =
        settings?.adresse ?? '123 Premium Avenue, New York';

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setVisible(true);
            },
            { threshold: 0.1 },
        );
        if (footerRef.current) observer.observe(footerRef.current);
        return () => {
            if (footerRef.current) observer.unobserve(footerRef.current);
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
        router.get(
            route('properties'),
            { sale_type: type ?? '' },
            { preserveState: true },
        );
    };

    return (
        <footer
            ref={footerRef}
            className="relative bg-[#0d2340] pt-20 pb-10 text-white"
        >
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Top Section - Feature Cards */}
                <div
                    className={`mb-20 grid grid-cols-1 gap-6 transition-all duration-1000 md:grid-cols-3 ${
                        visible
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-10 opacity-0'
                    }`}
                >
                    {/* Acheter */}
                    <div className="group rounded-2xl border border-white/10 bg-white/5 p-8 transition-all duration-300 hover:bg-white/10">
                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#C9A84C]/20 text-[#C9A84C] transition-colors duration-300 group-hover:bg-[#C9A84C] group-hover:text-white">
                            <Home className="h-7 w-7" />
                        </div>
                        <h3 className="mb-4 text-2xl font-bold text-white">
                            {t('buy_a_home', 'Acheter un bien')}
                        </h3>
                        <p className="mb-6 text-sm leading-relaxed text-gray-400">
                            {i18n.language === 'fr'
                                ? 'Trouvez rapidement la maison parfaite à acheter grâce à nos annonces exclusives.'
                                : 'Quickly find the perfect home to buy with our exclusive listings.'}
                        </p>
                        <button
                            onClick={() => handleSearch('sale')}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#C9A84C] transition-colors hover:text-white"
                        >
                            {t('explore_properties', 'Explorer')}
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Vendre */}
                    <div className="group rounded-2xl border border-white/10 bg-white/5 p-8 transition-all duration-300 hover:bg-white/10">
                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#C9A84C]/20 text-[#C9A84C] transition-colors duration-300 group-hover:bg-[#C9A84C] group-hover:text-white">
                            <Building className="h-7 w-7" />
                        </div>
                        <h3 className="mb-4 text-2xl font-bold text-white">
                            {t('sell_a_home', 'Vendre un bien')}
                        </h3>
                        <p className="mb-6 text-sm leading-relaxed text-gray-400">
                            {i18n.language === 'fr'
                                ? 'Publiez votre annonce et trouvez rapidement un acheteur sérieux parmi notre réseau.'
                                : 'Post your listing and quickly find a serious buyer from our network.'}
                        </p>
                        <button
                            onClick={() =>
                                router.get(route('dashboard.properties.create'))
                            }
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#C9A84C] transition-colors hover:text-white"
                        >
                            {t('list_property', 'Publier une annonce')}
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Louer */}
                    <div className="group rounded-2xl border border-white/10 bg-white/5 p-8 transition-all duration-300 hover:bg-white/10">
                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#C9A84C]/20 text-[#C9A84C] transition-colors duration-300 group-hover:bg-[#C9A84C] group-hover:text-white">
                            <Key className="h-7 w-7" />
                        </div>
                        <h3 className="mb-4 text-2xl font-bold text-white">
                            {t('rent_a_home', 'Louer un bien')}
                        </h3>
                        <p className="mb-6 text-sm leading-relaxed text-gray-400">
                            {i18n.language === 'fr'
                                ? 'Trouvez facilement la maison idéale à louer près de chez vous avec des options premium.'
                                : 'Easily find the ideal rental home near you with premium options.'}
                        </p>
                        <button
                            onClick={() => handleSearch('rent')}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#C9A84C] transition-colors hover:text-white"
                        >
                            {t('explore_rentals', 'Explorer les locations')}
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Main Footer Content */}
                <div
                    className={`mb-16 grid grid-cols-1 gap-12 transition-all delay-200 duration-1000 md:grid-cols-2 lg:grid-cols-4 lg:gap-8 ${
                        visible
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-10 opacity-0'
                    }`}
                >
                    {/* Brand & Contact */}
                    <div>
                        <div className="mb-6 flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C9A84C] text-white">
                                <span className="text-xl font-black">A</span>
                            </div>
                            <span className="text-2xl font-bold tracking-tight">
                                Agency<span className="text-[#C9A84C]">.</span>
                            </span>
                        </div>
                        <p className="mb-6 text-sm leading-relaxed text-gray-400">
                            {i18n.language === 'fr'
                                ? "L'excellence immobilière à portée de main. Découvrez des propriétés d'exception avec un service premium."
                                : 'Real estate excellence at your fingertips. Discover exceptional properties with premium service.'}
                        </p>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex items-start gap-3">
                                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#C9A84C]" />
                                <span>{addressToDisplay}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 shrink-0 text-[#C9A84C]" />
                                <span>{phoneToDisplay}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 shrink-0 text-[#C9A84C]" />
                                <span>{emailToDisplay}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="mb-6 text-lg font-bold text-white">
                            {t('quick_link', 'Liens Rapides')}
                        </h4>
                        <ul className="space-y-4 text-sm">
                            <li>
                                <Link
                                    href={route('home')}
                                    className="text-gray-400 transition-colors hover:text-[#C9A84C]"
                                >
                                    {t('home', 'Accueil')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route('properties')}
                                    className="text-gray-400 transition-colors hover:text-[#C9A84C]"
                                >
                                    {t('properties', 'Propriétés')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route('about')}
                                    className="text-gray-400 transition-colors hover:text-[#C9A84C]"
                                >
                                    {t('about', 'À propos')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route('contact')}
                                    className="text-gray-400 transition-colors hover:text-[#C9A84C]"
                                >
                                    {t('contact', 'Contact')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="mb-6 text-lg font-bold text-white">
                            {t('our_services', 'Nos Services')}
                        </h4>
                        <ul className="space-y-4 text-sm">
                            <li>
                                <button
                                    onClick={() => handleSearch('sale')}
                                    className="text-gray-400 transition-colors hover:text-[#C9A84C]"
                                >
                                    {t('sell_properties', 'Acheter')}
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => handleSearch('rent')}
                                    className="text-gray-400 transition-colors hover:text-[#C9A84C]"
                                >
                                    {t('rent_properties', 'Louer')}
                                </button>
                            </li>
                            <li>
                                <Link
                                    href={route(
                                        'pages.show',
                                        'conditions-utilisation',
                                    )}
                                    className="text-gray-400 transition-colors hover:text-[#C9A84C]"
                                >
                                    {t(
                                        'terms_of_service',
                                        "Conditions d'utilisation",
                                    )}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route(
                                        'pages.show',
                                        'politique-confidentialite',
                                    )}
                                    className="text-gray-400 transition-colors hover:text-[#C9A84C]"
                                >
                                    {t(
                                        'privacy_policy',
                                        'Politique de confidentialité',
                                    )}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="mb-6 text-lg font-bold text-white">
                            {t('subscribe_newsletter', 'Newsletter')}
                        </h4>
                        <p className="mb-4 text-sm leading-relaxed text-gray-400">
                            {t(
                                'footer_newsletter_paragraph',
                                'Recevez nos dernières offres exclusives et actualités immobilières.',
                            )}
                        </p>
                        <form onSubmit={handleSubscribe} className="space-y-3">
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={
                                        i18n.language === 'fr'
                                            ? 'Votre email'
                                            : 'Your email'
                                    }
                                    className={`w-full rounded-xl border bg-[#152C47] px-4 py-3 text-sm text-white placeholder-gray-500 focus:ring-1 focus:ring-[#C9A84C] focus:outline-none ${
                                        error
                                            ? 'border-red-500'
                                            : 'border-white/10'
                                    }`}
                                    required
                                />
                            </div>
                            {error && (
                                <p className="text-xs text-red-500">{error}</p>
                            )}
                            <button
                                type="submit"
                                disabled={loading || subscribed}
                                className={`w-full rounded-xl px-4 py-3 text-sm font-bold text-white transition-all ${
                                    subscribed
                                        ? 'bg-green-600'
                                        : loading
                                          ? 'cursor-not-allowed bg-gray-600'
                                          : 'bg-[#C9A84C] hover:bg-[#A8882E]'
                                }`}
                            >
                                {subscribed
                                    ? t('subscribed', 'Inscrit !')
                                    : loading
                                      ? t('loading', 'Chargement...')
                                      : t('subscribe', "S'abonner")}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
                    <p className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} {siteName}.{' '}
                        {t('all_rights_reserved', 'Tous droits réservés.')}
                    </p>

                    {/* Socials */}
                    <div className="flex items-center gap-3">
                        {[
                            { icon: Facebook, href: facebook },
                            { icon: Twitter, href: twitter },
                            { icon: Linkedin, href: linkedin },
                            { icon: Instagram, href: instagram },
                        ].map((social, idx) => (
                            <a
                                key={idx}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-gray-400 transition-colors duration-300 hover:bg-[#C9A84C] hover:text-white"
                            >
                                <social.icon className="h-5 w-5" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
