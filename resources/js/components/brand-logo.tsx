import { cn } from '@/lib/utils';

type LogoVariant = 'auto' | 'on-light' | 'on-dark';

interface BrandLogoProps {
    className?: string;
    imageClassName?: string;
    markOnly?: boolean;
    variant?: LogoVariant;
}

const assets = {
    logo: {
        light: '/brand/the-agency-logo-light.png',
        dark: '/brand/the-agency-logo-dark.png',
    },
    mark: {
        light: '/brand/the-agency-mark.png',
        dark: '/brand/the-agency-mark-dark.png',
    },
};

export default function BrandLogo({
    className,
    imageClassName,
    markOnly = false,
    variant = 'auto',
}: BrandLogoProps) {
    const source = markOnly ? assets.mark : assets.logo;
    const defaultSize = markOnly ? 'h-10 w-auto' : 'h-10 w-auto max-w-full';

    if (variant !== 'auto') {
        return (
            <span className={cn('inline-flex items-center', className)}>
                <img
                    src={variant === 'on-dark' ? source.dark : source.light}
                    alt="The Agency"
                    className={cn(
                        defaultSize,
                        'object-contain',
                        imageClassName,
                    )}
                />
            </span>
        );
    }

    return (
        <span className={cn('inline-flex items-center', className)}>
            <img
                src={source.light}
                alt="The Agency"
                className={cn(
                    defaultSize,
                    'object-contain dark:hidden',
                    imageClassName,
                )}
            />
            <img
                src={source.dark}
                alt="The Agency"
                className={cn(
                    defaultSize,
                    'hidden object-contain dark:block',
                    imageClassName,
                )}
            />
        </span>
    );
}
