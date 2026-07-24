import axios from 'axios';
import { useEffect, useState } from 'react';

export interface Ad {
    id: number;
    slug: string;
    title: string;
    reference: string;
    price: number;
    currency: string;
    type: string;
    [key: string]: any;
}

function normalizePaginatedAds(payload: any) {
    const source =
        payload && typeof payload === 'object' && !Array.isArray(payload)
            ? payload
            : {};
    const data = Array.isArray(source.data) ? source.data : [];
    const meta =
        source.meta &&
        typeof source.meta === 'object' &&
        !Array.isArray(source.meta)
            ? source.meta
            : {};
    const parsedTotal = Number(source.total ?? meta.total ?? data.length);
    const total = Number.isFinite(parsedTotal) ? parsedTotal : data.length;

    return {
        ...source,
        data,
        links: Array.isArray(source.links) ? source.links : [],
        meta: {
            ...meta,
            total,
        },
        total,
    };
}

export function useAds(filters: any = {}, initialAds: any = null) {
    const [ads, setAds] = useState<any>(() =>
        normalizePaginatedAds(initialAds),
    );
    const [loading, setLoading] = useState<boolean>(initialAds === null);
    const [error, setError] = useState<unknown>(null);
    const [hasUsedInitialData, setHasUsedInitialData] = useState(
        initialAds !== null,
    );

    useEffect(() => {
        if (hasUsedInitialData) {
            setHasUsedInitialData(false);
            return;
        }

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
                setAds(normalizePaginatedAds(result));
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
