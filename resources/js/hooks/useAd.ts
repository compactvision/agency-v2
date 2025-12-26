import axios from 'axios';
import { useEffect, useState } from 'react';

export function useAd(id: number | string | undefined) {
    const [ad, setAd] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        if (!id) return;

        const fetchAd = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/ads/public/${id}`);
                const data = response.data.data || response.data;
                setAd(data);
            } catch (err) {
                setError(err);
                console.error('Failed to fetch ad', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAd();
    }, [id]);

    return { ad, loading, error };
}
