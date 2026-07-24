import App from '@/components/layouts/Home/App';
import PropertyGalleryDialog from '@/components/properties/PropertyGalleryDialog';
import Breadcumb from '@/components/ui/Breadcumb';
import ErrorText from '@/components/ui/ErrorText';
import { useAd } from '@/hooks/useAd';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    LucideArmchair,
    LucideAward,
    LucideBaby,
    LucideBath,
    LucideBed,
    LucideBook,
    LucideBriefcase,
    LucideBuilding,
    LucideCalendar,
    LucideCamera,
    LucideCheck,
    LucideChefHat,
    LucideChevronLeft,
    LucideChevronRight,
    LucideClock,
    LucideCoffee,
    LucideCopy,
    LucideDog,
    LucideDroplets,
    LucideEye,
    LucideFlame,
    LucideGamepad2,
    LucideGrid3x3,
    LucideDumbbell as LucideGym,
    LucideHeart,
    LucideHome,
    LucideList,
    LucideLoader,
    LucideLock,
    LucideMapPin,
    LucideMaximize2,
    LucideMusic,
    LucideNavigation,
    LucideParkingCircle,
    LucidePhone,
    LucidePlane,
    LucideRuler,
    LucideSchool,
    LucideShare2,
    LucideShield,
    LucideSnowflake,
    LucideStar,
    LucideSun,
    LucideTrain,
    LucideTrees,
    LucideTv,
    LucideUsers,
    LucideUtensils,
    LucideWifi,
    LucideWine,
    LucideX,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

type PropertyImage = { id?: number | string; url: string };
type Amenity = { name: string };
type Municipality = { name?: string };
type PropertyOwner = { name?: string; phone?: string };

interface PropertyRecord {
    id: number;
    slug: string;
    title: string;
    description?: string;
    price: number;
    price_per_sqft?: number;
    type?: string;
    sale_type?: string;
    surface?: number;
    bedrooms?: number;
    bathrooms?: number;
    rooms?: number;
    kitchens?: number;
    capacity?: number;
    floor?: number;
    property_age?: number;
    featured?: boolean;
    created_at: string;
    images: PropertyImage[];
    amenities: Amenity[];
    municipality?: Municipality;
    user: PropertyOwner;
}

interface NearbyProperty {
    id: number;
    slug: string;
    title: string;
    price: number;
    sale_type?: string;
    images: PropertyImage[];
    municipality?: Municipality;
}

export default function PropertyDetails({
    property: initialProperty,
    arroundProperties,
    viewCount,
}: {
    property: PropertyRecord | null;
    arroundProperties: NearbyProperty[];
    viewCount: number;
}) {
    // Extract ID from URL (last segment) or use prop ID if available
    const pageProps = usePage().props as { id?: number | string };
    const propId = pageProps.id || window.location.pathname.split('/').pop();

    const { ad: fetchedProperty, loading: adLoading } = useAd(propId);

    // Use fetched property if available, otherwise fallback to initial prop
    const property = fetchedProperty || initialProperty;

    // Loading state for initial fetch
    if (adLoading && !property) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center">
                    <LucideLoader
                        size={40}
                        className="mb-4 animate-spin text-orange-500"
                    />
                    <p className="text-gray-500">Loading property details...</p>
                </div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <p className="text-gray-500">Property not found.</p>
            </div>
        );
    }

    return (
        <PropertyDetailsContent
            property={property}
            arroundProperties={arroundProperties}
            viewCount={viewCount}
        />
    );
}

