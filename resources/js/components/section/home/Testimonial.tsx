import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useTranslation } from 'react-i18next';

export default function Testimonial() {
    const { t, i18n } = useTranslation();
    return (
        <section className="testimonial-10-area padding-y-120 h9-bg-secondary position-relative z-index-1 overflow-hidden">
            <div className="container">
                <div className="row align-items-center justify-content-between">
                    <div className="col-xl-6 col-lg-7">
                        <div className="section-9-wrapper mb-64">
                            <h6 className="section-9-subtitle">{t('testimonial_subtitle')}</h6>
                            <h2 className="section-9-title mb-32 text-white">
                                {i18n.language === 'fr' ? 'Trouvez une maison qui correspond à vos besoins' : 'Find an apartment that fits your needs'}
                            </h2>
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-4">
                        <div className="team-10-top-button">
                            <a href="#" className="home-9-btn h9-hover-btn">
                                See all members{' '}
                                <span>
                                    <img src="assets/images/icons/right-arrow-long.svg" alt="" />
                                </span>
                                <div className="h9-hover-btn-circle-dot" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xxl-12">
                        <div className="testimonial-10-slide position-relative z-index-1">
                            <Swiper
                                modules={[Pagination]}
                                spaceBetween={30}
                                slidesPerView={1}
                                autoplay
                                pagination={{
                                    clickable: true,
                                    el: '.testimonial-10-dots'
                                }}
                                className="testimonial-10-active"
                            >
                                {/* Slide 1 */}
                                <SwiperSlide>
                                    <div className="testimonial-10-wrapper">
                                        <h4 className="testimonial-10-title font-plusjakarta text-capitalize">"Great experience"</h4>
                                        <p className="testimonial-10-paragraph font-inter">
                                            Sasstech hires great people from a widely variety of backgrounds, which simply makes our company
                                            stronger, and we couldn't be prouder of that. elevating your optimizing Business Growth.
                                        </p>
                                        <div className="testimonial-10-wrap d-flex justify-content-between align-items-center">
                                            <h6 className="testimonial-10-name font-plusjakarta mb-0">
                                                Robert J. Hare/ <span>Graphics Designer</span>
                                            </h6>
                                            <div className="testimonial-10-review">
                                                <ul className="star-rating d-flex align-items-center">
                                                    <li className="star-rating__item">
                                                        <i className="fas fa-star" />
                                                    </li>
                                                    <li className="star-rating__item">
                                                        <i className="fas fa-star" />
                                                    </li>
                                                    <li className="star-rating__item">
                                                        <i className="fas fa-star" />
                                                    </li>
                                                    <li className="star-rating__item">
                                                        <i className="fas fa-star" />
                                                    </li>
                                                    <li className="star-rating__item unabled">
                                                        <i className="fas fa-star" />
                                                    </li>
                                                </ul>
                                                <p className="review-paragraph mb-0 text-white">
                                                    <span>4.3 </span> score, 47 Reviews
                                                </p>
                                            </div>
                                        </div>
                                        <div className="testimonial-10-overlay" />
                                    </div>
                                </SwiperSlide>

                                {/* Slide 2 */}
                                <SwiperSlide>
                                    <div className="testimonial-10-wrapper">
                                        <h4 className="testimonial-10-title font-plusjakarta text-capitalize">"Excellent service"</h4>
                                        <p className="testimonial-10-paragraph font-inter">
                                            The team went above and beyond to help me find my dream apartment. Highly recommended for anyone looking
                                            for quality housing solutions in the city.
                                        </p>
                                        <div className="testimonial-10-wrap d-flex justify-content-between align-items-center">
                                            <h6 className="testimonial-10-name font-plusjakarta mb-0">
                                                Sarah K. Smith/ <span>Marketing Manager</span>
                                            </h6>
                                            <div className="testimonial-10-review">
                                                <ul className="star-rating d-flex align-items-center">
                                                    <li className="star-rating__item">
                                                        <i className="fas fa-star" />
                                                    </li>
                                                    <li className="star-rating__item">
                                                        <i className="fas fa-star" />
                                                    </li>
                                                    <li className="star-rating__item">
                                                        <i className="fas fa-star" />
                                                    </li>
                                                    <li className="star-rating__item">
                                                        <i className="fas fa-star" />
                                                    </li>
                                                    <li className="star-rating__item">
                                                        <i className="fas fa-star" />
                                                    </li>
                                                </ul>
                                                <p className="review-paragraph mb-0 text-white">
                                                    <span>5.0 </span> score, 32 Reviews
                                                </p>
                                            </div>
                                        </div>
                                        <div className="testimonial-10-overlay" />
                                    </div>
                                </SwiperSlide>

                                {/* Slide 3 */}
                                <SwiperSlide>
                                    <div className="testimonial-10-wrapper">
                                        <h4 className="testimonial-10-title font-plusjakarta text-capitalize">"Very professional"</h4>
                                        <p className="testimonial-10-paragraph font-inter">
                                            From the first consultation to the final signing, everything was handled with utmost professionalism.
                                            Found exactly what I was looking for within my budget.
                                        </p>
                                        <div className="testimonial-10-wrap d-flex justify-content-between align-items-center">
                                            <h6 className="testimonial-10-name font-plusjakarta mb-0">
                                                Michael T. Johnson/ <span>Software Engineer</span>
                                            </h6>
                                            <div className="testimonial-10-review">
                                                <ul className="star-rating d-flex align-items-center">
                                                    <li className="star-rating__item">
                                                        <i className="fas fa-star" />
                                                    </li>
                                                    <li className="star-rating__item">
                                                        <i className="fas fa-star" />
                                                    </li>
                                                    <li className="star-rating__item">
                                                        <i className="fas fa-star" />
                                                    </li>
                                                    <li className="star-rating__item">
                                                        <i className="fas fa-star" />
                                                    </li>
                                                    <li className="star-rating__item">
                                                        <i className="fas fa-star-half-alt" />
                                                    </li>
                                                </ul>
                                                <p className="review-paragraph mb-0 text-white">
                                                    <span>4.5 </span> score, 28 Reviews
                                                </p>
                                            </div>
                                        </div>
                                        <div className="testimonial-10-overlay" />
                                    </div>
                                </SwiperSlide>
                            </Swiper>
                            <div className="testimonial-10-dots text-center" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="testimonial-10-bg-shape">
                <img src="assets/images/shapes/testimonial-10-quote.png" alt="quote" />
            </div>
        </section>
    );
}