import { Link, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Heart, MapPin, Bath, Bed, Maximize2, ArrowRight, Camera } from 'lucide-react';
import { useState } from 'react';

function formatPrice(price: number): string {
    return price.toLocaleString('fr-FR', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
}

function isNewProperty(createdAt: string): boolean {
    const diff = Date.now() - new Date(createdAt).getTime();
    return diff < 30 * 24 * 60 * 60 * 1000;
}

export default function PropertyCardHome({
    property,
    favorites,
    viewMode = 'grid',
}: {
    property: any;
    favorites: number[];
    viewMode?: 'grid' | 'list';
}) {
    const { t } = useTranslation();
    const user = usePage().props.auth?.user;
    const [isFavorite, setIsFavorite] = useState(favorites.includes(property.id));
    const [hovered, setHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const toggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFavorite(!isFavorite);
        router.post(route('dashboard.properties.favorite', property.id), {}, {
            preserveScroll: !!user,
            onError: () => setIsFavorite(isFavorite),
        });
    };

    const imageUrl = property.images?.[0]?.url
        ? `/storage/${property.images[0].url}`
        : null;

    const badgeText = property.featured
        ? t('featured')
        : property.created_at && isNewProperty(property.created_at)
        ? t('new')
        : null;

    const saleTypeBadge = property.sale_type === 'rent'
        ? <span className="badge-rent">{t('rent')}</span>
        : <span className="badge-sale">{t('sale')}</span>;

    // ── Vue Liste ──
    if (viewMode === 'list') {
        return (
            <div
                className="card-premium flex flex-col overflow-hidden sm:flex-row"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {/* Image */}
                <div className="relative h-48 w-full shrink-0 overflow-hidden sm:h-auto sm:w-64">
                    <Link href={route('property.show', property.id)} className="block h-full w-full">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={property.title}
                                className={`h-full w-full object-cover transition-transform duration-500 ${hovered ? 'scale-105' : 'scale-100'}`}
                                onLoad={() => setImageLoaded(true)}
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-[#1E3A5F]/10 min-h-[200px]">
                                <MapPin className="h-10 w-10 text-[#1E3A5F]/20" />
                            </div>
                        )}
                        {!imageLoaded && imageUrl && (
                            <div className="absolute inset-0 skeleton" />
                        )}
                    </Link>
                    <div className="absolute top-3 left-3">{saleTypeBadge}</div>
                    {badgeText && (
                        <div className="absolute top-3 left-16 rounded-full bg-[#C9A84C] px-2 py-0.5 text-xs font-bold text-white">
                            {badgeText}
                        </div>
                    )}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-xs text-white backdrop-blur-sm">
                        <Camera className="h-3 w-3" />
                        <span>{property.images?.length || 1}</span>
                    </div>
                    {user && (
                        <button
                            onClick={toggleFavorite}
                            className={`absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full shadow-md transition-all duration-200 ${
                                isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-400 hover:bg-red-500 hover:text-white'
                            }`}
                        >
                            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                        </button>
                    )}
                </div>

                {/* Contenu */}
                <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                        <div className="mb-1 flex items-start justify-between gap-2">
                            <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-[#1E3A5F]">
                                <Link href={route('property.show', property.id)} className="hover:text-[#1E3A5F] transition-colors">
                                    {property.title}
                                </Link>
                            </h3>
                            <span className="shrink-0 text-xl font-extrabold text-[#C9A84C]">
                                {formatPrice(property.price)}
                            </span>
                        </div>
                        {property.location && (
                            <div className="mb-3 flex items-center gap-1 text-sm text-gray-500">
                                <MapPin className="h-3.5 w-3.5 text-[#C9A84C] shrink-0" />
                                <span className="line-clamp-1">{property.location}</span>
                            </div>
                        )}
                        {property.description && (
                            <p className="mb-4 text-sm leading-relaxed text-gray-500 line-clamp-2">
                                {property.description}
                            </p>
                        )}
                    </div>
                    <div>
                        <div className="mb-4 flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-1.5 text-gray-600">
                                <Bed className="h-4 w-4 text-[#C9A84C]" />
                                <span className="font-semibold">{property.bedrooms || 0}</span>
                                <span className="text-gray-400 text-xs">{t('bedroom')}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-600">
                                <Bath className="h-4 w-4 text-[#C9A84C]" />
                                <span className="font-semibold">{property.bathrooms || 0}</span>
                                <span className="text-gray-400 text-xs">{t('bathroom')}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-600">
                                <Maximize2 className="h-4 w-4 text-[#C9A84C]" />
                                <span className="font-semibold">{property.surface || 0}</span>
                                <span className="text-gray-400 text-xs">m²</span>
                            </div>
                        </div>
                        <Link
                            href={route('property.show', property.id)}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#1E3A5F] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#152C47] hover:shadow-lg hover:-translate-y-0.5"
                        >
                            {t('view_details')}
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
                <Link href={route('property.show', property.id)} className="block h-full w-full">
                    {imageUrl ? (
                        <>
                            {!imageLoaded && <div className="absolute inset-0 skeleton" />}
                            <img
                                src={imageUrl}
                                alt={property.title}
                                className={`h-full w-full object-cover transition-transform duration-500 ${hovered ? 'scale-105' : 'scale-100'}`}
                                onLoad={() => setImageLoaded(true)}
                            />
                        </>
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#1E3A5F]/8">
                            <MapPin className="h-10 w-10 text-[#1E3A5F]/20" />
                        </div>
                    )}

                    {/* Overlay subtil */}
                    <div
                        className={`absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}
                    />
                </Link>

                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                    {saleTypeBadge}
                    {badgeText && (
                        <span className="rounded-full bg-[#C9A84C] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                            {badgeText}
                        </span>
                    )}
                </div>

                {/* Compteur photos */}
                <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-xs text-white backdrop-blur-sm">
                    <Camera className="h-3 w-3" />
                    <span>{property.images?.length || 1}</span>
                </div>

                {/* Favori */}
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
                <div className="mb-2 flex items-center justify-between">
                    <span className="text-xl font-extrabold text-[#1E3A5F]">
                        {formatPrice(property.price)}
                    </span>
                    {property.sale_type === 'rent' && (
                        <span className="text-xs text-gray-400">/mois</span>
                    )}
                </div>

                {/* Titre */}
                <h3 className="mb-2 text-sm font-bold text-gray-900 line-clamp-2 transition-colors duration-200 group-hover:text-[#1E3A5F]">
                    <Link href={route('property.show', property.id)}>
                        {property.title}
                    </Link>
                </h3>

                {/* Localisation */}
                {property.location && (
                    <div className="mb-3 flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-[#C9A84C]" />
                        <span className="line-clamp-1">{property.location}</span>
                    </div>
                )}

                {/* Séparateur */}
                <div className="mb-3 h-px bg-gray-100" />

                {/* Features */}
                <div className="mb-4 flex items-center gap-3 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                        <Bed className="h-3.5 w-3.5 text-[#C9A84C]" />
                        <span className="font-semibold text-gray-800">{property.bedrooms || 0}</span>
                        <span className="text-gray-400">{t('bedroom')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Bath className="h-3.5 w-3.5 text-[#C9A84C]" />
                        <span className="font-semibold text-gray-800">{property.bathrooms || 0}</span>
                        <span className="text-gray-400">{t('bathroom')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Maximize2 className="h-3.5 w-3.5 text-[#C9A84C]" />
                        <span className="font-semibold text-gray-800">{property.surface || 0}</span>
                        <span className="text-gray-400">m²</span>
                    </div>
                </div>

                {/* CTA */}
                <Link
                    href={route('property.show', property.id)}
                    className={`mt-auto flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${
                        hovered
                            ? 'bg-[#1E3A5F] text-white shadow-md'
                            : 'bg-gray-50 text-gray-700 hover:bg-[#1E3A5F] hover:text-white'
                    }`}
                >
                    {t('view_details')}
                    <ArrowRight className={`h-4 w-4 transition-transform duration-200 ${hovered ? 'translate-x-0.5' : ''}`} />
                </Link>
            </div>
        </div>
    );
}