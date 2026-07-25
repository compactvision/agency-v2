import App from '@/components/layouts/Home/App';
import PropertyGalleryDialog from '@/components/properties/PropertyGalleryDialog';
import Breadcumb from '@/components/ui/Breadcumb';
import ErrorText from '@/components/ui/ErrorText';
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
type PropertyOwner = { id?: number; name?: string; phone?: string };

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
    const property = initialProperty;

    if (!property) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#12100F]">
                <p className="text-gray-500 dark:text-gray-300">
                    Property not found.
                </p>
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
    const [visitModal, setVisitModal] = useState(false);
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
    const visitDialogRef = useRef<HTMLDivElement>(null);
    const visitTriggerRef = useRef<HTMLButtonElement>(null);
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
                id?: number;
                name?: string;
                email?: string;
                phone?: string;
            } | null;
        };
    }

    const user = (usePage().props as unknown as PageProps).auth.user;
    const isPropertyOwner = Boolean(user?.id) && user?.id === property.user?.id;

    const { data, setData, post, processing, errors, reset } = useForm({
        phone: user?.phone || '',
        message: '',
        property_id: property.id,
    });
    const {
        data: visitData,
        setData: setVisitData,
        post: submitVisit,
        processing: visitProcessing,
        errors: visitErrors,
        reset: resetVisit,
        setError: setVisitError,
        clearErrors: clearVisitErrors,
    } = useForm({
        phone: user?.phone || '',
        scheduled_at: '',
        message: '',
    });
    const minimumVisitDate = (() => {
        const date = new Date(Date.now() + 60 * 60 * 1000);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        return date.toISOString().slice(0, 16);
    })();

    useEffect(() => {
        window.scrollTo(0, 0);
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    useEffect(() => {
        if (!visitModal || !visitDialogRef.current) return;

        const dialog = visitDialogRef.current;
        const previousOverflow = document.body.style.overflow;
        const selector =
            'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
        const focusable = dialog.querySelectorAll<HTMLElement>(selector);
        document.body.style.overflow = 'hidden';
        dialog.querySelector<HTMLElement>('#visit-scheduled-at')?.focus();

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

        return () => {
            dialog.removeEventListener('keydown', trapFocus);
            document.body.style.overflow = previousOverflow;
            requestAnimationFrame(() => visitTriggerRef.current?.focus());
        };
    }, [visitModal]);

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
                if (visitModal) {
                    setVisitModal(false);
                }
                if (isModalOpen) {
                    closeModal();
                }
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [closeModal, shareModal, visitModal, isModalOpen]);

    return (
        <App>
            <Head title={`${property.title}`} />
            <Breadcumb title={property.title} homeLink={route('home')} />

            {/* Hero Section Premium */}
            <section className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#12100F] dark:to-[#191615]">
                <div className="container mx-auto px-0 py-0 sm:px-4 sm:py-8">
                    <div className="overflow-hidden bg-white shadow-xl ring-1 ring-black/5 sm:rounded-3xl sm:shadow-2xl dark:bg-[#211E1D] dark:ring-white/10">
                        {/* Image Gallery Premium */}
                        <div className="relative">
                            <div className="grid grid-cols-1 gap-2 lg:grid-cols-4">
                                <div className="lg:col-span-3">
                                    <div className="group relative h-[340px] overflow-hidden min-[400px]:h-[390px] sm:h-[500px] lg:h-[700px]">
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
                                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-[#191615]">
                                                <div className="flex flex-col items-center">
                                                    <LucideLoader
                                                        size={40}
                                                        className="mb-4 animate-spin text-orange-500"
                                                    />
                                                    <p className="text-gray-500 dark:text-gray-300">
                                                        {t('loading_image')}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100"></div>

                                        {/* Action Buttons */}
                                        <div className="absolute top-3 right-3 flex gap-1.5 sm:top-6 sm:right-6 sm:flex-col sm:gap-3">
                                            <button
                                                onClick={() =>
                                                    toggleFavorite(property.id)
                                                }
                                                className="group flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 p-2 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-2xl sm:h-11 sm:w-11 sm:rounded-2xl sm:p-3"
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
                                                className="group flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 p-2 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-2xl sm:h-11 sm:w-11 sm:rounded-2xl sm:p-3"
                                                title="Partager"
                                            >
                                                <LucideShare2
                                                    size={22}
                                                    className="text-gray-700 transition-colors group-hover:text-blue-500"
                                                />
                                            </button>
                                            <button
                                                onClick={() => openModal(0)}
                                                className="group flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 p-2 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-2xl sm:h-11 sm:w-11 sm:rounded-2xl sm:p-3"
                                                title="Voir en plein écran"
                                            >
                                                <LucideMaximize2
                                                    size={22}
                                                    className="text-gray-700 transition-colors group-hover:text-purple-500"
                                                />
                                            </button>
                                        </div>

                                        {/* Status Badge */}
                                        <div className="absolute top-3 left-3 flex max-w-[calc(100%_-_10.5rem)] flex-wrap gap-1.5 sm:top-6 sm:left-6 sm:max-w-none sm:gap-2">
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-bold text-white shadow-xl sm:gap-2 sm:px-4 sm:text-xs ${
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
                                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#CF8E19] px-3 py-2 text-[11px] font-bold text-[#292625] shadow-xl sm:gap-2 sm:px-4 sm:text-xs">
                                                    <LucideAward
                                                        size={15}
                                                        className="hidden min-[400px]:block"
                                                    />
                                                    {t('featured')}
                                                </span>
                                            )}
                                        </div>

                                        {/* Image Counter */}
                                        <div className="absolute bottom-3 left-3 rounded-full bg-black/65 px-3 py-2 backdrop-blur-md sm:bottom-6 sm:left-6 sm:px-4">
                                            <span className="flex items-center gap-1.5 text-xs font-medium text-white sm:gap-2 sm:text-sm">
                                                <LucideCamera size={16} />
                                                {currentIndex + 1} /{' '}
                                                {property.images?.length || 0}{' '}
                                                {t('photos')}
                                            </span>
                                        </div>

                                        {/* Navigation Arrows */}
                                        <button
                                            type="button"
                                            onClick={prevImage}
                                            aria-label={t('previous_image')}
                                            className="absolute top-1/2 left-6 hidden -translate-y-1/2 rounded-full bg-white/20 p-3 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100 hover:scale-110 hover:bg-white/30 sm:block"
                                        >
                                            <LucideChevronLeft size={28} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={nextImage}
                                            aria-label={t('next_image')}
                                            className="absolute top-1/2 right-6 hidden -translate-y-1/2 rounded-full bg-white/20 p-3 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100 hover:scale-110 hover:bg-white/30 sm:block"
                                        >
                                            <LucideChevronRight size={28} />
                                        </button>

                                        {/* Gallery View Toggle */}
                                        <div className="absolute right-6 bottom-6 hidden gap-2 sm:flex">
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
                        <div className="p-4 pt-6 sm:p-8 lg:p-12">
                            <div className="grid grid-cols-1 gap-7 lg:grid-cols-3 lg:gap-8">
                                <div className="lg:col-span-2">
                                    <div className="mb-6">
                                        <h1 className="mb-4 text-2xl leading-tight font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-[#F7F2E8]">
                                            {property.title}
                                        </h1>

                                        <div className="grid grid-cols-1 gap-3 text-gray-600 min-[400px]:grid-cols-2 sm:flex sm:flex-wrap sm:gap-6 dark:text-gray-300">
                                            <span className="flex min-w-0 items-center gap-2 text-sm font-medium">
                                                <LucideMapPin
                                                    size={18}
                                                    className="text-[#CF8E19]"
                                                />
                                                <span className="truncate">
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
                                    <div className="mb-7 grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-4">
                                        {propertyFeatures.map(
                                            (feature, index) => (
                                                <div
                                                    key={index}
                                                    className="group relative flex min-w-0 flex-col items-start gap-3 overflow-hidden rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-all duration-300 hover:border-[#C9A84C]/30 hover:shadow-md sm:flex-row sm:items-center sm:rounded-2xl sm:p-5 dark:border-white/10 dark:bg-[#191615]"
                                                >
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0d2340]/5 text-[#0d2340] transition-colors group-hover:bg-[#C9A84C] group-hover:text-white sm:h-12 sm:w-12 sm:rounded-xl dark:bg-[#C9A84C]/15 dark:text-[#E8B955]">
                                                        {feature.icon}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="truncate text-lg font-bold text-gray-900 sm:text-xl dark:text-[#F7F2E8]">
                                                            {feature.value}
                                                        </div>
                                                        <div className="truncate text-[10px] font-semibold tracking-wide text-gray-500 uppercase sm:text-xs dark:text-gray-400">
                                                            {feature.label}
                                                        </div>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>

                                    {/* Description Preview */}
                                    <div className="mb-7 rounded-2xl border border-transparent bg-gradient-to-r from-gray-50 to-gray-100 p-4 sm:p-6 dark:border-white/10 dark:from-[#191615] dark:to-[#25211F]">
                                        <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-[#F7F2E8]">
                                            {t('description')}
                                        </h3>
                                        <p className="leading-relaxed break-words whitespace-pre-line text-gray-700 dark:text-gray-300">
                                            {property.description}
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4">
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

                                        <button
                                            ref={visitTriggerRef}
                                            type="button"
                                            disabled={isPropertyOwner}
                                            onClick={() =>
                                                isPropertyOwner
                                                    ? undefined
                                                    : user
                                                      ? setVisitModal(true)
                                                      : router.visit(
                                                            route('login'),
                                                        )
                                            }
                                            className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#C9A84C] bg-white px-6 py-4 text-sm font-bold text-[#9A6811] transition-all duration-300 hover:bg-[#C9A84C]/10 focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:opacity-70 sm:col-span-2 md:col-span-1 dark:bg-[#211E1D] dark:text-[#E8B955] dark:hover:bg-[#C9A84C]/15 dark:focus-visible:ring-offset-[#12100F] dark:disabled:border-white/15 dark:disabled:text-gray-500"
                                        >
                                            <LucideCalendar size={18} />
                                            {isPropertyOwner
                                                ? t(
                                                      'visit_unavailable_for_owner',
                                                  )
                                                : t('schedule_visit')}
                                        </button>
                                    </div>
                                </div>

                                {/* Price & Agent Info */}
                                <div className="h-max lg:sticky lg:top-32 lg:col-span-1">
                                    <div className="rounded-2xl border border-[#CF8E19]/20 bg-[#413D3C] p-5 text-white shadow-xl sm:rounded-3xl sm:p-8 sm:shadow-2xl dark:bg-[#292625]">
                                        <div className="mb-6 text-center sm:mb-8">
                                            <div className="mb-2 text-3xl font-bold break-words sm:text-4xl lg:text-5xl">
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
                                            <div className="mb-5 flex items-center gap-3 sm:mb-6 sm:gap-4">
                                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#CF8E19]/20 text-xl font-bold text-[#CF8E19] shadow-lg sm:h-16 sm:w-16 sm:rounded-2xl sm:text-2xl">
                                                    {property.user.name
                                                        ?.charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="truncate text-base font-bold sm:text-lg">
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
                                                    className="hidden w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder-gray-400 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] focus:outline-none sm:block"
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
                                                    className="hidden w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder-gray-400 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] focus:outline-none sm:block"
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
                                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder-gray-400 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] focus:outline-none"
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
                                                    className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder-gray-400 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] focus:outline-none"
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
            <section className="bg-white py-10 sm:py-16 dark:bg-[#12100F]">
                <div className="container mx-auto px-3 sm:px-4">
                    <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="space-y-8 lg:col-span-2">
                            {/* Tabs Navigation */}
                            <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5 sm:rounded-3xl dark:bg-[#211E1D] dark:ring-white/10">
                                <div className="flex snap-x snap-mandatory gap-1 overflow-x-auto bg-gray-50 p-2 [scrollbar-width:none] dark:bg-[#191615] [&::-webkit-scrollbar]:hidden">
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
                                            className={`min-h-11 shrink-0 snap-start rounded-xl px-4 py-3 text-sm font-semibold whitespace-nowrap transition-all duration-300 sm:flex-1 sm:px-6 ${
                                                activeTab === tab.id
                                                    ? 'bg-[#413D3C] text-white shadow-md dark:bg-[#CF8E19] dark:text-[#292625]'
                                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white'
                                            }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="p-4 sm:p-8">
                                    {/* Overview Tab */}
                                    {activeTab === 'overview' && (
                                        <div className="space-y-8">
                                            <div>
                                                <h3 className="mb-5 text-xl font-bold text-gray-900 sm:mb-6 sm:text-2xl dark:text-[#F7F2E8]">
                                                    {t('property_details')}
                                                </h3>
                                                <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
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
                                                            className="flex min-w-0 items-center gap-3 rounded-xl border border-transparent bg-gradient-to-r from-gray-50 to-gray-100 p-3 transition-all duration-300 hover:shadow-md sm:gap-4 sm:rounded-2xl sm:p-4 dark:border-white/10 dark:from-[#191615] dark:to-[#25211F]"
                                                        >
                                                            <div className="rounded-xl bg-[#C9A84C]/10 p-3 text-[#9A6811] dark:text-[#E8B955]">
                                                                {item.icon}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                                    {item.label}
                                                                </div>
                                                                <div className="truncate font-bold text-gray-900 dark:text-[#F7F2E8]">
                                                                    {item.value}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="mb-5 text-xl font-bold text-gray-900 sm:mb-6 sm:text-2xl dark:text-[#F7F2E8]">
                                                    {t('rooms_details')}
                                                </h3>
                                                <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
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
                                                            className="flex min-w-0 items-center gap-3 rounded-xl border border-transparent bg-gradient-to-r from-blue-50 to-blue-100 p-3 transition-all duration-300 hover:shadow-md sm:gap-4 sm:rounded-2xl sm:p-4 dark:border-white/10 dark:from-[#191615] dark:to-[#25211F]"
                                                        >
                                                            <div className="rounded-xl bg-[#0d2340]/5 p-3 text-[#0d2340] dark:bg-[#C9A84C]/15 dark:text-[#E8B955]">
                                                                {item.icon}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                                    {item.label}
                                                                </div>
                                                                <div className="truncate font-bold text-gray-900 dark:text-[#F7F2E8]">
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
                                            <h3 className="mb-5 text-xl font-bold text-gray-900 sm:mb-6 sm:text-2xl dark:text-[#F7F2E8]">
                                                {t('full_description')}
                                            </h3>
                                            <div className="prose prose-lg max-w-none">
                                                <p className="text-base leading-relaxed break-words text-gray-700 sm:text-lg dark:text-gray-300">
                                                    {property.description}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Features Tab */}
                                    {activeTab === 'features' && (
                                        <div>
                                            <h3 className="mb-5 text-xl font-bold text-gray-900 sm:mb-6 sm:text-2xl dark:text-[#F7F2E8]">
                                                {t('features_amenities')}
                                            </h3>
                                            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
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
                                                                className="group flex items-center gap-3 rounded-xl border border-transparent bg-gradient-to-r from-green-50 to-emerald-50 p-3 transition-all duration-300 hover:shadow-md sm:gap-4 sm:rounded-2xl sm:p-4 dark:border-white/10 dark:from-[#191615] dark:to-[#25211F]"
                                                            >
                                                                <div className="rounded-xl bg-white p-3 text-green-600 shadow-sm transition-transform group-hover:scale-110 dark:bg-[#12100F] dark:text-emerald-400">
                                                                    {getAmenityIcon(
                                                                        amenity.name,
                                                                    )}
                                                                </div>
                                                                <span className="font-medium text-gray-900 dark:text-[#F7F2E8]">
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
                                            <h3 className="mb-5 text-xl font-bold text-gray-900 sm:mb-6 sm:text-2xl dark:text-[#F7F2E8]">
                                                {t('location')}
                                            </h3>
                                            <div className="flex h-64 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 sm:h-96 dark:from-[#191615] dark:to-[#25211F]">
                                                <p className="text-gray-500 dark:text-gray-300">
                                                    {t('map_loading')}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Gallery Tab */}
                                    {activeTab === 'gallery' && (
                                        <div>
                                            <div className="mb-6 flex items-center justify-between">
                                                <h3 className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-[#F7F2E8]">
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
                                                                ? 'bg-[#C9A84C]/20 text-[#9A6811] dark:text-[#E8B955]'
                                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/15'
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
                                                                ? 'bg-[#C9A84C]/20 text-[#9A6811] dark:text-[#E8B955]'
                                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/15'
                                                        }`}
                                                        title="Vue carrousel"
                                                    >
                                                        <LucideList size={20} />
                                                    </button>
                                                </div>
                                            </div>

                                            {galleryView === 'grid' ? (
                                                <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3">
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
                                                                    className="h-32 w-full object-cover transition-all duration-500 group-hover:scale-110 sm:h-48"
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
                                                    <div className="relative h-64 overflow-hidden rounded-2xl bg-gray-100 sm:h-96 dark:bg-[#191615]">
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
                                                            className="rounded-full bg-gray-100 p-2 text-gray-800 transition-colors hover:bg-gray-200 dark:bg-white/10 dark:text-gray-200 dark:hover:bg-white/15"
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
                                                                                ? 'bg-[#CF8E19]'
                                                                                : 'bg-gray-300 dark:bg-white/25'
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
                                                            className="rounded-full bg-gray-100 p-2 text-gray-800 transition-colors hover:bg-gray-200 dark:bg-white/10 dark:text-gray-200 dark:hover:bg-white/15"
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
                        <div className="space-y-6 sm:space-y-8">
                            {/* Similar Properties */}
                            <div className="rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/5 sm:rounded-3xl sm:p-8 dark:bg-[#211E1D] dark:ring-white/10">
                                <h3 className="mb-4 text-xl font-bold text-gray-900 sm:mb-6 sm:text-2xl dark:text-[#F7F2E8]">
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
                                                <div className="flex gap-3 rounded-xl border border-transparent bg-gradient-to-r from-gray-50 to-gray-100 p-3 transition-all duration-300 group-hover:scale-[1.01] hover:shadow-lg sm:gap-4 sm:rounded-2xl sm:p-4 dark:border-white/10 dark:from-[#191615] dark:to-[#25211F]">
                                                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-24 sm:rounded-xl">
                                                        <img
                                                            src={`/storage/${p.images[0]?.url}`}
                                                            alt={p.title}
                                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h4 className="mb-1 truncate font-bold text-gray-900 transition-colors group-hover:text-[#CF8E19] dark:text-[#F7F2E8]">
                                                            {p.title.length > 25
                                                                ? p.title.substring(
                                                                      0,
                                                                      25,
                                                                  ) + '...'
                                                                : p.title}
                                                        </h4>
                                                        <p className="mb-1 truncate text-base font-bold text-[#9A6811] sm:text-lg dark:text-[#E8B955]">
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
                                                        <p className="flex items-center gap-1 truncate text-xs text-gray-600 sm:text-sm dark:text-gray-300">
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
                <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/65 p-0 backdrop-blur-sm sm:items-center sm:p-4">
                    <div className="max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-8 dark:bg-[#211E1D]">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900 md:text-2xl dark:text-[#F7F2E8]">
                                {t('share_property')}
                            </h3>
                            <button
                                onClick={() => setShareModal(false)}
                                className="rounded-xl p-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10"
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

                        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 md:gap-3">
                            <input
                                type="text"
                                value={window.location.href}
                                readOnly
                                className="min-w-0 rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium md:px-4 md:py-3 dark:border-white/15 dark:bg-[#161413] dark:text-[#F7F2E8]"
                            />
                            <button
                                onClick={() =>
                                    handleCopyToClipboard(window.location.href)
                                }
                                className="flex items-center gap-2 rounded-xl bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-300 hover:bg-gray-300 md:px-6 md:py-3 md:text-base dark:bg-white/10 dark:text-gray-200 dark:hover:bg-white/15"
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
            {visitModal && (
                <div
                    className="fixed inset-0 z-[70] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
                    role="presentation"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setVisitModal(false);
                        }
                    }}
                >
                    <div
                        ref={visitDialogRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="visit-dialog-title"
                        className="max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl border border-[#C9A84C]/20 bg-white p-5 shadow-2xl sm:max-w-lg sm:rounded-3xl sm:p-8 dark:bg-[#211E1D]"
                    >
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <p className="mb-2 text-xs font-bold tracking-[0.2em] text-[#9A6811] uppercase dark:text-[#E8B955]">
                                    {t('private_viewing')}
                                </p>
                                <h2
                                    id="visit-dialog-title"
                                    className="text-2xl font-bold text-[#292625] dark:text-[#F7F2E8]"
                                >
                                    {t('schedule_visit')}
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                                    {t('schedule_visit_help')}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setVisitModal(false)}
                                aria-label={t('close')}
                                className="shrink-0 rounded-xl p-2 text-gray-600 transition hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:outline-none dark:text-gray-300 dark:hover:bg-white/10"
                            >
                                <LucideX size={20} />
                            </button>
                        </div>

                        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[#C9A84C]/20 bg-[#C9A84C]/10 p-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#413D3C] text-[#E8B955] dark:bg-[#12100F]">
                                <LucideHome size={20} />
                            </div>
                            <div className="min-w-0">
                                <p className="truncate font-bold text-[#292625] dark:text-[#F7F2E8]">
                                    {property.title}
                                </p>
                                <p className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                                    <LucideMapPin size={14} />
                                    {property.municipality?.name ||
                                        t('unknown_location')}
                                </p>
                            </div>
                        </div>

                        <form
                            className="space-y-5"
                            noValidate
                            onSubmit={(event) => {
                                event.preventDefault();
                                clearVisitErrors();

                                if (!visitData.scheduled_at) {
                                    setVisitError(
                                        'scheduled_at',
                                        t('visit_date_required'),
                                    );
                                    requestAnimationFrame(() =>
                                        document
                                            .getElementById(
                                                'visit-scheduled-at',
                                            )
                                            ?.focus(),
                                    );
                                    return;
                                }

                                if (!visitData.phone.trim()) {
                                    setVisitError(
                                        'phone',
                                        t('visit_phone_required'),
                                    );
                                    requestAnimationFrame(() =>
                                        document
                                            .getElementById('visit-phone')
                                            ?.focus(),
                                    );
                                    return;
                                }

                                submitVisit(
                                    route(
                                        'property.visit.schedule',
                                        property.slug,
                                    ),
                                    {
                                        preserveScroll: true,
                                        onSuccess: () => {
                                            setVisitModal(false);
                                            resetVisit();
                                        },
                                        onError: () =>
                                            requestAnimationFrame(() =>
                                                visitDialogRef.current
                                                    ?.querySelector<HTMLElement>(
                                                        '[aria-invalid="true"]',
                                                    )
                                                    ?.focus(),
                                            ),
                                    },
                                );
                            }}
                        >
                            <div>
                                <label
                                    htmlFor="visit-scheduled-at"
                                    className="mb-2 block text-sm font-bold text-[#292625] dark:text-[#F7F2E8]"
                                >
                                    {t('preferred_visit_time')}
                                </label>
                                <input
                                    id="visit-scheduled-at"
                                    type="datetime-local"
                                    required
                                    min={minimumVisitDate}
                                    value={visitData.scheduled_at}
                                    onChange={(event) =>
                                        setVisitData(
                                            'scheduled_at',
                                            event.target.value,
                                        )
                                    }
                                    aria-invalid={Boolean(
                                        visitErrors.scheduled_at,
                                    )}
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-[#292625] transition outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/25 dark:border-white/15 dark:bg-[#161413] dark:text-[#F7F2E8] dark:[color-scheme:dark]"
                                />
                                <ErrorText error={visitErrors.scheduled_at} />
                            </div>

                            <div>
                                <label
                                    htmlFor="visit-phone"
                                    className="mb-2 block text-sm font-bold text-[#292625] dark:text-[#F7F2E8]"
                                >
                                    {t('your_phone')}
                                </label>
                                <input
                                    id="visit-phone"
                                    type="tel"
                                    required
                                    autoComplete="tel"
                                    value={visitData.phone}
                                    onChange={(event) =>
                                        setVisitData(
                                            'phone',
                                            event.target.value,
                                        )
                                    }
                                    aria-invalid={Boolean(visitErrors.phone)}
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-[#292625] transition outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/25 dark:border-white/15 dark:bg-[#161413] dark:text-[#F7F2E8]"
                                />
                                <ErrorText error={visitErrors.phone} />
                            </div>

                            <div>
                                <label
                                    htmlFor="visit-message"
                                    className="mb-2 block text-sm font-bold text-[#292625] dark:text-[#F7F2E8]"
                                >
                                    {t('message_optional')}
                                </label>
                                <textarea
                                    id="visit-message"
                                    rows={3}
                                    maxLength={1500}
                                    value={visitData.message}
                                    onChange={(event) =>
                                        setVisitData(
                                            'message',
                                            event.target.value,
                                        )
                                    }
                                    placeholder={t('visit_message_placeholder')}
                                    aria-invalid={Boolean(visitErrors.message)}
                                    className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-[#292625] transition outline-none placeholder:text-gray-400 focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/25 dark:border-white/15 dark:bg-[#161413] dark:text-[#F7F2E8]"
                                />
                                <ErrorText error={visitErrors.message} />
                            </div>

                            <button
                                type="submit"
                                disabled={visitProcessing}
                                aria-busy={visitProcessing}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#CF8E19] px-6 py-4 font-bold text-[#211E1D] transition hover:bg-[#E8B955] focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-[#211E1D]"
                            >
                                {visitProcessing ? (
                                    <LucideLoader
                                        size={18}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <LucideCalendar size={18} />
                                )}
                                {visitProcessing
                                    ? t('scheduling_visit')
                                    : t('send_visit_request')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </App>
    );
}
