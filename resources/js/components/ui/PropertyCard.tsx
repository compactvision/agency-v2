import React from 'react'
import { ArrowRight, Bath, Bed, MapPin, Heart, Calendar, Home, Square, Star } from 'lucide-react'
import { Link, router, usePage } from '@inertiajs/react'
import { useTranslation } from 'react-i18next';

export default function PropertyCard({ property, favorites, isListView = false }: { 
    property: any, 
    favorites: number[], 
    isListView?: boolean 
}) {
    const { t } = useTranslation();
    const { props } = usePage<PageProps>();
    const user = props.auth?.user;

    const toggleFavorite = (id: number) => {
        router.post(route('dashboard.properties.favorite', id), {}, { preserveScroll: true });
    };

    const formatPrice = (price: number, saleType: string) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price) + (saleType === 'rent' ? '/mois' : '');
    };

    // Ancien design pour la grille
    if (!isListView) {
        return (
            <div className="col-lg-4 col-sm-6">
                <div className="overflow-hidden relative transition-all duration-200 hover:bg-gray-50 before:absolute before:bottom-0 before:left-1/2 before:transform before:-translate-x-1/2 before:w-0 before:h-1 before:bg-gradient-to-r before:from-orange-400 before:to-orange-600 hover:before:w-full before:transition-all before:duration-200">
                    <div className="relative overflow-hidden max-h-[252px] flex rounded-t-md">
                        <Link href={route('property.show', property.id)} className="block w-full">
                            {property.images && property.images.length > 0 ? (
                                property.images.slice(0, 1).map((i: any) => (
                                    <img 
                                        src={`/storage/${i.url}`} 
                                        alt={`${property.title}`} 
                                        width={400} 
                                        height={400} 
                                        key={i.id}
                                        className="transition-transform duration-200 hover:scale-105 w-full h-full object-cover"
                                    />
                                ))
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                                    <Home size={48} className="text-amber-500" />
                                </div>
                            )}
                        </Link>
                    </div>
                    <div className="p-4 md:p-6 lg:p-7 text-gray-800 flex-grow bg-white shadow-md rounded-b-md md:rounded-r-md md:rounded-b-none md:ml-10 md:-mt-20 md:relative lg:ml-10 lg:-mt-20 lg:relative">
                        <h6 className="font-poppins font-semibold text-gray-800 mb-3 md:mb-4 lg:mb-5">
                            <Link href={route('property.show', property.id)} className="link block line-clamp-2 overflow-hidden">
                                {property.title}
                            </Link>
                        </h6>
                        <ul className="flex gap-5 mb-4">
                            <li className="flex items-center gap-2.5 text-sm opacity-80 font-light">
                                <span className="text-orange-500">
                                    <Bed color='#F69220' />
                                </span>
                                <span>{property.bedrooms} {t("bedroom")}</span>
                            </li>
                            <li className="flex items-center gap-2.5 text-sm opacity-80 font-light">
                                <span className="text-orange-500">
                                    <Bath color='#F69220' />
                                </span>
                                <span>{property.bathrooms} {t("bathroom")}</span>
                            </li>
                        </ul>
                        <div className="flex justify-between items-center mb-4">
                            <h6 className="font-poppins font-semibold text-gray-800">
                                {property.price}
                                {property.sale_type === 'rent' ? <span className="text-xs opacity-80 font-light">$/per month</span> : <span className="text-xs opacity-80 font-light">$</span>}
                            </h6>
                            {user && (
                                <button className="ml-2" onClick={() => toggleFavorite(property.id)} title="Ajouter aux favoris">
                                    <Star
                                        size={20}
                                        fill={favorites.includes(property.id) ? '#facc15' : 'none'}
                                        stroke="#facc15"
                                        className="transition duration-200"
                                    />
                                </button>
                            )}
                        </div>
                        <p className="text-gray-800 text-base md:text-lg font-normal mb-6 flex items-center gap-2">
                            <span className="text-orange-500 text-sm md:text-base">
                                <MapPin color='#F69220' />
                            </span>
                            {t("contact_the_owner")}
                        </p>
                        <Link href={route('property.show', property.id)} className="text-xs md:text-sm text-orange-500 font-semibold uppercase opacity-90 hover:opacity-100 flex items-center">
                            {t("show_details")}
                            <span className="ml-2.5 transition-all duration-200 hover:ml-3">
                                <ArrowRight color='#F69220' />
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Nouveau design pour la liste
    return (
        <div className="w-full">
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="relative overflow-hidden w-full md:w-80 h-48 md:h-auto">
                    <Link href={route('property.show', property.id)} className="block w-full h-full">
                        {property.images && property.images.length > 0 ? (
                            <img 
                                src={`/storage/${property.images[0].url}`} 
                                alt={property.title} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                                <Home size={48} className="text-amber-500" />
                            </div>
                        )}
                        
                        {/* Badge for sale/rent */}
                        <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-amber-600 shadow-md">
                            {property.sale_type === 'rent' ? t('rent') : t('sale')}
                        </div>
                        
                        {/* Favorite Button */}
                        {user && (
                            <button 
                                className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md transition-all duration-300 hover:bg-white hover:scale-110"
                                onClick={() => toggleFavorite(property.id)} 
                                title={favorites.includes(property.id) ? t('remove_from_favorites') : t('add_to_favorites')}
                            >
                                <Heart
                                    size={18}
                                    fill={favorites.includes(property.id) ? '#f59e0b' : 'none'}
                                    stroke="#f59e0b"
                                    className="transition-all duration-300"
                                />
                            </button>
                        )}
                    </Link>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-5">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        <Link href={route('property.show', property.id)} className="hover:text-amber-600 transition-colors">
                            {property.title}
                        </Link>
                    </h3>

                    {/* Location */}
                    <div className="flex items-center text-gray-600 mb-4">
                        <MapPin size={16} className="text-amber-500 mr-2" />
                        <span className="text-sm">{property.location || t('location_not_specified')}</span>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center text-gray-700">
                            <Bed size={18} className="text-amber-500 mr-2" />
                            <span className="text-sm font-medium">{property.bedrooms} {t("bedroom")}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <Bath size={18} className="text-amber-500 mr-2" />
                            <span className="text-sm font-medium">{property.bathrooms} {t("bathroom")}</span>
                        </div>
                        {property.area && (
                            <div className="flex items-center text-gray-700">
                                <Square size={18} className="text-amber-500 mr-2" />
                                <span className="text-sm font-medium">{property.area} m²</span>
                            </div>
                        )}
                    </div>

                    {/* Price and CTA */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="text-2xl font-bold text-gray-900">
                            {formatPrice(property.price, property.sale_type)}
                        </div>
                        
                        <Link 
                            href={route('property.show', property.id)} 
                            className="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                        >
                            {t("show_details")}
                            <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </div>

                    {/* Additional Info */}
                    {property.created_at && (
                        <div className="flex items-center text-gray-500 mt-4 text-xs">
                            <Calendar size={14} className="mr-1" />
                            {t('listed_on')}: {new Date(property.created_at).toLocaleDateString()}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}