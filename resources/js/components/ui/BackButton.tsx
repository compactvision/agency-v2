import { router } from '@inertiajs/react';
import { ArrowLeft, Home, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface BackButtonProps {
    defaultRoute?: string;
    label?: string;
    preserveState?: boolean;
    preserveScroll?: boolean;
    variant?: 'text' | 'outlined' | 'contained';
    size?: 'sm' | 'md' | 'lg';
    icon?: 'left' | 'right' | 'home';
    fullWidth?: boolean;
    className?: string;
}

const BackButton = ({
    defaultRoute = '/',
    label = 'Retour',
    preserveState = true,
    preserveScroll = true,
    variant = 'text',
    size = 'md',
    icon = 'left',
    fullWidth = false,
    className = ''
}: BackButtonProps) => {
    const [canGoBack, setCanGoBack] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        setCanGoBack(window.history.length > 1);
    }, []);

    const handleClick = () => {
        if (canGoBack) {
            window.history.back();
        } else {
            router.visit(defaultRoute, { preserveState, preserveScroll });
        }
    };

    const getIcon = () => {
        switch (icon) {
            case 'right':
                return <ArrowRight size={18} />;
            case 'home':
                return <Home size={18} />;
            default:
                return <ArrowLeft size={18} />;
        }
    };

    const getVariantClasses = () => {
        switch (variant) {
            case 'outlined':
                return 'bg-white border-2 border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300 focus:ring-amber-500';
            case 'contained':
                return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white hover:from-amber-500 hover:to-amber-700 focus:ring-amber-500 shadow-md shadow-amber-500/30';
            default: // 'text'
                return 'bg-transparent text-amber-600 hover:bg-amber-50 focus:ring-amber-500';
        }
    };

    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'px-3 py-1.5 text-sm';
            case 'lg':
                return 'px-6 py-3 text-lg';
            default: // 'md'
                return 'px-4 py-2 text-base';
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`
                inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                ${getVariantClasses()}
                ${getSizeClasses()}
                ${fullWidth ? 'w-full' : ''}
                ${className}
            `}
            aria-label={t(label)}
        >
            {getIcon()}
            <span>{t(label)}</span>
        </button>
    );
};

export default BackButton;