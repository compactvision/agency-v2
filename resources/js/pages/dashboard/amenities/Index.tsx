import AmenityPopup from '@/components/forms/AmenityPopup';
import Dashboard from '@/components/layouts/Dashboard/Dashboard';
import BackButton from '@/components/ui/BackButton';
import { router, usePage } from '@inertiajs/react';
import { Edit3, Package, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Amenity {
    id: number;
    name: string;
    slug: string;
    icon?: string;
    description?: string;
}

interface PageProps {
    amenities: Amenity[];
    filters: {
        search?: string;
    };
}

export default function Index() {
    const { t } = useTranslation();
    const { amenities = [], filters = {} } = usePage()
        .props as unknown as PageProps;
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedAmenity, setSelectedAmenity] = useState<Amenity | undefined>(
        undefined,
    );

    const filteredAmenities = amenities.filter((a) =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const handleDelete = (id: number) => {
        if (confirm(t('confirm_delete_amenity'))) {
            router.delete(route('dashboard.amenities.destroy', id));
        }
    };

    const handleEdit = (amenity: Amenity) => {
        setSelectedAmenity(amenity);
        setIsOpen(true);
    };

    return (
        <Dashboard>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
                <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <BackButton />
                        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                                    {t('amenities.amenities')}
                                </h1>
                                <p className="mt-2 text-gray-600">
                                    {t('manage_amenities_description')}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setSelectedAmenity(undefined);
                                    setIsOpen(true);
                                }}
                                className="inline-flex items-center rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <Plus size={20} className="mr-2" />
                                {t('new_amenity')}
                            </button>
                        </div>
                    </div>

                    <div className="relative mb-6">
                        <Search
                            className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder={t('search_amenity')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-2xl border border-gray-200 bg-white py-4 pr-4 pl-12 shadow-sm transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredAmenities.map((amenity) => (
                            <div
                                key={amenity.id}
                                className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl"
                            >
                                <div className="absolute top-0 right-0 flex gap-2 p-4 opacity-0 transition-opacity group-hover:opacity-100">
                                    <button
                                        onClick={() => handleEdit(amenity)}
                                        className="rounded-xl bg-emerald-50 p-2 text-emerald-600 transition-colors hover:bg-emerald-100"
                                    >
                                        <Edit3 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(amenity.id)}
                                        className="rounded-xl bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition-transform duration-300 group-hover:scale-110">
                                    <Package size={28} />
                                </div>

                                <h3 className="mb-1 text-xl font-bold text-gray-900">
                                    {amenity.name}
                                </h3>
                                <p className="mb-4 font-mono text-sm text-gray-500">
                                    {amenity.slug}
                                </p>
                                <p className="line-clamp-2 min-h-[2.5rem] text-sm text-gray-600">
                                    {amenity.description ||
                                        t('no_description_provided')}
                                </p>
                            </div>
                        ))}

                        {filteredAmenities.length === 0 && (
                            <div className="col-span-full py-20 text-center">
                                <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 text-gray-300">
                                    <Package size={40} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    {t('no_amenity_found')}
                                </h3>
                                <p className="text-gray-500">
                                    {t('try_another_search_or_create')}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AmenityPopup
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                amenity={selectedAmenity}
            />
        </Dashboard>
    );
}
