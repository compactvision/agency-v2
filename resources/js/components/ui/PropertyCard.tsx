import { Link, router, usePage } from '@inertiajs/react';
import { ArrowRight, Bath, Bed, Heart, Home, MapPin, Maximize2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface PageProps {
    auth?: { user?: any };
    [key: string]: any;
}

function formatPrice(price: number, saleType: string): string {
    const formatted = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
    return saleType === 'rent' ? `${formatted}/mois` : formatted;
}

export default function PropertyCard({
    property,
    favorites,
    isListView = false,
}: {
    property: any;
    favorites: number[];
    isListView?: boolean;
}) {
    const { t } = useTranslation();
    const { props } = usePage<PageProps>();
    const user = props.auth?.user;
    const [isFavorite, setIsFavorite] = useState(favorites.includes(property.id));
    const [hovered, setHovered] = useState(false);

    const toggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFavorite(!isFavorite);
        router.post(route('dashboard.properties.favorite', property.id), {}, {
            preserveScroll: true,
            onError: () => setIsFavorite(isFavorite),
        });
    };

    const imageUrl = property.images?.[0]?.url
        ? `/storage/${property.images[0].url}`
        : null;

    const saleTypeBadge = property.sale_type === 'rent' ? (
        <span className="badge-rent">{t('rent')}</span>
    ) : (
        <span className="badge-sale">{t('sale')}</span>
    );

    // ── Vue Liste ──
    if (isListView) {
        return (
            <div className="card-premium flex flex-col overflow-hidden md:flex-row">
                {/* Image */}
                <div className="relative h-52 w-full shrink-0 overflow-hidden md:h-auto md:w-72">
                    <Link href={route('property.show', property.slug)} className="block h-full w-full">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={property.title}
                                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1E3A5F]/10 to-[#C9A84C]/10">
                                <Home size={40} className="text-[#1E3A5F]/30" />
                            </div>
                        )}
                    </Link>
                    {/* Badge */}
                    <div className="absolute top-3 left-3">{saleTypeBadge}</div>
                    {/* Favori */}
                    {user && (
                        <button
                            onClick={toggleFavorite}
                            className={`absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full shadow-md transition-all duration-200 ${
                                isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-500 hover:bg-red-500 hover:text-white'
                            }`}
                        >
                            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                        </button>
                    )}
                </div>

                {/* Contenu */}
                <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                        <h3 className="mb-1.5 text-lg font-bold text-gray-900 line-clamp-1">
                            <Link href={route('property.show', property.slug)} className="hover:text-[#1E3A5F] transition-colors">
                                {property.title}
                            </Link>
                        </h3>
                        {property.location && (
                            <div className="mb-4 flex items-center gap-1 text-sm text-gray-500">
                                <MapPin className="h-3.5 w-3.5 text-[#C9A84C]" />
                                <span>{property.location}</span>
                            </div>
                        )}
                        {property.description && (
                            <p className="mb-4 text-sm leading-relaxed text-gray-500 line-clamp-2">
                                {property.description}
                            </p>
                        )}
                        {/* Features */}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1.5">
                                <Bed className="h-4 w-4 text-[#C9A84C]" />
                                <span className="font-medium">{property.bedrooms}</span>
                                <span className="text-gray-400">{t('bedroom')}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Bath className="h-4 w-4 text-[#C9A84C]" />
                                <span className="font-medium">{property.bathrooms}</span>
                                <span className="text-gray-400">{t('bathroom')}</span>
                            </div>
                            {property.area && (
                                <div className="flex items-center gap-1.5">
                                    <Maximize2 className="h-4 w-4 text-[#C9A84C]" />
                                    <span className="font-medium">{property.area}</span>
                                    <span className="text-gray-400">m²</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Prix + CTA */}
                    <div className="mt-4 flex items-center justify-between">
                        <div>
                            <span className="text-2xl font-extrabold text-[#1E3A5F]">
                                {formatPrice(property.price, property.sale_type)}
                            </span>
                        </div>
                        <Link
                            href={route('property.show', property.slug)}
                            className="flex items-center gap-2 rounded-xl bg-[#1E3A5F] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#152C47] hover:shadow-lg hover:-translate-y-0.5"
                        >
                            {t('show_details')}
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ── Vue Grille ──
    return (
        <div
            className="card-premium group relative flex flex-col overflow-hidden"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Image */}
            <div className="relative h-52 overflow-hidden">
                <Link href={route('property.show', property.slug)} className="block h-full w-full">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={property.title}
                            className={`h-full w-full object-cover transition-transform duration-500 ${hovered ? 'scale-108' : 'scale-100'}`}
                            style={{ transform: hovered ? 'scale(1.08)' : 'scale(1)' }}
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1E3A5F]/10 to-[#C9A84C]/10">
                            <Home size={40} className="text-[#1E3A5F]/30" />
                        </div>
                    )}
                    {/* Overlay au hover */}
                    <div
                        className={`absolute inset-0 bg-gradient-to-t from-black/40 to-transparent transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}
                    />
                </Link>

                {/* Badge statut */}
                <div className="absolute top-3 left-3 z-10">{saleTypeBadge}</div>

                {/* Bouton favori */}
                {user && (
                    <button
                        onClick={toggleFavorite}
                        className={`absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full shadow-md transition-all duration-200 ${
                            isFavorite
                                ? 'bg-red-500 text-white'
                                : 'bg-white/90 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white'
                        }`}
                        title={isFavorite ? t('remove_from_favorites') : t('add_to_favorites')}
                    >
                        <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                )}
            </div>

            {/* Contenu */}
            <div className="flex flex-1 flex-col p-5">
                {/* Prix */}
                <div className="mb-3 flex items-start justify-between">
                    <span className="text-xl font-extrabold text-[#1E3A5F] leading-tight">
                        {formatPrice(property.price, property.sale_type)}
                    </span>
                    {property.sale_type === 'rent' && (
                        <span className="mt-1 text-xs text-gray-400">/mois</span>
                    )}
                </div>

                {/* Titre */}
                <h3 className="mb-2 text-base font-bold text-gray-900 line-clamp-2 group-hover:text-[#1E3A5F] transition-colors duration-200">
                    <Link href={route('property.show', property.slug)}>
                        {property.title}
                    </Link>
                </h3>

                {/* Localisation */}
                {property.location && (
                    <div className="mb-4 flex items-center gap-1.5 text-sm text-gray-500">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-[#C9A84C]" />
                        <span className="line-clamp-1">{property.location}</span>
                    </div>
                )}

                {/* Séparateur */}
                <div className="mb-4 h-px bg-gray-100" />

                {/* Features */}
                <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                        <Bed className="h-4 w-4 text-[#C9A84C]" />
                        <span className="font-semibold text-gray-800">{property.bedrooms ?? 0}</span>
                        <span className="text-gray-400 text-xs">{t('bedroom')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Bath className="h-4 w-4 text-[#C9A84C]" />
                        <span className="font-semibold text-gray-800">{property.bathrooms ?? 0}</span>
                        <span className="text-gray-400 text-xs">{t('bathroom')}</span>
                    </div>
                    {(property.surface || property.area) && (
                        <div className="flex items-center gap-1.5">
                            <Maximize2 className="h-4 w-4 text-[#C9A84C]" />
                            <span className="font-semibold text-gray-800">{property.surface || property.area}</span>
                            <span className="text-gray-400 text-xs">m²</span>
                        </div>
                    )}
                </div>

                {/* CTA */}
                <div className="mt-auto">
                    <Link
                        href={route('property.show', property.slug)}
                        className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${
                            hovered
                                ? 'bg-[#1E3A5F] text-white shadow-lg'
                                : 'bg-gray-50 text-gray-700 hover:bg-[#1E3A5F] hover:text-white'
                        }`}
                    >
                        {t('show_details')}
                        <ArrowRight className={`h-4 w-4 transition-transform duration-200 ${hovered ? 'translate-x-0.5' : ''}`} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
