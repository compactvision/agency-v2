import App from '@/components/layouts/Home/App'
import AboutStart from '@/components/section/about/AboutStart'
import AboutType from '@/components/section/about/AboutType'
import Breadcumb from '@/components/ui/Breadcumb'
import NewsLetter from '@/components/ui/NewsLetter'
import React from 'react'
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function About() {
    const { t } = useTranslation();
  return (
    <App>
        <Head title="About" />
        <Breadcumb title={t('about')} homeLink={route('home')} />

        <AboutStart />
        <AboutType />
        <NewsLetter />
    </App>
  )
}
