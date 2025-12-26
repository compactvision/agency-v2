import App from '@/components/layouts/Home/App';
import Breadcumb from '@/components/ui/Breadcumb';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    LucideBath,
    LucideBed,
    LucideBuilding,
    LucideCalendar,
    LucideCheck,
    LucideEye,
    LucideHome,
    LucideLoader,
    LucideMapPin,
    LucidePhone,
    LucideRuler,
    LucideSchool,
    LucideWifi,
    LucideHeart,
    LucideShare2,
    LucideMaximize2,
    LucideX,
    LucideChevronLeft,
    LucideChevronRight,
    LucideStar,
    LucideCamera,
    LucideParkingCircle,
    LucideShield,
    LucideDroplets,
    LucideTrees,
    LucideSun,
    LucideLock,
    LucideChefHat,
    LucideFlame,
    LucideCopy,
    LucideNavigation,
    LucideClock,
    LucideAward,
    LucideUsers,
    LucideArmchair,
    LucideTv,
    LucideSnowflake,
    LucideDog,
    LucideBaby,
    LucideBriefcase,
    LucideCoffee,
    LucideWine,
    LucideUtensils,
    LucideBook,
    LucideMusic,
    LucideGamepad2,
    LucideDumbbell as LucideGym,
    LucidePlane,
    LucideTrain,
    LucideZoomIn,
    LucideZoomOut,
    LucideDownload,
    LucidePlay,
    LucidePause,
    LucideRotateCw,
    LucideGrid3x3,
    LucideList,
} from 'lucide-react';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export default function PropertyDetails({
    property,
    properties,
    arroundProperties,
    viewCount,
}: {
    property: any;
    properties: any;
    arroundProperties: any;
    viewCount: number;
}) {
    const [showNumber, setShowNumber] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showMoreFeatures, setShowMoreFeatures] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('overview');
    const [isFavorite, setIsFavorite] = useState(false);
    const [copiedToClipboard, setCopiedToClipboard] = useState(false);
    const [shareModal, setShareModal] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [selectedFloorPlan, setSelectedFloorPlan] = useState(0);
    const [galleryView, setGalleryView] = useState('grid');
    const [zoomLevel, setZoomLevel] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [autoPlay, setAutoPlay] = useState(false);
    const [showThumbnails, setShowThumbnails] = useState(true);
    const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();

    // Detect mobile device
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const amenityIcons = {
        wifi: <LucideWifi size={20} />,
        parking: <LucideParkingCircle size={20} />,
        school: <LucideSchool size={20} />,
        pool: <LucideDroplets size={20} />,
        gym: <LucideGym size={20} />,
        garden: <LucideTrees size={20} />,
        security: <LucideShield size={20} />,
        air_conditioning: <LucideSnowflake size={20} />,
        heating: <LucideFlame size={20} />,
        elevator: <LucideNavigation size={20} />,
        balcony: <LucideSun size={20} />,
        storage: <LucideLock size={20} />,
        pet_friendly: <LucideDog size={20} />,
        wheelchair_accessible: <LucideNavigation size={20} />,
        furnished: <LucideArmchair size={20} />,
        tv: <LucideTv size={20} />,
        playground: <LucideBaby size={20} />,
        business_center: <LucideBriefcase size={20} />,
        coffee_shop: <LucideCoffee size={20} />,
        bar: <LucideWine size={20} />,
        restaurant: <LucideUtensils size={20} />,
        library: <LucideBook size={20} />,
        music_room: <LucideMusic size={20} />,
        game_room: <LucideGamepad2 size={20} />,
        airport_shuttle: <LucidePlane size={20} />,
        public_transport: <LucideTrain size={20} />,
        default: <LucideCheck size={20} />,
    };

    function getAmenityIcon(amenityName: string) {
        const key = amenityName.toLowerCase().replace(/\s+/g, '_');
        return amenityIcons[key as keyof typeof amenityIcons] || amenityIcons.default;
    }

    const propertyFeatures = [
        {
            icon: <LucideBed className="w-5 h-5" />,
            label: t('bedrooms'),
            value: property.bedrooms,
            color: 'from-blue-500 to-blue-600',
        },
        {
            icon: <LucideBath className="w-5 h-5" />,
            label: t('bathrooms'),
            value: property.bathrooms,
            color: 'from-cyan-500 to-cyan-600',
        },
        {
            icon: <LucideRuler className="w-5 h-5" />,
            label: t('surface'),
            value: `${property.surface} m²`,
            color: 'from-emerald-500 to-emerald-600',
        },
        {
            icon: <LucideHome className="w-5 h-5" />,
            label: t('rooms'),
            value: property.rooms,
            color: 'from-violet-500 to-violet-600',
        },
    ];

    const openModal = (index: number) => {
        setCurrentIndex(index);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
        setZoomLevel(1);
        setRotation(0);
        setDragOffset({ x: 0, y: 0 });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        document.body.style.overflow = 'unset';
        setZoomLevel(1);
        setRotation(0);
        setDragOffset({ x: 0, y: 0 });
    };

    const nextImage = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % property.images.length);
        setZoomLevel(1);
        setRotation(0);
        setDragOffset({ x: 0, y: 0 });
    }, [property.images.length]);

    const prevImage = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
        setZoomLevel(1);
        setRotation(0);
        setDragOffset({ x: 0, y: 0 });
    }, [property.images.length]);

    const handleZoomIn = () => {
        const maxZoom = isMobile ? 2 : 3;
        setZoomLevel(prev => Math.min(prev + 0.25, maxZoom));
    };

    const handleZoomOut = () => {
        setZoomLevel(prev => Math.max(prev - 0.25, 1));
    };

    const handleRotate = () => {
        setRotation(prev => (prev + 90) % 360);
    };

    const handleReset = () => {
        setZoomLevel(1);
        setRotation(0);
        setDragOffset({ x: 0, y: 0 });
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = `/storage/${property.images[currentIndex]?.url}`;
        link.download = `${property.title}_${currentIndex + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Mouse handlers for desktop
    const handleMouseDown = (e: React.MouseEvent) => {
        if (zoomLevel > 1 && !isMobile) {
            e.preventDefault();
            setIsDragging(true);
            setDragStart({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && zoomLevel > 1 && !isMobile) {
            e.preventDefault();
            setDragOffset({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        if (!isMobile) {
            setIsDragging(false);
        }
    };

    // Touch handlers for mobile
    const handleTouchStart = (e: React.TouchEvent) => {
        if (zoomLevel > 1 && isMobile) {
            const touch = e.touches[0];
            setTouchStart({ x: touch.clientX, y: touch.clientY });
            setIsDragging(true);
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (isDragging && zoomLevel > 1 && isMobile) {
            e.preventDefault();
            const touch = e.touches[0];
            setDragOffset({
                x: touch.clientX - touchStart.x,
                y: touch.clientY - touchStart.y
            });
        }
    };

    const handleTouchEnd = () => {
        if (isMobile) {
            setIsDragging(false);
        }
    };

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!isModalOpen) return;
        
        switch (e.key) {
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
            case 'Escape':
                closeModal();
                break;
            case '+':
            case '=':
                handleZoomIn();
                break;
            case '-':
            case '_':
                handleZoomOut();
                break;
            case 'r':
            case 'R':
                handleRotate();
                break;
            case ' ':
                e.preventDefault();
                setAutoPlay(prev => !prev);
                break;
        }
    }, [isModalOpen, nextImage, prevImage]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    useEffect(() => {
        if (autoPlay && isModalOpen) {
            const interval = setInterval(() => {
                nextImage();
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [autoPlay, isModalOpen, nextImage]);

    const handleShowNumber = () => {
        setLoading(true);
        setTimeout(() => {
            setShowNumber(true);
            setLoading(false);
        }, 1500);
    };

    const handleCopyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedToClipboard(true);
            setTimeout(() => setCopiedToClipboard(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const handleShare = (platform: string) => {
        const url = window.location.href;
        const text = `Découvrez cette propriété: ${property.title}`;
        
        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
        };

        try {
            window.open(shareUrls[platform as keyof typeof shareUrls], '_blank', 'width=600,height=400');
        } catch (err) {
            console.error('Failed to open share URL: ', err);
        }
    };

    interface PageProps {
        auth: {
            user: {
                name?: string;
                email?: string;
                phone?: string;
                [key: string]: any;
            } | null;
        };
        [key: string]: any;
    }

    const user = (usePage().props as unknown as PageProps).auth.user;

    const { data, setData, post, processing, errors, reset } = useForm({
        phone: user?.phone || '',
        message: '',
        property_id: property.id,
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const toggleFavorite = (id: number) => {
        setIsFavorite(!isFavorite);
        router.post(route('dashboard.properties.favorite', id), {}, { preserveScroll: true });
    };

    // Close modals on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (shareModal) {
                    setShareModal(false);
                }
                if (isModalOpen) {
                    closeModal();
                }
            }
        };
        
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [shareModal, isModalOpen]);

    return (
        <App>
            <Head title={`${property.title}`} />
            <Breadcumb title={property.title} homeLink={route('home')} />

            {/* Hero Section Premium */}
            <section className="relative bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="container mx-auto px-4 py-8">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                        {/* Image Gallery Premium */}
                        <div className="relative">
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
                                <div className="lg:col-span-3">
                                    <div className="relative h-[500px] lg:h-[700px] overflow-hidden group">
                                        <img
                                            src={`/storage/${property.images[0]?.url}`}
                                            alt={property.title}
                                            className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                                            onLoad={() => setImageLoaded(true)}
                                        />
                                        
                                        {/* Loading Overlay */}
                                        {!imageLoaded && (
                                            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                                                <div className="flex flex-col items-center">
                                                    <LucideLoader size={40} className="animate-spin text-orange-500 mb-4" />
                                                    <p className="text-gray-500">{t('loading_image')}</p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                        
                                        {/* Action Buttons */}
                                        <div className="absolute top-6 right-6 flex flex-col gap-3">
                                            <button
                                                onClick={() => toggleFavorite(property.id)}
                                                className="p-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 group"
                                                title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                                            >
                                                <LucideHeart size={22} className={`transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700 group-hover:text-red-500'}`} />
                                            </button>
                                            <button
                                                onClick={() => setShareModal(true)}
                                                className="p-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 group"
                                                title="Partager"
                                            >
                                                <LucideShare2 size={22} className="text-gray-700 group-hover:text-blue-500 transition-colors" />
                                            </button>
                                            <button
                                                onClick={() => openModal(0)}
                                                className="p-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 group"
                                                title="Voir en plein écran"
                                            >
                                                <LucideMaximize2 size={22} className="text-gray-700 group-hover:text-purple-500 transition-colors" />
                                            </button>
                                        </div>

                                        {/* Status Badge */}
                                        <div className="absolute top-6 left-6">
                                            <span className={`inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold text-white shadow-xl ${
                                                property.sale_type === 'rent' 
                                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700' 
                                                    : 'bg-gradient-to-r from-emerald-600 to-emerald-700'
                                            }`}>
                                                {property.sale_type === 'rent' ? t('for_rent') : t('for_sale')}
                                            </span>
                                            {property.featured && (
                                                <span className="ml-3 inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold text-white shadow-xl bg-gradient-to-r from-amber-500 to-amber-600">
                                                    <LucideAward size={18} />
                                                    {t('featured')}
                                                </span>
                                            )}
                                        </div>

                                        {/* Image Counter */}
                                        <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full">
                                            <span className="text-white text-sm font-medium flex items-center gap-2">
                                                <LucideCamera size={18} />
                                                {currentIndex + 1} / {property.images.length} {t('photos')}
                                            </span>
                                        </div>

                                        {/* Navigation Arrows */}
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/30 hover:scale-110"
                                        >
                                            <LucideChevronLeft size={28} />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/30 hover:scale-110"
                                        >
                                            <LucideChevronRight size={28} />
                                        </button>

                                        {/* Gallery View Toggle */}
                                        <div className="absolute bottom-6 right-6 flex gap-2">
                                            <button
                                                onClick={() => setGalleryView('grid')}
                                                className={`p-2 rounded-lg transition-all duration-300 ${
                                                    galleryView === 'grid' 
                                                        ? 'bg-white/90 text-gray-900' 
                                                        : 'bg-white/50 text-white hover:bg-white/70'
                                                }`}
                                                title="Vue grille"
                                            >
                                                <LucideGrid3x3 size={20} />
                                            </button>
                                            <button
                                                onClick={() => setGalleryView('carousel')}
                                                className={`p-2 rounded-lg transition-all duration-300 ${
                                                    galleryView === 'carousel' 
                                                        ? 'bg-white/90 text-gray-900' 
                                                        : 'bg-white/50 text-white hover:bg-white/70'
                                                }`}
                                                title="Vue carrousel"
                                            >
                                                <LucideList size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Thumbnail Gallery */}
                                <div className="hidden lg:block lg:col-span-1">
                                    <div className="grid grid-rows-4 gap-2 h-full">
                                        {property.images.slice(1, 5).map((img, index) => (
                                            <div
                                                key={index}
                                                className="relative overflow-hidden rounded-xl group cursor-pointer"
                                                onClick={() => openModal(index + 1)}
                                            >
                                                <img
                                                    src={`/storage/${img.url}`}
                                                    alt={`${property.title} ${index + 2}`}
                                                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                                                    <LucideMaximize2 size={28} className="text-white" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Property Information */}
                        <div className="p-8 lg:p-12">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2">
                                    <div className="mb-6">
                                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                                            {property.title}
                                        </h1>
                                        
                                        <div className="flex flex-wrap items-center gap-6 text-gray-600">
                                            <span className="flex items-center gap-2 text-lg">
                                                <LucideMapPin size={20} className="text-orange-500" />
                                                <span className="font-medium">{property.municipality.name}</span>
                                            </span>
                                            <span className="flex items-center gap-2 text-lg">
                                                <LucideEye size={20} className="text-orange-500" />
                                                <span className="font-medium">{viewCount || 0} {t('views')}</span>
                                            </span>
                                            <span className="flex items-center gap-2 text-lg">
                                                <LucideCalendar size={20} className="text-orange-500" />
                                                <span className="font-medium">{new Date(property.created_at).toLocaleDateString()}</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Property Features Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                        {propertyFeatures.map((feature, index) => (
                                            <div key={index} className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${feature.color} text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 group`}>
                                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
                                                <div className="relative z-10">
                                                    <div className="mb-3 opacity-90">{feature.icon}</div>
                                                    <div className="text-3xl font-bold mb-1">{feature.value}</div>
                                                    <div className="text-sm opacity-90">{feature.label}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Description Preview */}
                                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 mb-8">
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">{t('description')}</h3>
                                        <p className="text-gray-700 leading-relaxed line-clamp-3">
                                            {property.description}
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <button
                                            onClick={handleShowNumber}
                                            disabled={loading}
                                            className="px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-50"
                                        >
                                            {loading ? (
                                                <>
                                                    <LucideLoader size={22} className="animate-spin" />
                                                    {t('loading')}
                                                </>
                                            ) : (
                                                <>
                                                    <LucidePhone size={22} />
                                                    {showNumber ? property.user.phone : t('show_number')}
                                                </>
                                            )}
                                        </button>
                                        
                                        <a
                                            href={`https://wa.me/${property.user.phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                                `Bonjour, je suis intéressé par votre propriété "${property.title}" publiée sur AgencyDRC.`,
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3"
                                        >
                                            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 258">
                                                <path fill="currentColor" d="M5.463 127.456c-.006 21.677 5.658 42.843 16.428 61.499L4.433 252.697l65.232-17.104a123 123 0 0 0 58.8 14.97h.054c67.815 0 123.018-55.183 123.047-123.01c.013-32.867-12.775-63.773-36.009-87.025c-23.23-23.25-54.125-36.061-87.043-36.076c-67.823 0-123.022 55.18-123.05 123.004" />
                                            </svg>
                                            {t('whatsapp')}
                                        </a>
                                        
                                        <button className="px-6 py-4 bg-white border-2 border-orange-500 text-orange-600 font-bold rounded-2xl hover:bg-orange-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3">
                                            <LucideCalendar size={22} />
                                            {t('schedule_visit')}
                                        </button>
                                    </div>
                                </div>

                                {/* Price & Agent Info */}
                                <div className="lg:col-span-1">
                                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white shadow-2xl">
                                        <div className="text-center mb-8">
                                            <div className="text-4xl lg:text-5xl font-bold mb-2">
                                                {new Intl.NumberFormat('en-US', {
                                                    style: 'currency',
                                                    currency: 'USD',
                                                    maximumFractionDigits: 0,
                                                }).format(property.price)}
                                            </div>
                                            {property.sale_type === 'rent' && (
                                                <div className="text-gray-300 text-lg">/{t('month')}</div>
                                            )}
                                            {property.price_per_sqft && (
                                                <div className="text-gray-400 text-sm mt-2">
                                                    {new Intl.NumberFormat('en-US', {
                                                        style: 'currency',
                                                        currency: 'USD',
                                                        maximumFractionDigits: 0,
                                                    }).format(property.price_per_sqft)}/m²
                                                </div>
                                            )}
                                        </div>

                                        <div className="border-t border-gray-700 pt-6">
                                            <h4 className="text-lg font-bold mb-4">{t('contact_agent')}</h4>
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                                    {property.user.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-lg">{property.user.name}</div>
                                                    <div className="text-gray-400 text-sm">{t('real_estate_agent')}</div>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <LucideStar
                                                                key={i}
                                                                size={14}
                                                                className={i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    if (!user) return;
                                                    post(route('contact.owner'), {
                                                        preserveScroll: true,
                                                        onSuccess: () => reset(),
                                                    });
                                                }}
                                                className="space-y-4"
                                            >
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-500"
                                                    placeholder={t('your_name')}
                                                    value={user?.name || ''}
                                                    readOnly
                                                />
                                                <input
                                                    type="email"
                                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-500"
                                                    placeholder={t('your_email')}
                                                    value={user?.email || ''}
                                                    readOnly
                                                />
                                                <input
                                                    type="tel"
                                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-500"
                                                    placeholder={t('your_phone')}
                                                    value={data.phone}
                                                    onChange={(e) => setData('phone', e.target.value)}
                                                />
                                                <textarea
                                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-white placeholder-gray-500"
                                                    rows={3}
                                                    placeholder={t('your_message')}
                                                    value={data.message}
                                                    onChange={(e) => setData('message', e.target.value)}
                                                />
                                                <button
                                                    type="submit"
                                                    className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                                                    disabled={processing || !user}
                                                >
                                                    {processing ? t('sending') : t('send_message')}
                                                </button>
                                                {!user && (
                                                    <div className="p-3 bg-orange-900/30 border border-orange-700 rounded-xl">
                                                        <p className="text-sm text-orange-300">
                                                            {t('please_login_to_contact')}
                                                        </p>
                                                    </div>
                                                )}
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Detailed Information Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Tabs Navigation */}
                            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                                <div className="flex flex-wrap gap-1 p-2 bg-gray-50">
                                    {[
                                        { id: 'overview', label: t('overview') },
                                        { id: 'description', label: t('description') },
                                        { id: 'features', label: t('features') },
                                        { id: 'location', label: t('location') },
                                        { id: 'gallery', label: t('gallery') },
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-all duration-300 ${
                                                activeTab === tab.id
                                                    ? 'bg-white text-orange-600 shadow-lg'
                                                    : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="p-8">
                                    {/* Overview Tab */}
                                    {activeTab === 'overview' && (
                                        <div className="space-y-8">
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('property_details')}</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {[
                                                        { icon: <LucideHome size={20} />, label: t('type'), value: property.type },
                                                        { icon: <LucideCalendar size={20} />, label: t('listed_on'), value: new Date(property.created_at).toLocaleDateString() },
                                                        { icon: <LucideRuler size={20} />, label: t('total_area'), value: `${property.surface} m²` },
                                                        { icon: <LucideBuilding size={20} />, label: t('floor'), value: property.floor || 'N/A' },
                                                        { icon: <LucideClock size={20} />, label: t('property_age'), value: property.property_age || 'N/A' },
                                                        { icon: <LucideUsers size={20} />, label: t('capacity'), value: property.capacity || 'N/A' },
                                                    ].map((item, index) => (
                                                        <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl hover:shadow-md transition-all duration-300">
                                                            <div className="p-3 bg-white rounded-xl text-orange-600 shadow-sm">
                                                                {item.icon}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm text-gray-600">{item.label}</div>
                                                                <div className="font-bold text-gray-900">{item.value}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('rooms_details')}</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {[
                                                        { icon: <LucideBed size={20} />, label: t('bedrooms'), value: property.bedrooms },
                                                        { icon: <LucideBath size={20} />, label: t('bathrooms'), value: property.bathrooms },
                                                        { icon: <LucideChefHat size={20} />, label: t('kitchens'), value: property.kitchens },
                                                        { icon: <LucideHome size={20} />, label: t('total_rooms'), value: property.rooms },
                                                    ].map((item, index) => (
                                                        <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl hover:shadow-md transition-all duration-300">
                                                            <div className="p-3 bg-white rounded-xl text-blue-600 shadow-sm">
                                                                {item.icon}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm text-gray-600">{item.label}</div>
                                                                <div className="font-bold text-gray-900">{item.value}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Description Tab */}
                                    {activeTab === 'description' && (
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('full_description')}</h3>
                                            <div className="prose prose-lg max-w-none">
                                                <p className="text-gray-700 leading-relaxed text-lg">{property.description}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Features Tab */}
                                    {activeTab === 'features' && (
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('features_amenities')}</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {property.amenities
                                                    .slice(0, showMoreFeatures ? property.amenities.length : 12)
                                                    .map((amenity: any, index: number) => (
                                                        <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl hover:shadow-md transition-all duration-300 group">
                                                            <div className="p-3 bg-white rounded-xl text-green-600 shadow-sm group-hover:scale-110 transition-transform">
                                                                {getAmenityIcon(amenity.name)}
                                                            </div>
                                                            <span className="font-medium text-gray-900">{t(amenity.name)}</span>
                                                        </div>
                                                    ))}
                                            </div>
                                            {property.amenities.length > 12 && (
                                                <button
                                                    onClick={() => setShowMoreFeatures(!showMoreFeatures)}
                                                    className="mt-6 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                                                >
                                                    {showMoreFeatures ? t('show_less') : `${t('show_all')} (${property.amenities.length})`}
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {/* Location Tab */}
                                    {activeTab === 'location' && (
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('location')}</h3>
                                            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl h-96 flex items-center justify-center">
                                                <p className="text-gray-500">{t('map_loading')}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Gallery Tab */}
                                    {activeTab === 'gallery' && (
                                        <div>
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-2xl font-bold text-gray-900">{t('photo_gallery')}</h3>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setGalleryView('grid')}
                                                        className={`p-2 rounded-lg transition-all duration-300 ${
                                                            galleryView === 'grid' 
                                                                ? 'bg-orange-100 text-orange-600' 
                                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                        title="Vue grille"
                                                    >
                                                        <LucideGrid3x3 size={20} />
                                                    </button>
                                                    <button
                                                        onClick={() => setGalleryView('carousel')}
                                                        className={`p-2 rounded-lg transition-all duration-300 ${
                                                            galleryView === 'carousel' 
                                                                ? 'bg-orange-100 text-orange-600' 
                                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                        title="Vue carrousel"
                                                    >
                                                        <LucideList size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            {galleryView === 'grid' ? (
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                    {property.images.map((img, index) => (
                                                        <div
                                                            key={index}
                                                            className="relative overflow-hidden rounded-2xl group cursor-pointer"
                                                            onClick={() => openModal(index)}
                                                        >
                                                            <img
                                                                src={`/storage/${img.url}`}
                                                                alt={`${property.title} ${index + 1}`}
                                                                className="w-full h-48 object-cover transition-all duration-500 group-hover:scale-110"
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
                                                                <LucideMaximize2 size={24} className="text-white" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    <div className="relative h-96 overflow-hidden rounded-2xl bg-gray-100">
                                                        <img
                                                            src={`/storage/${property.images[activeImageIndex]?.url}`}
                                                            alt={`${property.title} ${activeImageIndex + 1}`}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>
                                                    <div className="flex justify-between items-center mt-4">
                                                        <button
                                                            onClick={() => setActiveImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)}
                                                            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                                                        >
                                                            <LucideChevronLeft size={24} />
                                                        </button>
                                                        <div className="flex gap-2">
                                                            {property.images.map((_, index) => (
                                                                <button
                                                                    key={index}
                                                                    onClick={() => setActiveImageIndex(index)}
                                                                    className={`w-2 h-2 rounded-full transition-colors ${
                                                                        index === activeImageIndex ? 'bg-orange-500' : 'bg-gray-300'
                                                                    }`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <button
                                                            onClick={() => setActiveImageIndex((prev) => (prev + 1) % property.images.length)}
                                                            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                                                        >
                                                            <LucideChevronRight size={24} />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">
                            {/* Similar Properties */}
                            <div className="bg-white rounded-3xl shadow-xl p-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('similar_properties')}</h3>
                                <div className="space-y-4">
                                    {arroundProperties.slice(0, 3).map((p: any) => (
                                        <Link
                                            key={p.id}
                                            href={route('property.show', p.id)}
                                            className="block group"
                                        >
                                            <div className="flex gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
                                                <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={`/storage/${p.images[0]?.url}`}
                                                        alt={p.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-1">
                                                        {p.title.length > 25 ? p.title.substring(0, 25) + '...' : p.title}
                                                    </h4>
                                                    <p className="text-orange-600 font-bold text-lg mb-1">
                                                        {new Intl.NumberFormat('en-US', {
                                                            style: 'currency',
                                                            currency: 'USD',
                                                            maximumFractionDigits: 0,
                                                        }).format(p.price)}
                                                        {p.sale_type === 'rent' ? '/mo' : ''}
                                                    </p>
                                                    <p className="text-sm text-gray-600 flex items-center gap-1">
                                                        <LucideMapPin size={14} />
                                                        {p.municipality?.name}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Full Screen Image Modal with Advanced Features */}
            {isModalOpen && (
                <div 
                    ref={modalRef}
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Top Controls */}
                    <div className="absolute top-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-b from-black/70 to-transparent z-10">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 md:gap-4">
                                <button
                                    onClick={closeModal}
                                    className="p-2 md:p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                                >
                                    <LucideX size={20} className="md:w-7 md:h-7" />
                                </button>
                                <div className="bg-black/60 backdrop-blur-md px-3 py-1 md:px-4 md:py-2 rounded-full">
                                    <span className="text-white text-xs md:text-sm font-medium">
                                        {currentIndex + 1} / {property.images.length}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-1 md:gap-3">
                                <button
                                    onClick={handleZoomOut}
                                    className="p-2 md:p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                                    title="Zoom out"
                                >
                                    <LucideZoomOut size={16} className="md:w-6 md:h-6" />
                                </button>
                                <div className="bg-black/60 backdrop-blur-md px-2 py-1 md:px-3 md:py-1 rounded-full">
                                    <span className="text-white text-xs md:text-sm font-medium">
                                        {Math.round(zoomLevel * 100)}%
                                    </span>
                                </div>
                                <button
                                    onClick={handleZoomIn}
                                    className="p-2 md:p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                                    title="Zoom in"
                                >
                                    <LucideZoomIn size={16} className="md:w-6 md:h-6" />
                                </button>
                                <button
                                    onClick={handleRotate}
                                    className="p-2 md:p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                                    title="Rotate"
                                >
                                    <LucideRotateCw size={16} className="md:w-6 md:h-6" />
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="p-2 md:p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                                    title="Reset"
                                >
                                    <LucideMaximize2 size={16} className="md:w-6 md:h-6" />
                                </button>
                                <button
                                    onClick={handleDownload}
                                    className="p-2 md:p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                                    title="Download"
                                >
                                    <LucideDownload size={16} className="md:w-6 md:h-6" />
                                </button>
                                <button
                                    onClick={() => setAutoPlay(!autoPlay)}
                                    className="p-2 md:p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                                    title={autoPlay ? "Pause" : "Play"}
                                >
                                    {autoPlay ? <LucidePause size={16} className="md:w-6 md:h-6" /> : <LucidePlay size={16} className="md:w-6 md:h-6" />}
                                </button>
                                <button
                                    onClick={() => setShowThumbnails(!showThumbnails)}
                                    className="p-2 md:p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                                    title="Toggle thumbnails"
                                >
                                    <LucideGrid3x3 size={16} className="md:w-6 md:h-6" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Image Container */}
                    <div className="relative flex items-center justify-center w-full h-full">
                        <img
                            ref={imageRef}
                            src={`/storage/${property.images[currentIndex]?.url}`}
                            alt={`${property.title} ${currentIndex + 1}`}
                            className="max-w-full max-h-full object-contain rounded-lg transition-transform duration-300 select-none"
                            style={{
                                transform: `scale(${zoomLevel}) rotate(${rotation}deg) translate(${dragOffset.x}px, ${dragOffset.y}px)`,
                                cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
                                maxWidth: isMobile ? '100%' : '90vw',
                                maxHeight: isMobile ? '70vh' : '80vh'
                            }}
                            draggable={false}
                        />
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevImage}
                        className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 p-2 md:p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                    >
                        <LucideChevronLeft size={20} className="md:w-8 md:h-8" />
                    </button>
                    <button
                        onClick={nextImage}
                        className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 p-2 md:p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                    >
                        <LucideChevronRight size={20} className="md:w-8 md:h-8" />
                    </button>

                    {/* Bottom Thumbnails */}
                    {showThumbnails && (
                        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/70 to-transparent z-10">
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {property.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setCurrentIndex(index);
                                            setZoomLevel(1);
                                            setRotation(0);
                                            setDragOffset({ x: 0, y: 0 });
                                        }}
                                        className={`flex-shrink-0 w-12 h-12 md:w-20 md:h-20 rounded-lg overflow-hidden transition-all duration-300 ${
                                            index === currentIndex 
                                                ? 'ring-2 ring-white scale-110' 
                                                : 'opacity-70 hover:opacity-100'
                                        }`}
                                    >
                                        <img
                                            src={`/storage/${img.url}`}
                                            alt={`${property.title} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Keyboard Shortcuts Help - Hidden on mobile */}
                    {!isMobile && (
                        <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg text-white text-xs">
                            <p className="font-semibold mb-1">{t('keyboard_shortcuts')}</p>
                            <p>← → : {t('navigate')}</p>
                            <p>+ - : {t('zoom')}</p>
                            <p>R : {t('rotate')}</p>
                            <p>Space : {t('play_pause')}</p>
                            <p>ESC : {t('close')}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Share Modal */}
            {shareModal && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900">{t('share_property')}</h3>
                            <button
                                onClick={() => setShareModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                <LucideX size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6">
                            {[
                                { platform: 'facebook', label: 'Facebook', color: 'bg-blue-600 hover:bg-blue-700' },
                                { platform: 'twitter', label: 'Twitter', color: 'bg-sky-500 hover:bg-sky-600' },
                                { platform: 'linkedin', label: 'LinkedIn', color: 'bg-blue-700 hover:bg-blue-800' },
                                { platform: 'whatsapp', label: 'WhatsApp', color: 'bg-green-500 hover:bg-green-600' },
                            ].map((social) => (
                                <button
                                    key={social.platform}
                                    onClick={() => handleShare(social.platform)}
                                    className={`p-3 md:p-4 ${social.color} text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 text-sm md:text-base`}
                                >
                                    {social.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-2 md:gap-3">
                            <input
                                type="text"
                                value={window.location.href}
                                readOnly
                                className="flex-1 px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-xl bg-gray-50 font-medium text-sm"
                            />
                            <button
                                onClick={() => handleCopyToClipboard(window.location.href)}
                                className="px-4 py-2 md:px-6 md:py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-300 font-semibold flex items-center gap-2 text-sm md:text-base"
                            >
                                {copiedToClipboard ? <LucideCheck size={16} /> : <LucideCopy size={16} />}
                                {copiedToClipboard ? t('copied') : t('copy')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </App>
    );
}