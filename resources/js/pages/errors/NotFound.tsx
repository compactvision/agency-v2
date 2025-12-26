import App from '@/components/layouts/Home/App';
import Breadcumb from '@/components/ui/Breadcumb';
import React from 'react';

export default function NotFound() {
    return (
        <App>
            <Breadcumb title="Page Not Found" homeLink={route('home')} />
        </App>
    );
}
