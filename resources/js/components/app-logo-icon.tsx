import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(
    props: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'>,
) {
    return (
        <img
            {...props}
            src="/brand/the-agency-mark.png"
            alt={props.alt ?? 'The Agency'}
        />
    );
}
