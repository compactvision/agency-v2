import CategoryPopup from '@/components/forms/CategoryPopup';
import Dashboard from '@/components/layouts/Dashboard/Dashboard';
import BackButton from '@/components/ui/BackButton';
import { router, usePage } from '@inertiajs/react';
import { Edit3, Layers, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Category {
    id: number;
    name: string;
    slug: string;
    icon?: string;
    description?: string;
}

interface PageProps {
    categories: Category[];
    filters: {
        search?: string;
    };
}

export default function Index() {
    const { categories = [], filters = {} } = usePage()
        .props as unknown as PageProps;
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<
        Category | undefined
    >(undefined);

    const filteredCategories = categories.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const handleDelete = (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
            router.delete(route('dashboard.categories.destroy', id));
        }
    };

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
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
                                    Catégories
                                </h1>
                                <p className="mt-2 text-gray-600">
                                    Gérez les types de propriétés disponibles
                                    sur votre plateforme.
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setSelectedCategory(undefined);
                                    setIsOpen(true);
                                }}
                                className="inline-flex items-center rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 font-bold text-white shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <Plus size={20} className="mr-2" />
                                Nouvelle Catégorie
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
                            placeholder="Rechercher une catégorie..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-2xl border border-gray-200 bg-white py-4 pr-4 pl-12 shadow-sm transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-amber-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredCategories.map((category) => (
                            <div
                                key={category.id}
                                className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl"
                            >
                                <div className="absolute top-0 right-0 flex gap-2 p-4 opacity-0 transition-opacity group-hover:opacity-100">
                                    <button
                                        onClick={() => handleEdit(category)}
                                        className="rounded-xl bg-amber-50 p-2 text-amber-600 transition-colors hover:bg-amber-100"
                                    >
                                        <Edit3 size={16} />
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDelete(category.id)
                                        }
                                        className="rounded-xl bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 transition-transform duration-300 group-hover:scale-110">
                                    <Layers size={28} />
                                </div>

                                <h3 className="mb-1 text-xl font-bold text-gray-900">
                                    {category.name}
                                </h3>
                                <p className="mb-4 font-mono text-sm text-gray-500">
                                    {category.slug}
                                </p>
                                <p className="line-clamp-2 min-h-[2.5rem] text-sm text-gray-600">
                                    {category.description ||
                                        'Aucune description fournie.'}
                                </p>
                            </div>
                        ))}

                        {filteredCategories.length === 0 && (
                            <div className="col-span-full py-20 text-center">
                                <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 text-gray-300">
                                    <Layers size={40} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    Aucune catégorie trouvée
                                </h3>
                                <p className="text-gray-500">
                                    Essayez une autre recherche ou créez-en une
                                    nouvelle.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <CategoryPopup
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                category={selectedCategory}
            />
        </Dashboard>
    );
}
