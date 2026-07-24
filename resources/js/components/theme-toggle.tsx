import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ThemeToggleProps {
    className?: string;
    compact?: boolean;
}

export default function ThemeToggle({
    className,
    compact = true,
}: ThemeToggleProps) {
    const { appearance, updateAppearance } = useAppearance();
    const { t } = useTranslation();
    const systemDark =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark =
        appearance === 'dark' || (appearance === 'system' && systemDark);
    const label = isDark
        ? t('enable_light_mode', 'Activer le mode clair')
        : t('enable_dark_mode', 'Activer le mode sombre');

    return (
        <button
            type="button"
            onClick={() => updateAppearance(isDark ? 'light' : 'dark')}
            aria-label={label}
            title={label}
            aria-pressed={isDark}
            className={cn(
                'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-current/15 px-3 transition-colors',
                className,
            )}
        >
            {isDark ? (
                <Sun className="h-4 w-4" aria-hidden="true" />
            ) : (
                <Moon className="h-4 w-4" aria-hidden="true" />
            )}
            {!compact && (
                <span className="text-xs font-semibold">
                    {isDark
                        ? t('light_mode', 'Mode clair')
                        : t('dark_mode', 'Mode sombre')}
                </span>
            )}
        </button>
    );
}
