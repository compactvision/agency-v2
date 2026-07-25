import { router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast, Toaster } from 'sonner';
import { useAppearance } from '@/hooks/use-appearance';

export type ToastPageProps = {
    [key: string]: unknown;
    flash?: {
        success?: string | null;
        message?: string | null;
        error?: string | null;
        info?: string | null;
    };
    errors?: Record<string, string>;
    status?: string | null;
};

const statusMessages: Record<string, { type: 'success' | 'info'; key: string }> =
    {
        'verification-link-sent': {
            type: 'success',
            key: 'verification_link_sent',
        },
        'passwords.sent': { type: 'success', key: 'reset_link_sent' },
        'passwords.reset': {
            type: 'success',
            key: 'password_reset_success',
        },
    };

type GlobalToastsProps = {
    initialPageProps: ToastPageProps;
};

export default function GlobalToasts({
    initialPageProps,
}: GlobalToastsProps) {
    const { t } = useTranslation();
    const { appearance } = useAppearance();
    const [pageProps, setPageProps] =
        useState<ToastPageProps>(initialPageProps);
    const { flash, errors, status } = pageProps;
    const errorMessage = useMemo(
        () => Object.values(errors ?? {}).find(Boolean),
        [errors],
    );

    useEffect(
        () =>
            router.on('navigate', (event) => {
                setPageProps(event.detail.page.props as ToastPageProps);
            }),
        [],
    );

    useEffect(() => {
        const successMessage = flash?.success ?? flash?.message;

        if (successMessage) {
            toast.success(successMessage, {
                id: `flash-success:${successMessage}`,
            });
        }

        if (flash?.error) {
            toast.error(flash.error, {
                id: `flash-error:${flash.error}`,
            });
        }

        if (flash?.info) {
            toast.info(flash.info, {
                id: `flash-info:${flash.info}`,
            });
        }
    }, [flash?.error, flash?.info, flash?.message, flash?.success]);

    useEffect(() => {
        if (!status) return;

        const configuredStatus = statusMessages[status];
        const message = configuredStatus
            ? t(configuredStatus.key)
            : status.includes('.') || status.includes('_')
              ? t(status)
              : status;

        if (configuredStatus?.type === 'info') {
            toast.info(message, { id: `status:${status}` });
            return;
        }

        toast.success(message, { id: `status:${status}` });
    }, [status, t]);

    useEffect(() => {
        if (!errorMessage || flash?.error) return;

        toast.error(errorMessage, {
            id: `validation-error:${errorMessage}`,
        });
    }, [errorMessage, flash?.error]);

    return (
        <Toaster
            richColors
            closeButton
            theme={appearance}
            position="top-right"
            toastOptions={{
                classNames: {
                    toast: 'global-toast',
                    title: 'global-toast__title',
                    description: 'global-toast__description',
                },
            }}
        />
    );
}
