import { LucideChevronDown, LucideHome, LucideSearch } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Municipality = {
    id: number | string;
    name: string;
};

export default function MunicipalityPicker({
    municipalities,
    value,
    onChange,
    mobile = false,
}: {
    municipalities: Municipality[];
    value: string;
    onChange: (value: string) => void;
    mobile?: boolean;
}) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listboxId = useId();
    const selected = municipalities.find(
        (municipality) => municipality.id.toString() === value,
    );
    const filtered = municipalities.filter((municipality) =>
        municipality.name.toLowerCase().includes(query.toLowerCase()),
    );

    useEffect(() => {
        const closeOutside = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', closeOutside);
        return () => document.removeEventListener('mousedown', closeOutside);
    }, []);

    useEffect(() => {
        if (open) requestAnimationFrame(() => inputRef.current?.focus());
    }, [open]);

    const select = (nextValue: string) => {
        onChange(nextValue);
        setQuery('');
        setOpen(false);
    };

    return (
        <div
            ref={containerRef}
            className={`relative flex-1 ${mobile ? 'border-b border-gray-100' : ''}`}
            onKeyDown={(event) => {
                if (event.key === 'Escape') {
                    event.stopPropagation();
                    setOpen(false);
                }
            }}
        >
            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                className={`flex w-full items-center text-left ${
                    mobile ? 'gap-3 px-4 py-4' : 'justify-between px-6 py-3'
                }`}
                aria-expanded={open}
                aria-controls={listboxId}
                aria-haspopup="listbox"
            >
                {mobile && (
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1E3A5F]/8">
                        <LucideHome
                            aria-hidden="true"
                            className="h-4 w-4 text-[#C9A84C]"
                        />
                    </span>
                )}
                <span className="flex-1">
                    <span className="mb-0.5 block text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                        {t('location')}
                    </span>
                    <span
                        className={`block text-sm font-medium ${
                            selected ? 'text-gray-900' : 'text-gray-600'
                        }`}
                    >
                        {selected?.name ||
                            t(
                                'select_municipality',
                                'Sélectionner une commune',
                            )}
                    </span>
                </span>
                <LucideChevronDown
                    aria-hidden="true"
                    className={`h-4 w-4 text-gray-500 transition-transform ${
                        open ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {open && (
                <div
                    className={`absolute z-[200] overflow-hidden border border-gray-100 bg-white shadow-2xl ${
                        mobile
                            ? 'top-full right-0 left-0 max-h-64 rounded-b-2xl'
                            : 'top-[calc(100%+8px)] left-0 w-72 rounded-2xl'
                    }`}
                >
                    <div className="border-b border-gray-100 p-2">
                        <label
                            htmlFor={`${listboxId}-search`}
                            className="sr-only"
                        >
                            {t('search_municipality', 'Rechercher une commune')}
                        </label>
                        <div className="relative">
                            <LucideSearch
                                aria-hidden="true"
                                className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-gray-500"
                            />
                            <input
                                ref={inputRef}
                                id={`${listboxId}-search`}
                                type="search"
                                value={query}
                                onChange={(event) =>
                                    setQuery(event.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 py-2 pr-3 pl-9 text-sm"
                            />
                        </div>
                    </div>
                    <div
                        id={listboxId}
                        role="listbox"
                        aria-label={t('location')}
                        className="max-h-48 overflow-y-auto p-1"
                    >
                        <button
                            type="button"
                            role="option"
                            aria-selected={!value}
                            onClick={() => select('')}
                            className="w-full rounded-md px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100"
                        >
                            {t('all_municipalities', 'Toutes les communes')}
                        </button>
                        {filtered.map((municipality) => (
                            <button
                                key={municipality.id}
                                type="button"
                                role="option"
                                aria-selected={
                                    municipality.id.toString() === value
                                }
                                onClick={() =>
                                    select(municipality.id.toString())
                                }
                                className={`w-full rounded-md px-3 py-2.5 text-left text-sm ${
                                    municipality.id.toString() === value
                                        ? 'bg-[#1E3A5F]/10 font-semibold text-[#1E3A5F]'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                {municipality.name}
                            </button>
                        ))}
                        {filtered.length === 0 && (
                            <p
                                role="status"
                                className="px-3 py-3 text-center text-sm text-gray-600"
                            >
                                {t('no_results', 'Aucun résultat')}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
