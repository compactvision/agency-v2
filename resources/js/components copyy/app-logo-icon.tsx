import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(
    props: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>,
) {
    return (
        <img {...props} src="/brand/the-agency-mark.png" alt="The Agency" />
    );
}
