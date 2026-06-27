import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

const images = ['/1.jpg', '/2.jpg', '/3.jpeg', '/4.jpg'];

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative flex min-h-dvh flex-col lg:grid lg:max-w-none lg:grid-cols-2 lg:px-0 bg-background">
            {/* Left Side: Slideshow (Visible on top in mobile, taking 22vh, full left side on desktop) */}
            <div className="relative h-[22vh] lg:h-full flex flex-col bg-muted text-white lg:border-r border-b lg:border-b-0 border-sidebar-border/50 overflow-hidden shrink-0">
                {images.map((img, idx) => (
                    <div
                        key={img}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                            idx === currentImageIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{
                            backgroundImage: `url(${img})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                ))}
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/45" />

                {/* Content Overlay */}
                <div className="relative z-20 m-auto text-center px-4 lg:px-10 max-w-lg flex flex-col items-center">
                    <div className="flex items-center justify-center gap-3 mb-2 lg:mb-4">
                        <img src="/dki.png" alt="DKI Jakarta Logo" className="h-9 lg:h-14 w-auto object-contain" />
                        <img src="/dprkp.png" alt="DPRKP Logo" className="h-9 lg:h-14 w-auto object-contain" />
                    </div>
                    <h2 className="text-lg sm:text-xl lg:text-3xl font-extrabold tracking-tight drop-shadow-md">
                        SISTEM INVENTARIS &amp; PERMINTAAN BARANG
                    </h2>
                    <div className="w-12 lg:w-16 h-[2px] lg:h-1 bg-sky-400 mx-auto my-2 lg:my-4 rounded-full" />
                    <p className="text-[10px] sm:text-xs lg:text-sm text-neutral-200 font-medium tracking-wide drop-shadow-sm">
                        Dinas Perumahan Rakyat dan Kawasan Permukiman Provinsi DKI Jakarta
                    </p>
                </div>
            </div>

            {/* Right Side: Form Container */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-semibold">{title}</h1>
                        <p className="text-sm text-balance text-muted-foreground">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
