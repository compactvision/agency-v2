import axios from 'axios';
import { useEffect, useState } from 'react';

export interface Municipality {
    id: number;
    name: string;
    image?: string;
    properties?: number;
    [key: string]: any;
}

export function useLocations(initialMunicipalities: Municipality[] = []) {
    const [municipalities, setMunicipalities] = useState<Municipality[]>(
        initialMunicipalities,
    );
    const [loading, setLoading] = useState<boolean>(
        initialMunicipalities.length === 0,
    );
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        if (initialMunicipalities.length > 0) {
            return;
        }

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
