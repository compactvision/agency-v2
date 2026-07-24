import { useForm } from '@inertiajs/react';
import { Layers, X } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
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
        <div
            className="agency-modal-layer fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-all duration-300"
            role="dialog"
            aria-modal="true"
        >
            <div className="agency-modal w-full max-w-lg animate-in overflow-hidden rounded-2xl bg-white shadow-2xl duration-200 fade-in zoom-in">
                <div className="agency-modal-header relative border-b border-gray-100 p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                            <Layers size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {category
                                    ? t('edit_category')
                                    : t('new_category')}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {category
                                    ? t('update_category_description')
                                    : t('add_category_description')}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label={t('close')}
                        className="absolute top-6 right-6 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="agency-modal-body space-y-5 p-6"
                >
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                            {t('category_name')}
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={`w-full rounded-xl border px-4 py-3 ${errors.name ? 'border-red-500' : 'border-gray-200'} transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-amber-500`}
                            placeholder={t('category_name_example')}
                        />
                        {errors.name && (
                            <p className="text-xs font-medium text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                            {t('lucide_icon')}
                        </label>
                        <input
                            type="text"
                            value={data.icon}
                            onChange={(e) => setData('icon', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-amber-500"
                            placeholder={t('category_icon_example')}
                        />
                        <p className="text-xs font-medium text-gray-400 italic">
                            {t('lucide_icon_hint')}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                            {t('description')}
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            rows={3}
                            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-amber-500"
                            placeholder={t('optional_description')}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="agency-btn-secondary flex-1 rounded-xl px-4 py-3 text-sm font-bold transition-all active:scale-95"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="agency-btn-primary flex-[2] rounded-xl px-4 py-3 text-sm font-bold shadow-lg transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {processing
                                ? t('saving')
                                : category
                                  ? t('update')
                                  : t('create_category')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
