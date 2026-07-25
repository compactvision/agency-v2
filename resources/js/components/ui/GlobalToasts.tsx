import { usePage } from '@inertiajs/react';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast, Toaster } from 'sonner';
import { useAppearance } from '@/hooks/use-appearance';

type ToastPageProps = {
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

export default function GlobalToasts() {
    const { t } = useTranslation();
    const { appearance } = useAppearance();
    const { flash, errors, status } = usePage<ToastPageProps>().props;
    const errorMessage = useMemo(
        () => Object.values(errors ?? {}).find(Boolean),
        [errors],
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
