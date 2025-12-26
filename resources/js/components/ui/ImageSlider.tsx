import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const ImageSlider = ({ images }: { images: any[] }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
        null
    );

    const openModal = (index: number) => {
        setSelectedImageIndex(index);
    };

    const closeModal = () => {
        setSelectedImageIndex(null);
    };

    const showNextImage = () => {
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((selectedImageIndex + 1) % images.length);
        }
    };

    const showPreviousImage = () => {
        if (selectedImageIndex !== null) {
            setSelectedImageIndex(
                (selectedImageIndex - 1 + images.length) % images.length
            );
        }
    };

    return (
        <div className="image-slider-container">
            {/* Swiper for sliding images */}
            <Swiper
                modules={[Navigation]}
                navigation
                spaceBetween={30}
                slidesPerView={1}
                loop={true}
            >
                {images.map((image, index) => (
                    <SwiperSlide key={index}>
                        <img
                            src={`/storage/${image.url}`}
                            alt={`Slide ${index + 1}`}
                            className="slider-image"
                            onClick={() => openModal(index)}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Modal for viewing enlarged image */}
            {selectedImageIndex !== null && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}>
                            &times;
                        </button>
                        <button className="modal-nav modal-prev" onClick={showPreviousImage}>
                            &lt;
                        </button>
                        <img
                            src={`/storage/${images[selectedImageIndex].url}`}
                            alt="Enlarged view"
                            className="modal-image"
                        />
                        <button className="modal-nav modal-next" onClick={showNextImage}>
                            &gt;
                        </button>
                        <div className="modal-indicator">
                            {selectedImageIndex + 1} / {images.length}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageSlider;