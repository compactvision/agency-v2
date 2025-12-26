import i18n from '@/i18n';
import { Link, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import { 
    Home, 
    Building, 
    Key, 
    Mail, 
    Send, 
    Phone, 
    MapPin, 
    Facebook, 
    Twitter, 
    Linkedin, 
    Instagram,
    ArrowRight,
    ChevronRight,
    Shield,
    TrendingUp,
    Heart,
    Star,
    Globe,
    Users,
    FileText,
    HelpCircle,
    DollarSign,
    Package
} from 'lucide-react';

export default function Footer() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);
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
            { threshold: 0.1 }
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

        setLoading(true);
        
        // Simuler une inscription
        setTimeout(() => {
            setLoading(false);
            setSubscribed(true);
            setEmail('');
            
            // Réinitialiser après 3 secondes
            setTimeout(() => {
                setSubscribed(false);
            }, 3000);
        }, 1000);
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
            <footer ref={footerRef} className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
                {/* Formes décoratives de fond */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-400/5 rounded-full filter blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/5 rounded-full filter blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/3 rounded-full filter blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 py-16 lg:py-24">
                    {/* Section des fonctionnalités */}
                    <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 transition-all duration-1000 transform ${
                        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                        {/* Carte "Acheter une maison" */}
                        <div className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-white/5">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <Home className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                                    {t('buy_a_home')}
                                </h3>
                            </div>
                            <p className="text-gray-300 mb-6 leading-relaxed">
                                {i18n.language === 'fr' 
                                    ? 'Trouvez rapidement la maison parfaite à acheter grâce à nos annonces.'
                                    : 'Quickly find the perfect home to buy with our listings.'
                                }
                            </p>
                            <button 
                                onClick={() => handleSearch('sale')}
                                className="inline-flex items-center gap-2 text-blue-400 font-medium hover:text-blue-300 transition-colors duration-300"
                            >
                                {t('explore_properties')}
                                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                            </button>
                        </div>

                        {/* Carte "Vendre une maison" */}
                        <div className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-white/5">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <Building className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white group-hover:text-green-400 transition-colors duration-300">
                                    {t('sell_a_home')}
                                </h3>
                            </div>
                            <p className="text-gray-300 mb-6 leading-relaxed">
                                {i18n.language === 'fr' 
                                    ? 'Publiez votre annonce et trouvez rapidement un acheteur sérieux.'
                                    : 'Post your listing and quickly find a serious buyer.'
                                }
                            </p>
                            <button 
                                onClick={() => router.get(route('dashboard.properties.create'))}
                                className="inline-flex items-center gap-2 text-green-400 font-medium hover:text-green-300 transition-colors duration-300"
                            >
                                {t('list_property')}
                                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                            </button>
                        </div>

                        {/* Carte "Louer une maison" */}
                        <div className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-white/5">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-gradient-to-r from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <Key className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white group-hover:text-amber-400 transition-colors duration-300">
                                    {t('rent_a_home')}
                                </h3>
                            </div>
                            <p className="text-gray-300 mb-6 leading-relaxed">
                                {i18n.language === 'fr' 
                                    ? 'Trouvez facilement la maison idéale à louer près de chez vous.'
                                    : 'Easily find the ideal rental home near you.'
                                }
                            </p>
                            <button 
                                onClick={() => handleSearch('rent')}
                                className="inline-flex items-center gap-2 text-amber-400 font-medium hover:text-amber-300 transition-colors duration-300"
                            >
                                {t('explore_rentals')}
                                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                            </button>
                        </div>
                    </div>

                    {/* Section des liens et newsletter */}
                    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 transition-all duration-1000 delay-300 transform ${
                        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                        {/* Services */}
                        <div>
                            <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Package className="w-5 h-5 text-amber-400" />
                                {t('our_services')}
                            </h4>
                            <ul className="space-y-3">
                                <li>
                                    <button
                                        onClick={() => handleSearch('rent')}
                                        className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center gap-2"
                                    >
                                        <Home className="w-4 h-4" />
                                        {t('rent_properties')}
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handleSearch('sale')}
                                        className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center gap-2"
                                    >
                                        <Building className="w-4 h-4" />
                                        {t('sell_properties')}
                                    </button>
                                </li>
                                <li>
                                    <Link
                                        href={route('pages.show', 'conditions-utilisation')}
                                        className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center gap-2"
                                    >
                                        <FileText className="w-4 h-4" />
                                        {t('terms_of_service')}
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Liens rapides */}
                        <div>
                            <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-amber-400" />
                                {t('quick_link')}
                            </h4>
                            <ul className="space-y-3">
                                <li>
                                    <Link href={route('properties')} className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center gap-2">
                                        <Home className="w-4 h-4" />
                                        {t('all_properties')}
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route('faq')} className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center gap-2">
                                        <HelpCircle className="w-4 h-4" />
                                        FAQ
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route('tarifs')} className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center gap-2">
                                        <DollarSign className="w-4 h-4" />
                                        {t('our_pricing')}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={route('pages.show', 'politique-confidentialite')}
                                        className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center gap-2"
                                    >
                                        <Shield className="w-4 h-4" />
                                        {t('privacy_policy')}
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Phone className="w-5 h-5 text-amber-400" />
                                {t('contact_us')}
                            </h4>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-2 text-gray-300">
                                    <Mail className="w-4 h-4 text-amber-400" />
                                    <span>contact@{siteName.toLowerCase().replace(/\s+/g, '')}.com</span>
                                </li>
                                <li className="flex items-center gap-2 text-gray-300">
                                    <Phone className="w-4 h-4 text-amber-400" />
                                    <span>+1 800 123 456 789</span>
                                </li>
                                <li className="flex items-center gap-2 text-gray-300">
                                    <MapPin className="w-4 h-4 text-amber-400" />
                                    <span>123 Main Street, City, Country</span>
                                </li>
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Mail className="w-5 h-5 text-amber-400" />
                                {t('subscribe_newsletter')}
                            </h4>
                            <p className="text-gray-300 mb-6">
                                {t('footer_newsletter_paragraph')}
                            </p>
                            <form onSubmit={handleSubscribe} className="space-y-4">
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={i18n.language === 'fr' ? 'Adresse e-mail' : 'Email Address'}
                                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300"
                                        required
                                    />
                                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading || subscribed}
                                    className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                                        subscribed
                                            ? 'bg-green-500 text-white'
                                            : loading
                                                ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-amber-400 to-amber-600 text-white hover:from-amber-500 hover:to-amber-700 transform hover:scale-105 hover:shadow-lg hover:shadow-amber-500/25'
                                    }`}
                                >
                                    {subscribed ? (
                                        <>
                                            <span className="flex items-center gap-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                {t('subscribed') || 'Inscrit !'}
                                            </span>
                                        </>
                                    ) : loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            {t('loading') || 'Chargement...'}
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            {t('subscribe') || 'S\'inscrire'}
                                        </>
                                    )}
                                </button>
                            </form>
                            <p className="text-xs text-gray-400 mt-4">
                                {i18n.language === 'fr' ? (
                                    <>
                                        En vous abonnant, vous acceptez nos{' '}
                                        <Link href={route('pages.show', 'conditions-utilisation')} className="text-amber-400 hover:text-amber-300 underline">
                                            Conditions d'utilisation
                                        </Link>{' '}
                                        et notre{' '}
                                        <Link href={route('pages.show', 'politique-confidentialite')} className="text-amber-400 hover:text-amber-300 underline">
                                            Politique de confidentialité
                                        </Link>.
                                    </>
                                ) : (
                                    <>
                                        By subscribing, you accept our{' '}
                                        <Link href={route('pages.show', 'conditions-utilisation')} className="text-amber-400 hover:text-amber-300 underline">
                                            Terms of Use
                                        </Link>{' '}
                                        and{' '}
                                        <Link href={route('pages.show', 'politique-confidentialite')} className="text-amber-400 hover:text-amber-300 underline">
                                            Privacy Policy
                                        </Link>.
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section du bas du footer */}
                <div className="border-t border-white/10">
                    <div className="container mx-auto px-4 py-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            {/* Copyright */}
                            <div className="text-gray-400 text-sm">
                                {i18n.language === 'fr' ? (
                                    <>
                                        Copyright {new Date().getFullYear()}{' '}
                                        <Link href={route('home')} className="text-amber-400 hover:text-amber-300 transition-colors duration-300">
                                            {siteName}
                                        </Link>
                                        . Tous droits réservés.
                                    </>
                                ) : (
                                    <>
                                        Copyright {new Date().getFullYear()}{' '}
                                        <Link href={route('home')} className="text-amber-400 hover:text-amber-300 transition-colors duration-300">
                                            {siteName}
                                        </Link>
                                        . All rights reserved.
                                    </>
                                )}
                            </div>

                            {/* Réseaux sociaux */}
                            <div className="flex items-center gap-4">
                                <span className="text-gray-400 text-sm mr-2">{t('follow_us')}:</span>
                                <a
                                    href={facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-blue-400 hover:bg-blue-400/20 transition-all duration-300 transform hover:scale-110"
                                    aria-label="Facebook"
                                >
                                    <Facebook className="w-5 h-5" />
                                </a>
                                <a
                                    href={twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-blue-400 hover:bg-blue-400/20 transition-all duration-300 transform hover:scale-110"
                                    aria-label="Twitter"
                                >
                                    <Twitter className="w-5 h-5" />
                                </a>
                                <a
                                    href={linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-600/20 transition-all duration-300 transform hover:scale-110"
                                    aria-label="LinkedIn"
                                >
                                    <Linkedin className="w-5 h-5" />
                                </a>
                                <a
                                    href={instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-pink-500 hover:bg-pink-500/20 transition-all duration-300 transform hover:scale-110"
                                    aria-label="Instagram"
                                >
                                    <Instagram className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}