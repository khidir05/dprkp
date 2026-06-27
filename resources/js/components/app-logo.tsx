export default function AppLogo() {
    return (
        <div className="flex items-center gap-2 overflow-hidden w-full">
            <div className="flex items-center gap-1.5 shrink-0">
                <img src="/dki.png" alt="DKI Logo" className="h-7 w-auto object-contain" />
                <img src="/dprkp.png" alt="DPRKP Logo" className="h-7 w-auto object-contain" />
            </div>
            <div className="grid flex-1 text-left text-xs leading-tight min-w-0">
                <span className="truncate font-bold text-neutral-900 dark:text-neutral-100 tracking-tight text-sm">
                    DPRKP
                </span>
                <span className="truncate text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">
                    DKI JAKARTA
                </span>
            </div>
        </div>
    );
}
