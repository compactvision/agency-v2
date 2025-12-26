import axios from 'axios';
import { useEffect, useState } from 'react';

export interface Amenity {
    id: number;
    name: string;
    [key: string]: any;
}

export function useAmenities() {
    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        const fetchAmenities = async () => {
            try {
                const response = await axios.get('/api/amenities');
                const data = response.data.data || response.data;
                setAmenities(data);
            } catch (err) {
                setError(err);
                console.error('Failed to fetch amenities', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAmenities();
    }, []);

    return { amenities, loading, error };
}
