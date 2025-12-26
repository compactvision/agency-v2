import axios from 'axios';
import { useEffect, useState } from 'react';

export interface Municipality {
    id: number;
    name: string;
    [key: string]: any;
}

export function useLocations() {
    const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await axios.get('/api/municipalities');
                // Same assumption as useAds
                const data = response.data.data || response.data;
                setMunicipalities(data);
            } catch (err) {
                setError(err);
                console.error('Failed to fetch municipalities', err);
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, []);

    return { municipalities, loading, error };
}
