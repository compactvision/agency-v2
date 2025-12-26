import App from '@/components/layouts/Home/App';
import Breadcumb from '@/components/ui/Breadcumb';
import ErrorText from '@/components/ui/ErrorText';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

type Municipality = { id: number; name: string };
type Amenity = { id: number; name: string };

export default function CreateProperty({
    municipalities,
    amenities,
    hasActiveSubscription,
}: {
    municipalities: Municipality[];
    amenities: Amenity[];
    hasActiveSubscription: boolean;
}) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        type: '',
        sale_type: '',
        price: '',
        surface: '',
        bedrooms: '',
        bathrooms: '',
        kitchens: '',
        rooms: '',
        address: '',
        floor: '',
        quarter: '',
        total_floors: '',
        property_age: '',
        is_published: false,
        municipality_id: null as number | null,
        images: [] as File[],
        amenities: [] as number[],
    });
    const { t } = useTranslation();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (key === 'images') {
                (value as File[]).forEach((file) => {
                    formData.append('images[]', file);
                });
            } else if (typeof value === 'boolean') {
                formData.append(key, value ? '1' : '0');
            } else if (Array.isArray(value)) {
                value.forEach((v) => formData.append(`${key}[]`, v.toString()));
            } else if (value !== null && value !== undefined) {
                formData.append(key, value.toString());
            }
        });

        post(route('dashboard.properties.store'), {
            preserveScroll: true,
            forceFormData: true,
            onError: (errors) => {
                //console.error('Validation Errors:', errors);
                if (errors.images || (errors.error && errors.error.includes('image'))) {
                    resetImages();
                }
            },
        });
    };

    const fileInputRef = React.useRef<HTMLInputElement | null>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newImages = Array.from(files);
            setData('images', [...data.images, ...newImages]);
        }
    };

    const resetImages = () => {
        setData('images', []);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemoveImage = (index: number) => {
        const updatedImages = [...data.images];
        updatedImages.splice(index, 1);
        setData('images', updatedImages);
    };

    return (
        <App>
            <Head title={`${t('add_listing')}`} />
            <Breadcumb title={t('add_listing')} homeLink={route('home')} />
            <section className="listing padding-y-120">
                <div className="container-two container">
                    <div className="row gy-4">
                        <div className="col-lg-3">
                            <div className="listing-sidebar">
                                <ul id="list-scroll" className="sidebar-list d-flex flex-column gap-2">
                                    <li className="sidebar-list__item">
                                        <a href="#basicInformation" className="sidebar-list__link">
                                            {t('basic_information')}
                                        </a>
                                    </li>
                                    <li className="sidebar-list__item">
                                        <a href="#propertyGallery" className="sidebar-list__link">
                                            {t('property_gallery')}
                                        </a>
                                    </li>
                                    <li className="sidebar-list__item">
                                        <a href="#propertyInformation" className="sidebar-list__link">
                                            {t('property_information')}
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-9 ps-lg-5">
                            <div
                                data-bs-spy="scroll"
                                data-bs-target="#list-scroll"
                                data-bs-offset={0}
                                data-bs-smooth-scroll="true"
                                className="scrollspy-example"
                                tabIndex={0}
                            >
                                {!hasActiveSubscription && (
                                    <div className="alert alert-warning mb-4 text-center">
                                        {t('no_active_subscription')}{' '}
                                        <a href={route('dashboard.subscriptions.index')} className="btn btn-sm btn-primary ms-2">
                                            {t('subscribe_now')}
                                        </a>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="card-item" id="basicInformation">
                                        <div className="card common-card">
                                            <div className="card-header">
                                                <h6 className="title mb-0">{t('property_basic_information')}</h6>
                                            </div>
                                            <div className="card-body">
                                                <div className="row gy-4">
                                                    <div className="col-sm-12">
                                                        <label htmlFor="propertyTitle" className="form-label">
                                                            {t('property_title')}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="common-input"
                                                            id="propertyTitle"
                                                            placeholder={t('property_title')}
                                                            value={data.title}
                                                            onChange={(e) => setData('title', e.target.value)}
                                                        />
                                                        <ErrorText error={errors.title} />
                                                    </div>
                                                    <div className="col-12">
                                                        <label htmlFor="Description" className="form-label">
                                                            {t('description')}
                                                        </label>
                                                        <textarea
                                                            className="common-input"
                                                            id="Description"
                                                            placeholder={t('description')}
                                                            value={data.description}
                                                            onChange={(e) => setData('description', e.target.value)}
                                                        />
                                                        <ErrorText error={errors.description} />
                                                    </div>
                                                    <div className="col-sm-6 col-xs-6">
                                                        <label htmlFor="sale_type" className="form-label">
                                                            {t('sale_type')}
                                                        </label>
                                                        <div className="select-has-icon icon-black">
                                                            <select
                                                                className="select common-input"
                                                                id="Status"
                                                                value={data.sale_type}
                                                                onChange={(e) => setData('sale_type', e.target.value)}
                                                            >
                                                                <option value="" disabled>
                                                                    {t('sale_type')}
                                                                </option>

                                                                <option value={'rent'}>{t('for_rent')}</option>
                                                                <option value={'sale'}>{t('for_sell')}</option>
                                                            </select>
                                                            <ErrorText error={errors.sale_type} />
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6 col-xs-6">
                                                        <label htmlFor="Type" className="form-label">
                                                            Type
                                                        </label>
                                                        <div className="select-has-icon icon-black">
                                                            <select
                                                                className="select common-input"
                                                                id="Type"
                                                                value={data.type}
                                                                onChange={(e) => setData('type', e.target.value)}
                                                            >
                                                                <option value="" disabled>
                                                                    {t('type')}
                                                                </option>
                                                                <option value={'apartment'}>{t('apartment')}</option>
                                                                <option value={'house'}>{t('house')}</option>
                                                                <option value={'studio'}>{t('studio')}</option>
                                                                <option value={'office'}>{t('office')}</option>
                                                                <option value={'villa'}>{t('villa')}</option>
                                                                <option value={'land'}>{t('land')}</option>
                                                                <option value={'shop'}>{t('shop')}</option>
                                                                <option value={'garage'}>{t('garage')}</option>
                                                                <option value={'warehouse'}>{t('warehouse')}</option>
                                                                <option value={'other'}>{t('other')}</option>
                                                            </select>
                                                            <ErrorText error={errors.type} />
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6 col-xs-6">
                                                        <label htmlFor="Price" className="form-label">
                                                            {t('price')}
                                                        </label>
                                                        <input
                                                            type="number"
                                                            className="common-input"
                                                            id="Price"
                                                            min={1}
                                                            placeholder="USD"
                                                            value={data.price}
                                                            onChange={(e) => setData('price', e.target.value)}
                                                        />
                                                        <ErrorText error={errors.price} />
                                                    </div>
                                                    <div className="col-sm-6 col-xs-6">
                                                        <label htmlFor="Area" className="form-label">
                                                            {t('address')}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="common-input"
                                                            id="Area"
                                                            placeholder={t('address')}
                                                            value={data.address}
                                                            onChange={(e) => setData('address', e.target.value)}
                                                        />
                                                        <ErrorText error={errors.address} />
                                                    </div>
                                                    <div className="col-sm-6 col-xs-6">
                                                        <label htmlFor="Rooms" className="form-label">
                                                            {t('municipality')}
                                                        </label>
                                                        <div className="select-has-icon icon-black">
                                                            <select
                                                                className="select common-input"
                                                                id="municipality_id"
                                                                value={data.municipality_id ?? ''}
                                                                onChange={(e) => setData('municipality_id', Number(e.target.value))}
                                                            >
                                                                <option value="" disabled>
                                                                    {t('choose_municipality')}
                                                                </option>
                                                                {municipalities.map((municipality) => (
                                                                    <option key={municipality.id} value={municipality.id}>
                                                                        {municipality.name}
                                                                    </option>
                                                                ))}
                                                            </select>

                                                            <ErrorText error={errors.municipality_id} />
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6 col-xs-6">
                                                        <label htmlFor="Quarter" className="form-label">
                                                            {t('quarter')}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="common-input"
                                                            id="Quarter"
                                                            placeholder={t('quarter')}
                                                            value={data.quarter}
                                                            onChange={(e) => setData('quarter', e.target.value)}
                                                        />
                                                        <ErrorText error={errors.quarter} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-item" id="propertyGallery">
                                        <div className="card common-card">
                                            <div className="card-header">
                                                <h6 className="title mb-0">{t('property_gallery')}</h6>
                                            </div>
                                            <div className="card-body">
                                                <div className="input-images">
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        className="form-control mb-3"
                                                    />
                                                    <div className="image-previews">
                                                        {data.images.map((image, index) => (
                                                            <div key={index} className="image-preview">
                                                                <img
                                                                    src={URL.createObjectURL(image)}
                                                                    alt={`preview-${index}`}
                                                                    style={{
                                                                        width: '100px',
                                                                        height: '100px',
                                                                        objectFit: 'cover',
                                                                        marginRight: '10px',
                                                                        borderRadius: '5px',
                                                                    }}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() => handleRemoveImage(index)}
                                                                >
                                                                    {t('remove')}
                                                                </button>
                                                            </div>
                                                        ))}
                                                        <ErrorText error={errors.images} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-item" id="propertyInformation">
                                        <div className="card common-card">
                                            <div className="card-header">
                                                <h6 className="title mb-0">{t('details_information')}</h6>
                                            </div>
                                            <div className="card-body">
                                                <div className="row gy-4">
                                                    <div className="col-xl-3 col-sm-6 col-xs-6">
                                                        <label htmlFor="AreaSize" className="form-label">
                                                            {t('area_size')}
                                                        </label>
                                                        <input
                                                            type="number"
                                                            className="common-input"
                                                            id="AreaSize"
                                                            placeholder={t('area_size')}
                                                            value={data.surface}
                                                            onChange={(e) => setData('surface', e.target.value)}
                                                        />
                                                        <ErrorText error={errors.surface} />
                                                    </div>
                                                    <div className="col-xl-3 col-sm-6 col-xs-6">
                                                        <label htmlFor="SizePrefix" className="form-label">
                                                            {t('floor')}
                                                        </label>
                                                        <input
                                                            type="number"
                                                            className="common-input"
                                                            id="SizePrefix"
                                                            placeholder={t('floor')}
                                                            value={data.floor}
                                                            onChange={(e) => setData('floor', e.target.value)}
                                                        />
                                                        <ErrorText error={errors.floor} />
                                                    </div>
                                                    <div className="col-xl-3 col-sm-6 col-xs-6">
                                                        <label htmlFor="LandArea" className="form-label">
                                                            {t('total_floors')}
                                                        </label>
                                                        <input
                                                            type="number"
                                                            className="common-input"
                                                            id="LandArea"
                                                            placeholder={t('total_floors')}
                                                            value={data.total_floors}
                                                            onChange={(e) => setData('total_floors', e.target.value)}
                                                        />
                                                        <ErrorText error={errors.total_floors} />
                                                    </div>
                                                    <div className="col-xl-3 col-sm-6 col-xs-6">
                                                        <label htmlFor="Bedrooms" className="form-label">
                                                            {t('bedrooms')}
                                                        </label>
                                                        <input
                                                            type="number"
                                                            className="common-input"
                                                            id="Bedrooms"
                                                            placeholder={t('bedrooms')}
                                                            value={data.bedrooms}
                                                            onChange={(e) => setData('bedrooms', e.target.value)}
                                                        />
                                                        <ErrorText error={errors.bedrooms} />
                                                    </div>
                                                    <div className="col-xl-3 col-sm-6 col-xs-6">
                                                        <label htmlFor="Bathrooms" className="form-label">
                                                            {t('bathrooms')}
                                                        </label>
                                                        <input
                                                            type="number"
                                                            className="common-input"
                                                            id="Bathrooms"
                                                            placeholder={t('bathrooms')}
                                                            value={data.bathrooms}
                                                            onChange={(e) => setData('bathrooms', e.target.value)}
                                                        />
                                                        <ErrorText error={errors.bathrooms} />
                                                    </div>
                                                    <div className="col-xl-3 col-sm-6 col-xs-6">
                                                        <label htmlFor="Kitchen" className="form-label">
                                                            {t('kitchen')}
                                                        </label>
                                                        <input
                                                            type="number"
                                                            className="common-input"
                                                            id="Kitchen"
                                                            placeholder={t('kitchen')}
                                                            value={data.kitchens}
                                                            onChange={(e) => setData('kitchens', e.target.value)}
                                                        />
                                                        <ErrorText error={errors.kitchens} />
                                                    </div>
                                                    <div className="col-xl-3 col-sm-6 col-xs-6">
                                                        <label htmlFor="Garages" className="form-label">
                                                            {t('rooms')}
                                                        </label>
                                                        <input
                                                            type="number"
                                                            className="common-input"
                                                            id="Garages"
                                                            placeholder={t('rooms')}
                                                            value={data.rooms}
                                                            onChange={(e) => setData('rooms', e.target.value)}
                                                        />
                                                        <ErrorText error={errors.rooms} />
                                                    </div>
                                                    <div className="col-xl-3 col-sm-6 col-xs-6">
                                                        <label htmlFor="YearBuild" className="form-label">
                                                            {t('year_build')}
                                                        </label>
                                                        <input
                                                            type="number"
                                                            className="common-input"
                                                            id="YearBuild"
                                                            placeholder={t('year_build')}
                                                            value={data.property_age}
                                                            onChange={(e) => setData('property_age', e.target.value)}
                                                        />
                                                        <ErrorText error={errors.property_age} />
                                                    </div>
                                                    <div className="col-12">
                                                        <h6 className="checkboxes__title fw-500 font-18 mt-4">Amenities</h6>
                                                        <ErrorText error={errors.amenities} />
                                                        <div className="row gy-3 checkboxes">
                                                            <div className="col-md-4 col-sm-6 col-xs-6">
                                                                {amenities.slice(0, 7).map((amenity) => (
                                                                    <div className="common-check" key={amenity.id}>
                                                                        <input
                                                                            className="form-check-input"
                                                                            type="checkbox"
                                                                            checked={data.amenities.includes(Number(amenity.id))}
                                                                            onChange={() =>
                                                                                setData(
                                                                                    'amenities',
                                                                                    data.amenities.includes(Number(amenity.id))
                                                                                        ? data.amenities.filter((id) => id !== Number(amenity.id))
                                                                                        : [...data.amenities, Number(amenity.id)],
                                                                                )
                                                                            }
                                                                            id={`amenity-${amenity.id}`}
                                                                            placeholder={typeof amenity.name === 'string' ? amenity.name : undefined}
                                                                            title={typeof amenity.name === 'string' ? amenity.name : undefined}
                                                                        />
                                                                        <label className="form-check-label" htmlFor={`amenity-${amenity.id}`}>
                                                                            {amenity.name}
                                                                        </label>
                                                                    </div>
                                                                ))}
                                                                {amenities.slice(7, 14).map((amenity) => (
                                                                    <div className="common-check" key={amenity.id}>
                                                                        <input
                                                                            className="form-check-input"
                                                                            type="checkbox"
                                                                            checked={data.amenities.includes(Number(amenity.id))}
                                                                            onChange={() =>
                                                                                setData(
                                                                                    'amenities',
                                                                                    data.amenities.includes(Number(amenity.id))
                                                                                        ? data.amenities.filter((id) => id !== Number(amenity.id))
                                                                                        : [...data.amenities, Number(amenity.id)],
                                                                                )
                                                                            }
                                                                            id={`amenity-${amenity.id}`}
                                                                            placeholder={typeof amenity.name === 'string' ? amenity.name : undefined}
                                                                            title={typeof amenity.name === 'string' ? amenity.name : undefined}
                                                                        />
                                                                        <label className="form-check-label" htmlFor={`amenity-${amenity.id}`}>
                                                                            {amenity.name}
                                                                        </label>
                                                                    </div>
                                                                ))}
                                                                {amenities.slice(14, 21).map((amenity) => (
                                                                    <div className="common-check" key={amenity.id}>
                                                                        <input
                                                                            className="form-check-input"
                                                                            type="checkbox"
                                                                            checked={data.amenities.includes(Number(amenity.id))}
                                                                            onChange={() =>
                                                                                setData(
                                                                                    'amenities',
                                                                                    data.amenities.includes(Number(amenity.id))
                                                                                        ? data.amenities.filter((id) => id !== Number(amenity.id))
                                                                                        : [...data.amenities, Number(amenity.id)],
                                                                                )
                                                                            }
                                                                            id={`amenity-${amenity.id}`}
                                                                            placeholder={typeof amenity.name === 'string' ? amenity.name : undefined}
                                                                            title={typeof amenity.name === 'string' ? amenity.name : undefined}
                                                                        />
                                                                        <label className="form-check-label" htmlFor={`amenity-${amenity.id}`}>
                                                                            {amenity.name}
                                                                        </label>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-check mb-4">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="is_published"
                                            checked={data.is_published}
                                            onChange={(e) => setData('is_published', e.target.checked)}
                                        />
                                        <ErrorText error={errors.is_published} />
                                        <label className="form-check-label" htmlFor="is_published">
                                            {t('publish_now')}
                                        </label>
                                    </div>

                                    <button type="submit" className="btn btn-main w-100" disabled={processing || !hasActiveSubscription}>
                                        {processing ? t('submitting') : t('Submit_property')}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </App>
    );
}
