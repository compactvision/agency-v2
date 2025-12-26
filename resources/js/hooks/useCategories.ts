import axios from 'axios';
import { useEffect, useState } from 'react';

export interface Category {
    id: number;
    name: string;
    slug: string;
    [key: string]: any;
}

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/categories');
                const data = response.data.data || response.data;
                setCategories(data);
            } catch (err) {
                setError(err);
                console.error('Failed to fetch categories', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return { categories, loading, error };
}
