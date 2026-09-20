import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import { Bell, Check } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function PropertySearchAlert({
    zoneId,
    zoneName,
    subscribed,
    onEnabled,
}: {
    zoneId: string;
    zoneName: string;
    subscribed: boolean;
    onEnabled: () => void;
}) {
    const { auth } = usePage<SharedData>().props;
    const { t } = useTranslation();
    const [dismissed, setDismissed] = useState(false);
    const [enabled, setEnabled] = useState(subscribed);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState('');

    async function subscribe() {
        if (pending) return;
        setPending(true);
        setError('');
        try {
            await axios.post(route('search-alerts.store'), {
                municipality_id: Number(zoneId),
            });
            setEnabled(true);
            onEnabled();
        } catch {
            setError(t('search_alert.error'));
        } finally {
            setPending(false);
        }
    }

    if (dismissed) return null;

    return (
        <aside
            className="mb-6 rounded-2xl border border-[#CF8E19]/30 bg-white p-5 dark:bg-[#413D3C]"
            aria-label={t('search_alert.label')}
        >
            <div className="flex items-start gap-3">
                {enabled ? (
                    <Check
                        className="mt-1 h-5 w-5 shrink-0 text-green-600"
                        aria-hidden="true"
                    />
                ) : (
                    <Bell
                        className="mt-1 h-5 w-5 shrink-0 text-[#CF8E19]"
                        aria-hidden="true"
                    />
                )}
                <div className="flex-1">
                    <p
                        className="font-semibold text-gray-900 dark:text-white"
                        role="status"
                    >
                        {enabled
                            ? t('search_alert.enabled', { zone: zoneName })
                            : t('search_alert.question', { zone: zoneName })}
                    </p>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-200">
                        {t('search_alert.description')}
                    </p>
                    {!enabled && (
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                            {!auth?.user ? (
                                <Link
                                    href={route('login')}
                                    className="rounded-xl bg-[#413D3C] px-4 py-2 text-sm font-semibold text-white dark:bg-[#CF8E19] dark:text-[#292625]"
                                >
                                    {t('search_alert.login')}
                                </Link>
                            ) : !auth.user.email_verified_at ? (
                                <Link
                                    href={route('verification.notice')}
                                    className="rounded-xl bg-[#413D3C] px-4 py-2 text-sm font-semibold text-white"
                                >
                                    {t('search_alert.verify')}
                                </Link>
                            ) : (
                                <button
                                    type="button"
                                    disabled={pending}
                                    onClick={subscribe}
                                    className="rounded-xl bg-[#413D3C] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 dark:bg-[#CF8E19] dark:text-[#292625]"
                                >
                                    {pending
                                        ? t('search_alert.saving')
                                        : t('search_alert.yes')}
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => setDismissed(true)}
                                className="rounded-xl px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-[#292625]"
                            >
                                {t('search_alert.no')}
                            </button>
                        </div>
                    )}
                    {error && (
                        <p role="alert" className="mt-3 text-sm text-red-600">
                            {error}
                        </p>
                    )}
                </div>
            </div>
        </aside>
    );
}