function PropertyDetailsContent({
    property,
    arroundProperties,
    viewCount,
}: {
    property: PropertyRecord;
    arroundProperties: NearbyProperty[];
    viewCount: number;
}) {
    const [showNumber, setShowNumber] = useState(false);
    // ... rest of state
    const [loading, setLoading] = useState(false);
    const [showMoreFeatures, setShowMoreFeatures] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('overview');
    const [isFavorite, setIsFavorite] = useState(false);
    const [copiedToClipboard, setCopiedToClipboard] = useState(false);
    const [shareModal, setShareModal] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [galleryView, setGalleryView] = useState('grid');
    const [zoomLevel, setZoomLevel] = useState(1);
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
    const previousFocusRef = useRef<HTMLElement | null>(null);
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
        return (
            amenityIcons[key as keyof typeof amenityIcons] ||
            amenityIcons.default
        );
    }

    const propertyFeatures = [
        {
            icon: <LucideBed className="h-5 w-5" />,
            label: t('bedrooms'),
            value: property.bedrooms,
        },
        {
            icon: <LucideBath className="h-5 w-5" />,
            label: t('bathrooms'),
            value: property.bathrooms,
        },
        {
            icon: <LucideRuler className="h-5 w-5" />,
            label: t('surface'),
            value: `${property.surface} m²`,
        },
        {
            icon: <LucideHome className="h-5 w-5" />,
            label: t('rooms'),
            value: property.rooms,
        },
    ];

    const openModal = (index: number) => {
        previousFocusRef.current = document.activeElement as HTMLElement;
        setCurrentIndex(index);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
        setZoomLevel(1);
        setRotation(0);
        setDragOffset({ x: 0, y: 0 });
    };

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        document.body.style.overflow = 'unset';
        setZoomLevel(1);
        setRotation(0);
        setDragOffset({ x: 0, y: 0 });
        requestAnimationFrame(() => previousFocusRef.current?.focus());
    }, []);

    useEffect(() => {
        if (!isModalOpen || !modalRef.current) return;

        const dialog = modalRef.current;
        const selector =
            'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])';
        const focusable = dialog.querySelectorAll<HTMLElement>(selector);
        focusable[0]?.focus();

        const trapFocus = (event: KeyboardEvent) => {
            if (event.key !== 'Tab' || focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        dialog.addEventListener('keydown', trapFocus);
        return () => dialog.removeEventListener('keydown', trapFocus);
    }, [isModalOpen]);

    const imageCount = property.images.length;

    const nextImage = useCallback(() => {
        if (!imageCount) return;
        setCurrentIndex((prev) => (prev + 1) % imageCount);
        setZoomLevel(1);
        setRotation(0);
        setDragOffset({ x: 0, y: 0 });
    }, [imageCount]);

    const prevImage = useCallback(() => {
        if (!imageCount) return;
        setCurrentIndex((prev) => (prev - 1 + imageCount) % imageCount);
        setZoomLevel(1);
        setRotation(0);
        setDragOffset({ x: 0, y: 0 });
    }, [imageCount]);

    const handleZoomIn = useCallback(() => {
        const maxZoom = isMobile ? 2 : 3;
        setZoomLevel((prev) => Math.min(prev + 0.25, maxZoom));
    }, [isMobile]);

    const handleZoomOut = useCallback(() => {
        setZoomLevel((prev) => Math.max(prev - 0.25, 1));
    }, []);

    const handleRotate = useCallback(() => {
        setRotation((prev) => (prev + 90) % 360);
    }, []);

    const handleReset = () => {
        setZoomLevel(1);
        setRotation(0);
        setDragOffset({ x: 0, y: 0 });
    };

    const handleDownload = () => {
        if (!property?.images?.[currentIndex]?.url) return;
        const link = document.createElement('a');
        link.href = `/storage/${property.images[currentIndex].url}`;
        link.download = `${property.title || 'property'}_${currentIndex + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Mouse handlers for desktop
    const handleMouseDown = (e: React.MouseEvent) => {
        if (zoomLevel > 1 && !isMobile) {
            e.preventDefault();
            setIsDragging(true);
            setDragStart({
                x: e.clientX - dragOffset.x,
                y: e.clientY - dragOffset.y,
            });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && zoomLevel > 1 && !isMobile) {
            e.preventDefault();
            setDragOffset({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
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
                y: touch.clientY - touchStart.y,
            });
        }
    };

    const handleTouchEnd = () => {
        if (isMobile) {
            setIsDragging(false);
        }
    };

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
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
                    setAutoPlay((prev) => !prev);
                    break;
            }
        },
        [
            closeModal,
            handleRotate,
            handleZoomIn,
            handleZoomOut,
            isModalOpen,
            nextImage,
            prevImage,
        ],
    );

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
            window.open(
                shareUrls[platform as keyof typeof shareUrls],
                '_blank',
                'width=600,height=400',
            );
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
            } | null;
        };
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
        router.post(
            route('dashboard.properties.favorite', id),
            {},
            { preserveScroll: true },
        );
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
    }, [closeModal, shareModal, isModalOpen]);

    return (
        <App>
            <Head title={`${property.title}`} />
            <Breadcumb title={property.title} homeLink={route('home')} />

            {/* Hero Section Premium */}
            <section className="relative bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="container mx-auto px-4 py-8">
                    <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
                        {/* Image Gallery Premium */}
                        <div className="relative">
                            <div className="grid grid-cols-1 gap-2 lg:grid-cols-4">
                                <div className="lg:col-span-3">
                                    <div className="group relative h-[500px] overflow-hidden lg:h-[700px]">
                                        <img
                                            src={
                                                property.images?.[0]?.url
                                                    ? `/storage/${property.images[0].url}`
                                                    : '/assets/images/placeholder.jpg'
                                            }
                                            alt={property.title}
                                            className="h-full w-full object-cover transition-all duration-1000 group-hover:scale-105"
                                            onLoad={() => setImageLoaded(true)}
                                        />

                                        {/* Loading Overlay */}
                                        {!imageLoaded && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                                <div className="flex flex-col items-center">
                                                    <LucideLoader
                                                        size={40}
                                                        className="mb-4 animate-spin text-orange-500"
                                                    />
                                                    <p className="text-gray-500">
                                                        {t('loading_image')}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100"></div>

                                        {/* Action Buttons */}
                                        <div className="absolute top-6 right-6 flex flex-col gap-3">
                                            <button
                                                onClick={() =>
                                                    toggleFavorite(property.id)
                                                }
                                                className="group rounded-2xl bg-white/95 p-3 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:shadow-2xl"
                                                title={
                                                    isFavorite
                                                        ? 'Retirer des favoris'
                                                        : 'Ajouter aux favoris'
                                                }
                                            >
                                                <LucideHeart
                                                    size={22}
                                                    className={`transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700 group-hover:text-red-500'}`}
                                                />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setShareModal(true)
                                                }
                                                className="group rounded-2xl bg-white/95 p-3 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:shadow-2xl"
                                                title="Partager"
                                            >
                                                <LucideShare2
                                                    size={22}
                                                    className="text-gray-700 transition-colors group-hover:text-blue-500"
                                                />
                                            </button>
                                            <button
                                                onClick={() => openModal(0)}
                                                className="group rounded-2xl bg-white/95 p-3 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:shadow-2xl"
                                                title="Voir en plein écran"
                                            >
                                                <LucideMaximize2
                                                    size={22}
                                                    className="text-gray-700 transition-colors group-hover:text-purple-500"
                                                />
                                            </button>
                                        </div>

                                        {/* Status Badge */}
                                        <div className="absolute top-6 left-6 flex gap-2">
                                            <span
                                                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold text-white shadow-xl ${
                                                    property.sale_type ===
                                                    'rent'
                                                        ? 'bg-[#292625]'
                                                        : 'bg-[#413D3C]'
                                                }`}
                                            >
                                                {property.sale_type === 'rent'
                                                    ? t('for_rent')
                                                    : t('for_sale')}
                                            </span>
                                            {property.featured && (
                                                <span className="inline-flex items-center gap-2 rounded-lg bg-[#CF8E19] px-4 py-2 text-xs font-bold text-[#292625] shadow-xl">
                                                    <LucideAward size={16} />
                                                    {t('featured')}
                                                </span>
                                            )}
                                        </div>

                                        {/* Image Counter */}
                                        <div className="absolute bottom-6 left-6 rounded-full bg-black/60 px-4 py-2 backdrop-blur-md">
                                            <span className="flex items-center gap-2 text-sm font-medium text-white">
                                                <LucideCamera size={18} />
                                                {currentIndex + 1} /{' '}
                                                {property.images?.length || 0}{' '}
                                                {t('photos')}
                                            </span>
                                        </div>

                                        {/* Navigation Arrows */}
                                        <button
                                            onClick={prevImage}
                                            className="absolute top-1/2 left-6 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100 hover:scale-110 hover:bg-white/30"
                                        >
                                            <LucideChevronLeft size={28} />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute top-1/2 right-6 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100 hover:scale-110 hover:bg-white/30"
                                        >
                                            <LucideChevronRight size={28} />
                                        </button>

                                        {/* Gallery View Toggle */}
                                        <div className="absolute right-6 bottom-6 flex gap-2">
                                            <button
                                                onClick={() =>
                                                    setGalleryView('grid')
                                                }
                                                className={`rounded-lg p-2 transition-all duration-300 ${
                                                    galleryView === 'grid'
                                                        ? 'bg-white/90 text-gray-900'
                                                        : 'bg-white/50 text-white hover:bg-white/70'
                                                }`}
                                                title="Vue grille"
                                            >
                                                <LucideGrid3x3 size={20} />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setGalleryView('carousel')
                                                }
                                                className={`rounded-lg p-2 transition-all duration-300 ${
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
                                <div className="hidden lg:col-span-1 lg:block">
                                    <div className="grid h-full grid-rows-4 gap-2">
                                        {property.images
                                            .slice(1, 5)
                                            .map((img, index) => (
                                                <div
                                                    key={index}
                                                    className="group relative cursor-pointer overflow-hidden rounded-xl"
                                                    onClick={() =>
                                                        openModal(index + 1)
                                                    }
                                                >
                                                    <img
                                                        src={`/storage/${img.url}`}
                                                        alt={`${property.title} ${index + 2}`}
                                                        className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-all duration-300 group-hover:opacity-100">
                                                        <LucideMaximize2
                                                            size={28}
                                                            className="text-white"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Property Information */}
                        <div className="p-8 lg:p-12">
                            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                                <div className="lg:col-span-2">
                                    <div className="mb-6">
                                        <h1 className="mb-4 text-4xl leading-tight font-bold text-gray-900 lg:text-5xl">
                                            {property.title}
                                        </h1>

                                        <div className="flex flex-wrap items-center gap-6 text-gray-600">
                                            <span className="flex items-center gap-2 text-sm font-medium">
                                                <LucideMapPin
                                                    size={18}
                                                    className="text-[#CF8E19]"
                                                />
                                                <span>
                                                    {property.municipality
                                                        ?.name ||
                                                        t('unknown_location')}
                                                </span>
                                            </span>
                                            <span className="flex items-center gap-2 text-sm font-medium">
                                                <LucideEye
                                                    size={18}
                                                    className="text-[#CF8E19]"
                                                />
                                                <span>
                                                    {viewCount || 0}{' '}
                                                    {t('views')}
                                                </span>
                                            </span>
                                            <span className="flex items-center gap-2 text-sm font-medium">
                                                <LucideCalendar
                                                    size={18}
                                                    className="text-[#CF8E19]"
                                                />
                                                <span>
                                                    {new Date(
                                                        property.created_at,
                                                    ).toLocaleDateString()}
                                                </span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Property Features Grid */}
                                    <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                                        {propertyFeatures.map(
                                            (feature, index) => (
                                                <div
                                                    key={index}
                                                    className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:border-[#C9A84C]/30 hover:shadow-md"
                                                >
                                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0d2340]/5 text-[#0d2340] transition-colors group-hover:bg-[#C9A84C] group-hover:text-white">
                                                        {feature.icon}
                                                    </div>
                                                    <div>
                                                        <div className="text-xl font-bold text-gray-900">
                                                            {feature.value}
                                                        </div>
                                                        <div className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                                                            {feature.label}
                                                        </div>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>

                                    {/* Description Preview */}
                                    <div className="mb-8 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 p-6">
                                        <h3 className="mb-3 text-xl font-bold text-gray-900">
                                            {t('description')}
                                        </h3>
                                        <p className="line-clamp-3 leading-relaxed text-gray-700">
                                            {property.description}
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                        <button
                                            onClick={handleShowNumber}
                                            disabled={loading}
                                            className="flex items-center justify-center gap-2 rounded-xl bg-[#413D3C] px-6 py-4 text-sm font-bold text-white transition-all duration-300 hover:bg-[#292625] disabled:opacity-50 dark:bg-[#CF8E19] dark:text-[#292625]"
                                        >
                                            {loading ? (
                                                <LucideLoader
                                                    size={18}
                                                    className="animate-spin"
                                                />
                                            ) : (
                                                <>
                                                    <LucidePhone size={18} />
                                                    {showNumber
                                                        ? property.user
                                                              ?.phone || 'N/A'
                                                        : t('show_number')}
                                                </>
                                            )}
                                        </button>

                                        <a
                                            href={`https://wa.me/${property.user.phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                                `Bonjour, je suis intéressé par votre propriété "${property.title}" publiée sur Agency.`,
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-4 text-sm font-bold text-white transition-all duration-300 hover:bg-green-700"
                                        >
                                            <LucidePhone size={18} />
                                            {t('whatsapp')}
                                        </a>

                                        <button className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#C9A84C] bg-white px-6 py-4 text-sm font-bold text-[#C9A84C] transition-all duration-300 hover:bg-[#C9A84C]/5">
                                            <LucideCalendar size={18} />
                                            {t('schedule_visit')}
                                        </button>
                                    </div>
                                </div>

                                {/* Price & Agent Info */}
                                <div className="h-max lg:sticky lg:top-32 lg:col-span-1">
                                    <div className="rounded-3xl border border-[#CF8E19]/20 bg-[#413D3C] p-8 text-white shadow-2xl dark:bg-[#292625]">
                                        <div className="mb-8 text-center">
                                            <div className="mb-2 text-4xl font-bold lg:text-5xl">
                                                {new Intl.NumberFormat(
                                                    'en-US',
                                                    {
                                                        style: 'currency',
                                                        currency: 'USD',
                                                        maximumFractionDigits: 0,
                                                    },
                                                ).format(property.price)}
                                            </div>
                                            {property.sale_type === 'rent' && (
                                                <div className="text-lg text-gray-300">
                                                    /{t('month')}
                                                </div>
                                            )}
                                            {property.price_per_sqft && (
                                                <div className="mt-2 text-sm text-gray-400">
                                                    {new Intl.NumberFormat(
                                                        'en-US',
                                                        {
                                                            style: 'currency',
                                                            currency: 'USD',
                                                            maximumFractionDigits: 0,
                                                        },
                                                    ).format(
                                                        property.price_per_sqft,
                                                    )}
                                                    /m²
                                                </div>
                                            )}
                                        </div>

                                        <div className="border-t border-gray-700 pt-6">
                                            <h4 className="mb-4 text-lg font-bold">
                                                {t('contact_agent')}
                                            </h4>
                                            <div className="mb-6 flex items-center gap-4">
                                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#CF8E19]/20 text-2xl font-bold text-[#CF8E19] shadow-lg">
                                                    {property.user.name
                                                        ?.charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-lg font-bold">
                                                        {property.user.name}
                                                    </div>
                                                    <div className="text-sm text-gray-400">
                                                        {t('real_estate_agent')}
                                                    </div>
                                                    <div className="mt-1 flex items-center gap-1">
                                                        {[...Array(5)].map(
                                                            (_, i) => (
                                                                <LucideStar
                                                                    key={i}
                                                                    size={14}
                                                                    className={
                                                                        i < 4
                                                                            ? 'fill-yellow-400 text-yellow-400'
                                                                            : 'text-gray-600'
                                                                    }
                                                                />
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    if (!user) return;
                                                    post(
                                                        route(
                                                            'contact.owner',
                                                            property.slug,
                                                        ),
                                                        {
                                                            preserveScroll: true,
                                                            onSuccess: () =>
                                                                reset(),
                                                            onError: () =>
                                                                requestAnimationFrame(
                                                                    () =>
                                                                        document
                                                                            .querySelector<HTMLElement>(
                                                                                '#owner-contact-form [aria-invalid="true"]',
                                                                            )
                                                                            ?.focus(),
                                                                ),
                                                        },
                                                    );
                                                }}
                                                id="owner-contact-form"
                                                className="space-y-4"
                                            >
                                                <label
                                                    htmlFor="owner-contact-name"
                                                    className="sr-only"
                                                >
                                                    {t('your_name')}
                                                </label>
                                                <input
                                                    id="owner-contact-name"
                                                    type="text"
                                                    autoComplete="name"
                                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-400 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] focus:outline-none"
                                                    placeholder={t('your_name')}
                                                    value={user?.name || ''}
                                                    readOnly
                                                />
                                                <label
                                                    htmlFor="owner-contact-email"
                                                    className="sr-only"
                                                >
                                                    {t('your_email')}
                                                </label>
                                                <input
                                                    id="owner-contact-email"
                                                    type="email"
                                                    autoComplete="email"
                                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-400 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] focus:outline-none"
                                                    placeholder={t(
                                                        'your_email',
                                                    )}
                                                    value={user?.email || ''}
                                                    readOnly
                                                />
                                                <label
                                                    htmlFor="owner-contact-phone"
                                                    className="sr-only"
                                                >
                                                    {t('your_phone')}
                                                </label>
                                                <input
                                                    id="owner-contact-phone"
                                                    type="tel"
                                                    autoComplete="tel"
                                                    aria-invalid={Boolean(
                                                        errors.phone,
                                                    )}
                                                    aria-describedby={
                                                        errors.phone
                                                            ? 'owner-contact-phone-error'
                                                            : undefined
                                                    }
                                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-400 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] focus:outline-none"
                                                    placeholder={t(
                                                        'your_phone',
                                                    )}
                                                    value={data.phone}
                                                    onChange={(e) =>
                                                        setData(
                                                            'phone',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <ErrorText
                                                    id="owner-contact-phone-error"
                                                    error={errors.phone}
                                                />
                                                <label
                                                    htmlFor="owner-contact-message"
                                                    className="sr-only"
                                                >
                                                    {t('your_message')}
                                                </label>
                                                <textarea
                                                    id="owner-contact-message"
                                                    required
                                                    minLength={10}
                                                    aria-invalid={Boolean(
                                                        errors.message,
                                                    )}
                                                    aria-describedby={
                                                        errors.message
                                                            ? 'owner-contact-message-error'
                                                            : undefined
                                                    }
                                                    className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-400 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] focus:outline-none"
                                                    rows={3}
                                                    placeholder={t(
                                                        'your_message',
                                                    )}
                                                    value={data.message}
                                                    onChange={(e) =>
                                                        setData(
                                                            'message',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <ErrorText
                                                    id="owner-contact-message-error"
                                                    error={errors.message}
                                                />
                                                <button
                                                    type="submit"
                                                    className="w-full rounded-xl bg-[#CF8E19] px-6 py-3 font-bold text-[#292625] transition-all duration-300 hover:bg-[#E0A43A] disabled:opacity-50"
                                                    disabled={
                                                        processing || !user
                                                    }
                                                    aria-busy={processing}
                                                >
                                                    {processing
                                                        ? t('sending')
                                                        : t('send_message')}
                                                </button>
                                                {!user && (
                                                    <div className="rounded-xl border border-orange-700 bg-orange-900/30 p-3">
                                                        <p className="text-sm text-orange-300">
                                                            {t(
                                                                'please_login_to_contact',
                                                            )}
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
            <section className="bg-white py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="space-y-8 lg:col-span-2">
                            {/* Tabs Navigation */}
                            <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
                                <div className="flex flex-wrap gap-1 bg-gray-50 p-2">
                                    {[
                                        {
                                            id: 'overview',
                                            label: t('overview'),
                                        },
                                        {
                                            id: 'description',
                                            label: t('description'),
                                        },
                                        {
                                            id: 'features',
                                            label: t('features'),
                                        },
                                        {
                                            id: 'location',
                                            label: t('location'),
                                        },
                                        { id: 'gallery', label: t('gallery') },
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex-1 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                                                activeTab === tab.id
                                                    ? 'bg-[#413D3C] text-white shadow-md dark:bg-[#CF8E19] dark:text-[#292625]'
                                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
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
                                                <h3 className="mb-6 text-2xl font-bold text-gray-900">
                                                    {t('property_details')}
                                                </h3>
                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                    {[
                                                        {
                                                            icon: (
                                                                <LucideHome
                                                                    size={20}
                                                                />
                                                            ),
                                                            label: t('type'),
                                                            value: property.type,
                                                        },
                                                        {
                                                            icon: (
                                                                <LucideCalendar
                                                                    size={20}
                                                                />
                                                            ),
                                                            label: t(
                                                                'listed_on',
                                                            ),
                                                            value: new Date(
                                                                property.created_at,
                                                            ).toLocaleDateString(),
                                                        },
                                                        {
                                                            icon: (
                                                                <LucideRuler
                                                                    size={20}
                                                                />
                                                            ),
                                                            label: t(
                                                                'total_area',
                                                            ),
                                                            value: `${property.surface} m²`,
                                                        },
                                                        {
                                                            icon: (
                                                                <LucideBuilding
                                                                    size={20}
                                                                />
                                                            ),
                                                            label: t('floor'),
                                                            value:
                                                                property.floor ||
                                                                'N/A',
                                                        },
                                                        {
                                                            icon: (
                                                                <LucideClock
                                                                    size={20}
                                                                />
                                                            ),
                                                            label: t(
                                                                'property_age',
                                                            ),
                                                            value:
                                                                property.property_age ||
                                                                'N/A',
                                                        },
                                                        {
                                                            icon: (
                                                                <LucideUsers
                                                                    size={20}
                                                                />
                                                            ),
                                                            label: t(
                                                                'capacity',
                                                            ),
                                                            value:
                                                                property.capacity ||
                                                                'N/A',
                                                        },
                                                    ].map((item, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center gap-4 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 p-4 transition-all duration-300 hover:shadow-md"
                                                        >
                                                            <div className="rounded-xl bg-[#C9A84C]/10 p-3 text-[#C9A84C]">
                                                                {item.icon}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm text-gray-600">
                                                                    {item.label}
                                                                </div>
                                                                <div className="font-bold text-gray-900">
                                                                    {item.value}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="mb-6 text-2xl font-bold text-gray-900">
                                                    {t('rooms_details')}
                                                </h3>
                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                    {[
                                                        {
                                                            icon: (
                                                                <LucideBed
                                                                    size={20}
                                                                />
                                                            ),
                                                            label: t(
                                                                'bedrooms',
                                                            ),
                                                            value: property.bedrooms,
                                                        },
                                                        {
                                                            icon: (
                                                                <LucideBath
                                                                    size={20}
                                                                />
                                                            ),
                                                            label: t(
                                                                'bathrooms',
                                                            ),
                                                            value: property.bathrooms,
                                                        },
                                                        {
                                                            icon: (
                                                                <LucideChefHat
                                                                    size={20}
                                                                />
                                                            ),
                                                            label: t(
                                                                'kitchens',
                                                            ),
                                                            value: property.kitchens,
                                                        },
                                                        {
                                                            icon: (
                                                                <LucideHome
                                                                    size={20}
                                                                />
                                                            ),
                                                            label: t(
                                                                'total_rooms',
                                                            ),
                                                            value: property.rooms,
                                                        },
                                                    ].map((item, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center gap-4 rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100 p-4 transition-all duration-300 hover:shadow-md"
                                                        >
                                                            <div className="rounded-xl bg-[#0d2340]/5 p-3 text-[#0d2340]">
                                                                {item.icon}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm text-gray-600">
                                                                    {item.label}
                                                                </div>
                                                                <div className="font-bold text-gray-900">
                                                                    {item.value}
                                                                </div>
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
                                            <h3 className="mb-6 text-2xl font-bold text-gray-900">
                                                {t('full_description')}
                                            </h3>
                                            <div className="prose prose-lg max-w-none">
                                                <p className="text-lg leading-relaxed text-gray-700">
                                                    {property.description}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Features Tab */}
                                    {activeTab === 'features' && (
                                        <div>
                                            <h3 className="mb-6 text-2xl font-bold text-gray-900">
                                                {t('features_amenities')}
                                            </h3>
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                {property.amenities
                                                    .slice(
                                                        0,
                                                        showMoreFeatures
                                                            ? property.amenities
                                                                  .length
                                                            : 12,
                                                    )
                                                    .map(
                                                        (
                                                            amenity: Amenity,
                                                            index: number,
                                                        ) => (
                                                            <div
                                                                key={index}
                                                                className="group flex items-center gap-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 p-4 transition-all duration-300 hover:shadow-md"
                                                            >
                                                                <div className="rounded-xl bg-white p-3 text-green-600 shadow-sm transition-transform group-hover:scale-110">
                                                                    {getAmenityIcon(
                                                                        amenity.name,
                                                                    )}
                                                                </div>
                                                                <span className="font-medium text-gray-900">
                                                                    {t(
                                                                        amenity.name,
                                                                    )}
                                                                </span>
                                                            </div>
                                                        ),
                                                    )}
                                            </div>
                                            {property.amenities.length > 12 && (
                                                <button
                                                    onClick={() =>
                                                        setShowMoreFeatures(
                                                            !showMoreFeatures,
                                                        )
                                                    }
                                                    className="mt-6 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:from-orange-600 hover:to-orange-700 hover:shadow-xl"
                                                >
                                                    {showMoreFeatures
                                                        ? t('show_less')
                                                        : `${t('show_all')} (${property.amenities.length})`}
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {/* Location Tab */}
                                    {activeTab === 'location' && (
                                        <div>
                                            <h3 className="mb-6 text-2xl font-bold text-gray-900">
                                                {t('location')}
                                            </h3>
                                            <div className="flex h-96 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                                                <p className="text-gray-500">
                                                    {t('map_loading')}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Gallery Tab */}
                                    {activeTab === 'gallery' && (
                                        <div>
                                            <div className="mb-6 flex items-center justify-between">
                                                <h3 className="text-2xl font-bold text-gray-900">
                                                    {t('photo_gallery')}
                                                </h3>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() =>
                                                            setGalleryView(
                                                                'grid',
                                                            )
                                                        }
                                                        className={`rounded-lg p-2 transition-all duration-300 ${
                                                            galleryView ===
                                                            'grid'
                                                                ? 'bg-orange-100 text-orange-600'
                                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                        title="Vue grille"
                                                    >
                                                        <LucideGrid3x3
                                                            size={20}
                                                        />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            setGalleryView(
                                                                'carousel',
                                                            )
                                                        }
                                                        className={`rounded-lg p-2 transition-all duration-300 ${
                                                            galleryView ===
                                                            'carousel'
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
                                                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                                    {property.images.map(
                                                        (img, index) => (
                                                            <div
                                                                key={index}
                                                                className="group relative cursor-pointer overflow-hidden rounded-2xl"
                                                                onClick={() =>
                                                                    openModal(
                                                                        index,
                                                                    )
                                                                }
                                                            >
                                                                <img
                                                                    src={`/storage/${img.url}`}
                                                                    alt={`${property.title} ${index + 1}`}
                                                                    className="h-48 w-full object-cover transition-all duration-500 group-hover:scale-110"
                                                                />
                                                                <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/60 to-transparent pb-4 opacity-0 transition-all duration-300 group-hover:opacity-100">
                                                                    <LucideMaximize2
                                                                        size={
                                                                            24
                                                                        }
                                                                        className="text-white"
                                                                    />
                                                                </div>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    <div className="relative h-96 overflow-hidden rounded-2xl bg-gray-100">
                                                        <img
                                                            src={`/storage/${property.images[activeImageIndex]?.url}`}
                                                            alt={`${property.title} ${activeImageIndex + 1}`}
                                                            className="h-full w-full object-contain"
                                                        />
                                                    </div>
                                                    <div className="mt-4 flex items-center justify-between">
                                                        <button
                                                            onClick={() =>
                                                                setActiveImageIndex(
                                                                    (prev) =>
                                                                        (prev -
                                                                            1 +
                                                                            property
                                                                                .images
                                                                                .length) %
                                                                        property
                                                                            .images
                                                                            .length,
                                                                )
                                                            }
                                                            className="rounded-full bg-gray-100 p-2 transition-colors hover:bg-gray-200"
                                                        >
                                                            <LucideChevronLeft
                                                                size={24}
                                                            />
                                                        </button>
                                                        <div className="flex gap-2">
                                                            {property.images.map(
                                                                (_, index) => (
                                                                    <button
                                                                        key={
                                                                            index
                                                                        }
                                                                        onClick={() =>
                                                                            setActiveImageIndex(
                                                                                index,
                                                                            )
                                                                        }
                                                                        className={`h-2 w-2 rounded-full transition-colors ${
                                                                            index ===
                                                                            activeImageIndex
                                                                                ? 'bg-orange-500'
                                                                                : 'bg-gray-300'
                                                                        }`}
                                                                    />
                                                                ),
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() =>
                                                                setActiveImageIndex(
                                                                    (prev) =>
                                                                        (prev +
                                                                            1) %
                                                                        property
                                                                            .images
                                                                            .length,
                                                                )
                                                            }
                                                            className="rounded-full bg-gray-100 p-2 transition-colors hover:bg-gray-200"
                                                        >
                                                            <LucideChevronRight
                                                                size={24}
                                                            />
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
                            <div className="rounded-3xl bg-white p-8 shadow-xl">
                                <h3 className="mb-6 text-2xl font-bold text-gray-900">
                                    {t('similar_properties')}
                                </h3>
                                <div className="space-y-4">
                                    {arroundProperties
                                        ?.slice(0, 3)
                                        .map((p: NearbyProperty) => (
                                            <Link
                                                key={p.id}
                                                href={route(
                                                    'property.show',
                                                    p.slug,
                                                )}
                                                className="group block"
                                            >
                                                <div className="flex gap-4 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 p-4 transition-all duration-300 group-hover:scale-[1.02] hover:shadow-lg">
                                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl">
                                                        <img
                                                            src={`/storage/${p.images[0]?.url}`}
                                                            alt={p.title}
                                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="mb-1 font-bold text-gray-900 transition-colors group-hover:text-orange-600">
                                                            {p.title.length > 25
                                                                ? p.title.substring(
                                                                      0,
                                                                      25,
                                                                  ) + '...'
                                                                : p.title}
                                                        </h4>
                                                        <p className="mb-1 text-lg font-bold text-orange-600">
                                                            {new Intl.NumberFormat(
                                                                'en-US',
                                                                {
                                                                    style: 'currency',
                                                                    currency:
                                                                        'USD',
                                                                    maximumFractionDigits: 0,
                                                                },
                                                            ).format(p.price)}
                                                            {p.sale_type ===
                                                            'rent'
                                                                ? '/mo'
                                                                : ''}
                                                        </p>
                                                        <p className="flex items-center gap-1 text-sm text-gray-600">
                                                            <LucideMapPin
                                                                size={14}
                                                            />
                                                            {
                                                                p.municipality
                                                                    ?.name
                                                            }
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

            {isModalOpen && (
                <PropertyGalleryDialog
                    property={property}
                    dialogRef={modalRef}
                    imageRef={imageRef}
                    currentIndex={currentIndex}
                    zoomLevel={zoomLevel}
                    rotation={rotation}
                    dragOffset={dragOffset}
                    isDragging={isDragging}
                    isMobile={isMobile}
                    autoPlay={autoPlay}
                    showThumbnails={showThumbnails}
                    setAutoPlay={setAutoPlay}
                    setShowThumbnails={setShowThumbnails}
                    setCurrentIndex={setCurrentIndex}
                    setZoomLevel={setZoomLevel}
                    setRotation={setRotation}
                    setDragOffset={setDragOffset}
                    closeModal={closeModal}
                    handleZoomOut={handleZoomOut}
                    handleZoomIn={handleZoomIn}
                    handleRotate={handleRotate}
                    handleReset={handleReset}
                    handleDownload={handleDownload}
                    prevImage={prevImage}
                    nextImage={nextImage}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                />
            )}
            {/* Share Modal */}
            {shareModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl md:p-8">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900 md:text-2xl">
                                {t('share_property')}
                            </h3>
                            <button
                                onClick={() => setShareModal(false)}
                                className="rounded-xl p-2 transition-colors hover:bg-gray-100"
                            >
                                <LucideX size={20} />
                            </button>
                        </div>

                        <div className="mb-6 grid grid-cols-2 gap-3 md:gap-4">
                            {[
                                {
                                    platform: 'facebook',
                                    label: 'Facebook',
                                    color: 'bg-blue-600 hover:bg-blue-700',
                                },
                                {
                                    platform: 'twitter',
                                    label: 'Twitter',
                                    color: 'bg-sky-500 hover:bg-sky-600',
                                },
                                {
                                    platform: 'linkedin',
                                    label: 'LinkedIn',
                                    color: 'bg-blue-700 hover:bg-blue-800',
                                },
                                {
                                    platform: 'whatsapp',
                                    label: 'WhatsApp',
                                    color: 'bg-green-500 hover:bg-green-600',
                                },
                            ].map((social) => (
                                <button
                                    key={social.platform}
                                    onClick={() => handleShare(social.platform)}
                                    className={`p-3 md:p-4 ${social.color} rounded-xl text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:text-base`}
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
                                className="flex-1 rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium md:px-4 md:py-3"
                            />
                            <button
                                onClick={() =>
                                    handleCopyToClipboard(window.location.href)
                                }
                                className="flex items-center gap-2 rounded-xl bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-300 hover:bg-gray-300 md:px-6 md:py-3 md:text-base"
                            >
                                {copiedToClipboard ? (
                                    <LucideCheck size={16} />
                                ) : (
                                    <LucideCopy size={16} />
                                )}
                                {copiedToClipboard ? t('copied') : t('copy')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </App>
    );
}
