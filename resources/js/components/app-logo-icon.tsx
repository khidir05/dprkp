import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/siperus.png"
            alt="SIPERUS Logo"
            {...props}
        />
    );
}
