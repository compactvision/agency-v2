import { useForm } from '@inertiajs/react';
import { Layers, X } from 'lucide-react';
import { useEffect } from 'react';

interface CategoryPopupProps {
    isOpen: boolean;
    onClose: () => void;
    category?: {
        id: number;
        name: string;
        icon?: string;
        description?: string;
    };
}

export default function CategoryPopup({
    isOpen,
    onClose,
    category,
}: CategoryPopupProps) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            name: '',
            icon: '',
            description: '',
        });

    useEffect(() => {
        if (category) {
            setData({
                name: category.name || '',
                icon: category.icon || '',
                description: category.description || '',
            });
        } else {
            reset();
        }
    }, [category, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (category) {
            put(route('dashboard.categories.update', category.id), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        } else {
            post(route('dashboard.categories.store'), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-all duration-300">
            <div className="w-full max-w-lg animate-in overflow-hidden rounded-2xl bg-white shadow-2xl duration-200 fade-in zoom-in">
                <div className="relative border-b border-gray-100 p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                            <Layers size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {category
                                    ? 'Modifier la catégorie'
                                    : 'Nouvelle catégorie'}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {category
                                    ? 'Mettez à jour les informations de la catégorie'
                                    : 'Créez une nouvelle catégorie pour vos propriétés'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 p-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Nom de la catégorie
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={`w-full rounded-xl border px-4 py-3 ${errors.name ? 'border-red-500' : 'border-gray-200'} transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-amber-500`}
                            placeholder="Ex: Appartement, Villa, Bureau..."
                        />
                        {errors.name && (
                            <p className="text-xs font-medium text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Icône (Lucide name)
                        </label>
                        <input
                            type="text"
                            value={data.icon}
                            onChange={(e) => setData('icon', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-amber-500"
                            placeholder="Ex: home, building, warehouse..."
                        />
                        <p className="text-xs font-medium text-gray-400 italic">
                            Utilisez le nom d'une icône Lucide React
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Description
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            rows={3}
                            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-amber-500"
                            placeholder="Description optionnelle..."
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-xl bg-gray-100 px-4 py-3 text-sm font-bold text-gray-700 transition-all hover:bg-gray-200 active:scale-95"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-[2] rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-amber-500/20 transition-all hover:from-amber-600 hover:to-amber-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {processing
                                ? 'Enregistrement...'
                                : category
                                  ? 'Mettre à jour'
                                  : 'Créer la catégorie'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
