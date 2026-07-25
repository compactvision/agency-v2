import {
    LucideChevronLeft,
    LucideChevronRight,
    LucideDownload,
    LucideGrid3x3,
    LucideMaximize2,
    LucidePause,
    LucidePlay,
    LucideRotateCw,
    LucideX,
    LucideZoomIn,
    LucideZoomOut,
} from 'lucide-react';
import type {
    Dispatch,
    MouseEventHandler,
    RefObject,
    SetStateAction,
    TouchEventHandler,
} from 'react';
import { useTranslation } from 'react-i18next';

type Offset = { x: number; y: number };
type GalleryImage = { id?: number | string; url: string };
type GalleryProperty = { title: string; images: GalleryImage[] };

export default function PropertyGalleryDialog({
    property,
    dialogRef,
    imageRef,
    currentIndex,
    zoomLevel,
    rotation,
    dragOffset,
    isDragging,
    isMobile,
    autoPlay,
    showThumbnails,
    setAutoPlay,
    setShowThumbnails,
    setCurrentIndex,
    setZoomLevel,
    setRotation,
    setDragOffset,
    closeModal,
    handleZoomOut,
    handleZoomIn,
    handleRotate,
    handleReset,
    handleDownload,
    prevImage,
    nextImage,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
}: {
    property: GalleryProperty;
    dialogRef: RefObject<HTMLDivElement | null>;
    imageRef: RefObject<HTMLImageElement | null>;
    currentIndex: number;
    zoomLevel: number;
    rotation: number;
    dragOffset: Offset;
    isDragging: boolean;
    isMobile: boolean;
    autoPlay: boolean;
    showThumbnails: boolean;
    setAutoPlay: Dispatch<SetStateAction<boolean>>;
    setShowThumbnails: Dispatch<SetStateAction<boolean>>;
    setCurrentIndex: Dispatch<SetStateAction<number>>;
    setZoomLevel: Dispatch<SetStateAction<number>>;
    setRotation: Dispatch<SetStateAction<number>>;
    setDragOffset: Dispatch<SetStateAction<Offset>>;
    closeModal: () => void;
    handleZoomOut: () => void;
    handleZoomIn: () => void;
    handleRotate: () => void;
    handleReset: () => void;
    handleDownload: () => void;
    prevImage: () => void;
    nextImage: () => void;
    onMouseDown: MouseEventHandler<HTMLDivElement>;
    onMouseMove: MouseEventHandler<HTMLDivElement>;
    onMouseUp: MouseEventHandler<HTMLDivElement>;
    onTouchStart: TouchEventHandler<HTMLDivElement>;
    onTouchMove: TouchEventHandler<HTMLDivElement>;
    onTouchEnd: TouchEventHandler<HTMLDivElement>;
}) {
    const { t } = useTranslation();

    const iconButton =
        'min-h-11 min-w-11 rounded-full bg-white/10 p-2 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/20 md:p-3';

    return (
        <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="property-gallery-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-0 sm:p-4"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            <div className="absolute top-0 right-0 left-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-2 sm:p-4 md:p-6">
                <div className="flex items-start justify-between gap-2">
                    <h2 id="property-gallery-title" className="sr-only">
                        Galerie photos : {property.title}
                    </h2>
                    <div className="flex shrink-0 items-center gap-1.5 md:gap-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            aria-label={t('close_gallery', 'Fermer la galerie')}
                            className={iconButton}
                        >
                            <LucideX aria-hidden="true" />
                        </button>
                        <div
                            aria-live="polite"
                            className="rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-md md:px-4 md:py-2 md:text-sm"
                        >
                            {currentIndex + 1} / {property.images.length}
                        </div>
                    </div>

                    <div className="flex min-w-0 items-center gap-1 md:gap-3">
                        <button
                            type="button"
                            onClick={handleZoomOut}
                            aria-label={t('zoom_out', 'Dézoomer')}
                            className={`${iconButton} hidden sm:inline-flex`}
                        >
                            <LucideZoomOut aria-hidden="true" />
                        </button>
                        <span className="rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white md:px-3 md:text-sm">
                            {Math.round(zoomLevel * 100)}%
                        </span>
                        <button
                            type="button"
                            onClick={handleZoomIn}
                            aria-label={t('zoom_in', 'Zoomer')}
                            className={`${iconButton} hidden sm:inline-flex`}
                        >
                            <LucideZoomIn aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            onClick={handleRotate}
                            aria-label={t(
                                'rotate_image',
                                "Faire pivoter l'image",
                            )}
                            className={`${iconButton} hidden sm:inline-flex`}
                        >
                            <LucideRotateCw aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            aria-label={t(
                                'reset_image',
                                "Réinitialiser l'image",
                            )}
                            className={`${iconButton} hidden sm:inline-flex`}
                        >
                            <LucideMaximize2 aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            onClick={handleDownload}
                            aria-label={t(
                                'download_image',
                                "Télécharger l'image",
                            )}
                            className={`${iconButton} hidden sm:inline-flex`}
                        >
                            <LucideDownload aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setAutoPlay((current) => !current)}
                            aria-label={
                                autoPlay
                                    ? t(
                                          'pause_slideshow',
                                          'Mettre le diaporama en pause',
                                      )
                                    : t('play_slideshow', 'Lancer le diaporama')
                            }
                            aria-pressed={autoPlay}
                            className={iconButton}
                        >
                            {autoPlay ? (
                                <LucidePause aria-hidden="true" />
                            ) : (
                                <LucidePlay aria-hidden="true" />
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                setShowThumbnails((current) => !current)
                            }
                            aria-label={t(
                                'toggle_thumbnails',
                                'Afficher ou masquer les miniatures',
                            )}
                            aria-pressed={showThumbnails}
                            className={iconButton}
                        >
                            <LucideGrid3x3 aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="relative flex h-full w-full items-center justify-center">
                <img
                    ref={imageRef}
                    src={`/storage/${property.images[currentIndex]?.url}`}
                    alt={`${property.title} ${currentIndex + 1}`}
                    className="max-h-full max-w-full rounded-lg object-contain transition-transform duration-300 select-none"
                    style={{
                        transform: `scale(${zoomLevel}) rotate(${rotation}deg) translate(${dragOffset.x}px, ${dragOffset.y}px)`,
                        cursor:
                            zoomLevel > 1
                                ? isDragging
                                    ? 'grabbing'
                                    : 'grab'
                                : 'default',
                        maxWidth: isMobile ? '100%' : '90vw',
                        maxHeight: isMobile ? '66dvh' : '80vh',
                    }}
                    draggable={false}
                />
            </div>

            <button
                type="button"
                onClick={prevImage}
                aria-label={t('previous_image', 'Image précédente')}
                className={`${iconButton} absolute top-1/2 left-1 -translate-y-1/2 sm:left-2 md:left-6`}
            >
                <LucideChevronLeft aria-hidden="true" />
            </button>
            <button
                type="button"
                onClick={nextImage}
                aria-label={t('next_image', 'Image suivante')}
                className={`${iconButton} absolute top-1/2 right-1 -translate-y-1/2 sm:right-2 md:right-6`}
            >
                <LucideChevronRight aria-hidden="true" />
            </button>

            {showThumbnails && (
                <div className="absolute right-0 bottom-0 left-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-2 sm:p-4 md:p-6">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {property.images.map((image, index) => (
                            <button
                                key={image.id ?? index}
                                type="button"
                                aria-label={`${t('show_image', "Afficher l'image")} ${index + 1}`}
                                aria-current={
                                    index === currentIndex ? 'true' : undefined
                                }
                                onClick={() => {
                                    setCurrentIndex(index);
                                    setZoomLevel(1);
                                    setRotation(0);
                                    setDragOffset({ x: 0, y: 0 });
                                }}
                                className={`h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg transition-all duration-300 md:h-20 md:w-20 ${
                                    index === currentIndex
                                        ? 'scale-110 ring-2 ring-white'
                                        : 'opacity-70 hover:opacity-100'
                                }`}
                            >
                                <img
                                    src={`/storage/${image.url}`}
                                    alt=""
                                    className="h-full w-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {!isMobile && (
                <div className="absolute right-6 bottom-6 rounded-lg bg-black/60 px-4 py-2 text-xs text-white backdrop-blur-md">
                    <p className="mb-1 font-semibold">
                        {t('keyboard_shortcuts')}
                    </p>
                    <p>← → : {t('navigate')}</p>
                    <p>+ - : {t('zoom')}</p>
                    <p>R : {t('rotate')}</p>
                    <p>Space : {t('play_pause')}</p>
                    <p>ESC : {t('close')}</p>
                </div>
            )}
        </div>
    );
}
