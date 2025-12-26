import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp, ArrowRight } from 'lucide-react';

interface SearchResult {
    id: string;
    title: string;
    description: string;
    category: string;
    url: string;
}

interface SearchBarProps {
    placeholder?: string;
    onSearch?: (query: string) => void;
    onSelect?: (result: SearchResult) => void;
    showSuggestions?: boolean;
    showRecentSearches?: boolean;
    className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
                                                 placeholder = "Rechercher...",
                                                 onSearch,
                                                 onSelect,
                                                 showSuggestions = true,
                                                 showRecentSearches = true,
                                                 className = ""
                                             }) => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [recentSearches, setRecentSearches] = useState<string[]>([
        "React hooks",
        "Laravel Inertia",
        "TailwindCSS",
        "TypeScript"
    ]);
    const [trendingSearches] = useState<string[]>([
        "Next.js 14",
        "React 18",
        "Vue 3",
        "Nuxt 3"
    ]);

    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Données de démonstration
    const mockResults: SearchResult[] = [
        {
            id: '1',
            title: 'React Hooks Guide',
            description: 'Guide complet sur les hooks React',
            category: 'Documentation',
            url: '/docs/react-hooks'
        },
        {
            id: '2',
            title: 'Laravel Inertia Setup',
            description: 'Comment configurer Inertia.js avec Laravel',
            category: 'Tutorial',
            url: '/tutorials/laravel-inertia'
        },
        {
            id: '3',
            title: 'TailwindCSS Components',
            description: 'Collection de composants TailwindCSS',
            category: 'Resources',
            url: '/resources/tailwind-components'
        },
        {
            id: '4',
            title: 'TypeScript Best Practices',
            description: 'Bonnes pratiques TypeScript',
            category: 'Guide',
            url: '/guides/typescript'
        }
    ];

    // Fermer la liste quand on clique ailleurs
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Recherche avec debounce
    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            if (query.trim()) {
                performSearch(query);
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(delayedSearch);
    }, [query]);

    const performSearch = (searchQuery: string) => {
        setIsLoading(true);

        // Simulation d'une recherche asynchrone
        setTimeout(() => {
            const filteredResults = mockResults.filter(result =>
                result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                result.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setResults(filteredResults);
            setIsLoading(false);
        }, 500);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        setIsOpen(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && query.trim()) {
            handleSearch(query);
        }
        if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    const handleSearch = (searchQuery: string) => {
        // Ajouter à l'historique
        if (searchQuery && !recentSearches.includes(searchQuery)) {
            setRecentSearches(prev => [searchQuery, ...prev.slice(0, 4)]);
        }

        setIsOpen(false);
        onSearch?.(searchQuery);
    };

    const handleResultSelect = (result: SearchResult) => {
        setQuery(result.title);
        setIsOpen(false);
        onSelect?.(result);
    };

    const clearSearch = () => {
        setQuery('');
        setResults([]);
        inputRef.current?.focus();
    };

    const removeRecentSearch = (searchToRemove: string) => {
        setRecentSearches(prev => prev.filter(search => search !== searchToRemove));
    };

    return (
        <div ref={searchRef} className={`relative w-full max-w-2xl mx-auto ${className}`}>
            {/* Barre de recherche */}
            <div className="relative">
                <div className="relative flex items-center">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />

                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        onFocus={() => setIsOpen(true)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        className="w-full pl-10 pr-12 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white shadow-sm"
                    />

                    {query && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Indicateur de chargement */}
                {isLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                    </div>
                )}
            </div>

            {/* Dropdown avec résultats */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-96 overflow-y-auto z-50">
                    {/* Résultats de recherche */}
                    {query && results.length > 0 && (
                        <div className="p-2">
                            <div className="text-sm font-medium text-gray-500 px-3 py-2">
                                Résultats ({results.length})
                            </div>
                            {results.map((result) => (
                                <button
                                    key={result.id}
                                    onClick={() => handleResultSelect(result)}
                                    className="w-full text-left px-3 py-3 hover:bg-gray-50 rounded-lg transition-colors flex items-start gap-3"
                                >
                                    <Search className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-gray-900 truncate">
                                            {result.title}
                                        </div>
                                        <div className="text-sm text-gray-500 truncate">
                                            {result.description}
                                        </div>
                                        <div className="text-xs text-blue-600 mt-1">
                                            {result.category}
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Aucun résultat */}
                    {query && results.length === 0 && !isLoading && (
                        <div className="p-4 text-center text-gray-500">
                            <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            <p>Aucun résultat pour "{query}"</p>
                        </div>
                    )}

                    {/* Recherches récentes */}
                    {!query && showRecentSearches && recentSearches.length > 0 && (
                        <div className="p-2 border-b border-gray-100">
                            <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm font-medium text-gray-500">
                  Recherches récentes
                </span>
                            </div>
                            {recentSearches.map((search, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setQuery(search);
                                        handleSearch(search);
                                    }}
                                    className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3 group"
                                >
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span className="flex-1 text-gray-700">{search}</span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeRecentSearch(search);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                    </button>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Recherches tendances */}
                    {!query && showSuggestions && (
                        <div className="p-2">
                            <div className="text-sm font-medium text-gray-500 px-3 py-2 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                Tendances
                            </div>
                            {trendingSearches.map((search, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setQuery(search);
                                        handleSearch(search);
                                    }}
                                    className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
                                >
                                    <TrendingUp className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-700">{search}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Exemple d'utilisation
export default function SearchBarDemo() {
    const handleSearch = (query: string) => {
        console.log('Recherche:', query);
        // Ici vous pourriez rediriger vers une page de résultats
        // window.location.href = `/search?q=${encodeURIComponent(query)}`;
    };

    const handleSelect = (result: any) => {
        console.log('Résultat sélectionné:', result);
        // Ici vous pourriez rediriger vers la page du résultat
        // window.location.href = result.url;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
                    Composant Barre de Recherche
                </h1>

                <SearchBar
                    placeholder="Rechercher des articles, tutoriels..."
                    onSearch={handleSearch}
                    onSelect={handleSelect}
                    showSuggestions={true}
                    showRecentSearches={true}
                    className="mb-8"
                />

                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Fonctionnalités</h2>
                    <ul className="space-y-2 text-gray-600">
                        <li>• Recherche en temps réel avec debounce</li>
                        <li>• Suggestions et recherches récentes</li>
                        <li>• Indicateur de chargement</li>
                        <li>• Fermeture automatique au clic extérieur</li>
                        <li>• Navigation au clavier (Enter, Escape)</li>
                        <li>• Design responsive et moderne</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
