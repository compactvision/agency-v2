import axios from 'axios';
import { useEffect, useState } from 'react';

export interface Ad {
    id: number;
    title: string;
    reference: string;
    price: number;
    currency: string;
    type: string;
    [key: string]: any;
}

export function useAds(filters: any = {}) {
    const [ads, setAds] = useState<any>({ data: [], links: [], meta: {} });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        const fetchAds = async () => {
            setLoading(true);
            try {
                // Convert arrays to comma-separated strings or handle array params as needed by backend
                // Axios handles params serialization well by default
                const response = await axios.get('/api/ads/public', {
                    params: filters,
                });
                // API likely returns paginated structure now via paginate() in service
                // response.data.data should contain the paginator object if wrapped in separate 'data' key by ApiResponse
                // or response.data if generic.
                // Using ApiResponse::success($data), and $data is $query->paginate(12)
                // Paginate returns json like { data: [...], current_page: 1, ... }
                // ApiResponse wraps it in { success: true, data: { data: [...], ... } }
                const result = response.data.data || response.data;
                setAds(result);
            } catch (err) {
                setError(err);
                console.error('Failed to fetch ads', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAds();
    }, [JSON.stringify(filters)]); // Re-fetch when filters change (deep comparison via stringify)

    return { ads, loading, error };
}
